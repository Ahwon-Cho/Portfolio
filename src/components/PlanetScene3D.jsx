import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const PLANET_RADIUS = 3.35
const FOCUSED_THEME_SCALE = 1.8
// A rigid stage on the front shoulder. Never bend the models to fit the globe.
const GROUND_HEIGHT = 3.12
const FOCUSED_THEME_RADIUS = 0.85
const HIDDEN_THEME_HEIGHT = -3.4
const FRONT_THEME_THRESHOLD = 0.65
const WORLD_VERTICAL_OFFSET = 1.24
const THEME_FRAME = { size: 0.34 }
const INTRO_DELAY = 1.05
const INTRO_DURATION = 3.6
const THEME_REVEAL_START = INTRO_DELAY + INTRO_DURATION * 0.55
const THEME_REVEAL_DURATION = 0.72
// Finish each rise, then hold briefly before the next theme starts.
const THEME_REVEAL_STAGGER = THEME_REVEAL_DURATION + 0.14
const THEME_REVEAL_RISE = 3.2

// Zero velocity and acceleration at either end: gestures settle instead of
// reversing like a metronome. Each action has its own reach, hold, and release.
const easeMotion = (time, start, end) => THREE.MathUtils.smootherstep(time, start, end)
const holdMotion = (time, start, arrive, leave, finish) => (
  easeMotion(time, start, arrive) * (1 - easeMotion(time, leave, finish))
)

const COLORS = {
  planet: 0xe7e8ea,
  white: 0xf8f8f6,
  pale: 0xe0e2e5,
  mid: 0xbfc3c9,
  dark: 0x5f6671,
  ink: 0x242832,
  red: 0xc94a43,
  green: 0x5d8e68,
  blue: 0x2949a9,
  blossom: 0xd9a2ae,
}

// Muted washes in carousel order: coffee, work, cherry-blossom park, garden.
const EARTH_THEME_TINTS = [0xe8d5c9, 0xcdd9ee, 0xe8d2de, 0xd2dfcf]

function material(color, options = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.78,
    metalness: 0,
    clearcoat: 0.08,
    clearcoatRoughness: 0.86,
    ...options,
  })
}

function mesh(geometry, meshMaterial, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0 } = {}) {
  const item = new THREE.Mesh(geometry, meshMaterial)
  item.position.set(x, y, z)
  item.rotation.set(rx, ry, rz)
  item.castShadow = true
  item.receiveShadow = true
  return item
}

function roundedBox(width, height, depth, radius, meshMaterial, transform = {}) {
  return mesh(new RoundedBoxGeometry(width, height, depth, 3, radius), meshMaterial, transform)
}

function capsule(radius, length, meshMaterial, transform = {}) {
  return mesh(new THREE.CapsuleGeometry(radius, length, 8, 16), meshMaterial, transform)
}

function carouselAnchor(planet, longitude) {
  const lon = THREE.MathUtils.degToRad(longitude)
  const anchor = new THREE.Group()
  anchor.position.set(
    Math.sin(lon) * FOCUSED_THEME_RADIUS,
    GROUND_HEIGHT,
    Math.cos(lon) * FOCUSED_THEME_RADIUS,
  )
  anchor.rotation.y = lon
  planet.add(anchor)
  return anchor
}

function createGroundedEarthGeometry() {
  // Preserve a true sphere. Surface color alone makes the opening turn visible.
  const geometry = new THREE.SphereGeometry(PLANET_RADIUS, 128, 96)
  const positions = geometry.attributes.position
  const colors = new Float32Array(positions.count * 3)
  const neutral = new THREE.Color(COLORS.planet)
  const tints = EARTH_THEME_TINTS.map((color) => new THREE.Color(color))
  const wash = new THREE.Color()
  const color = new THREE.Color()
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index)
    const z = positions.getZ(index)

    // These colors live in the earth's own coordinates, so they reveal its
    // entrance spin before any objects appear. Feather between the four zones
    // and leave the pole neutral instead of drawing hard pie-slice boundaries.
    const longitude = Math.atan2(x, z)
    const poleFade = THREE.MathUtils.smoothstep(Math.hypot(x, z), 0.1, 0.75)
    let totalWeight = 0
    wash.setRGB(0, 0, 0)
    tints.forEach((tint, theme) => {
      const weight = Math.max(0, Math.cos(longitude - theme * Math.PI / 2)) ** 8
      wash.r += tint.r * weight
      wash.g += tint.g * weight
      wash.b += tint.b * weight
      totalWeight += weight
    })
    wash.multiplyScalar(1 / Math.max(totalWeight, 0.0001))
    color.lerpColors(neutral, wash, 0.88 * poleFade * Math.min(totalWeight, 1))
    color.toArray(colors, index * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return geometry
}

function frameThemeComposition(anchor, camera) {
  // Fit the artwork once, independently of the carousel's animated scale.
  // Each selected theme shares a visual footprint. Its floor stays at local
  // y=0: screen-space alignment must never lift furniture off the earth.
  anchor.userData.animate?.(0, false)
  const composition = new THREE.Group()
  composition.name = 'theme-composition'
  composition.add(...anchor.children)
  composition.updateMatrixWorld(true)

  const samples = []
  const bounds = new THREE.Box3()
  composition.traverseVisible((object) => {
    // Steam and water should not resize or shift an otherwise stationary scene.
    if (!object.isMesh || !object.castShadow) return
    object.geometry.computeBoundingBox()
    const box = object.geometry.boundingBox
    for (const x of [box.min.x, box.max.x]) {
      for (const y of [box.min.y, box.max.y]) {
        for (const z of [box.min.z, box.max.z]) {
          const point = new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld)
          samples.push(point)
          bounds.expandByPoint(point)
        }
      }
    }
  })
  if (bounds.isEmpty()) {
    anchor.add(composition)
    return
  }

  const center = bounds.getCenter(new THREE.Vector3())
  const size = bounds.getSize(new THREE.Vector3())
  const initialScale = 1.5 / Math.max(size.x, size.y)
  composition.scale.setScalar(initialScale)
  composition.position.set(-center.x * initialScale, 0, -center.z * initialScale)

  // Measure every theme as if it were in the front slot. Perspective otherwise
  // makes the deep coffee setup appear larger than equally scaled wider scenes.
  const halfViewHeight = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
  const frontSlot = new THREE.Group()
  frontSlot.position.set(0, GROUND_HEIGHT - halfViewHeight * WORLD_VERTICAL_OFFSET, FOCUSED_THEME_RADIUS)
  frontSlot.scale.setScalar(FOCUSED_THEME_SCALE)
  frontSlot.add(composition)
  camera.updateMatrixWorld(true)
  const screenBounds = new THREE.Box2()
  const projected = new THREE.Vector3()
  const screenPoint = new THREE.Vector2()
  const measure = () => {
    frontSlot.updateMatrixWorld(true)
    screenBounds.makeEmpty()
    samples.forEach((point) => {
      projected.copy(point).applyMatrix4(composition.matrixWorld).project(camera)
      // Express both axes in viewport-height units, including on narrow screens.
      screenBounds.expandByPoint(screenPoint.set(projected.x * camera.aspect, projected.y))
    })
  }
  const unitsPerScreen = (camera.position.z - frontSlot.position.z)
    * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / FOCUSED_THEME_SCALE
  for (let iteration = 0; iteration < 5; iteration += 1) {
    measure()
    const extent = Math.max(screenBounds.max.x - screenBounds.min.x, screenBounds.max.y - screenBounds.min.y)
    const correction = THEME_FRAME.size * 2 / extent
    composition.scale.multiplyScalar(correction)
    composition.position.multiplyScalar(correction)
    measure()
    composition.position.x -= (screenBounds.min.x + screenBounds.max.x) / 2 * unitsPerScreen
  }
  anchor.add(composition)
}

export function createCoffeeScene(planet, materials) {
  const group = carouselAnchor(planet, 0)

  const table = new THREE.Group()
  table.name = 'coffee-table'
  table.position.set(0, -0.03, 0.2)
  table.add(mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.1, 48), materials.white, { y: 0.68 }))
  const pedestal = mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.59, 48), materials.tablePedestal, { y: 0.35 })
  pedestal.name = 'coffee-table-pedestal'
  table.add(pedestal)
  table.add(mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.05, 32), materials.pale, { y: 0.055 }))
  group.add(table)

  const mug = new THREE.Group()
  mug.name = 'coffee-mug'
  mug.scale.setScalar(0.44)
  mug.position.set(-0.265 * 0.44, 0, 0)
  mug.add(mesh(new THREE.CylinderGeometry(0.17, 0.145, 0.3, 36), materials.red))
  mug.add(mesh(new THREE.TorusGeometry(0.151, 0.017, 8, 32), materials.red, { y: 0.15, rx: Math.PI / 2 }))
  mug.add(mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.012, 32), materials.coffee, { y: 0.154 }))
  mug.add(mesh(new THREE.TorusGeometry(0.115, 0.028, 10, 24, Math.PI * 1.78), materials.red, {
    x: 0.17,
    ry: Math.PI / 2,
    rz: Math.PI / 2,
  }))

  ;[-0.045, 0.045].forEach((steamX, index) => {
    const steamCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(steamX, 0.18, 0),
      new THREE.Vector3(steamX + 0.025, 0.29, 0.012),
      new THREE.Vector3(steamX - 0.018, 0.4, -0.004),
      new THREE.Vector3(steamX + 0.02, 0.5 + index * 0.035, 0.008),
    ])
    const steam = mesh(new THREE.TubeGeometry(steamCurve, 18, 0.009, 8, false), materials.steam)
    steam.castShadow = false
    mug.add(steam)
  })
  const chair = new THREE.Group()
  chair.name = 'coffee-chair'
  chair.position.set(0, -0.016, -0.46)
  chair.rotation.y = 0
  chair.add(roundedBox(0.44, 0.09, 0.46, 0.055, materials.white, { y: 0.435 }))
  ;[-0.17, 0.17].forEach((legX) => {
    ;[-0.16, 0.21].forEach((legZ) => {
      chair.add(capsule(0.024, 0.36, materials.pale, { x: legX, y: 0.22, z: legZ }))
    })
    chair.add(capsule(0.024, 0.25, materials.pale, { x: legX, y: 0.59, z: -0.19 }))
  })
  chair.add(roundedBox(0.44, 0.3, 0.07, 0.055, materials.white, { y: 0.72, z: -0.2 }))
  chair.add(roundedBox(0.38, 0.026, 0.1, 0.012, materials.pale, { y: 0.13, z: 0.25 }))
  group.add(chair)

  const ahwon = createSeatedFigure(materials, { x: 0, y: 0.31, z: -0.46, scale: 1.06 })
  ahwon.name = 'coffee-designer'
  ahwon.rotation.y = chair.rotation.y
  group.add(ahwon)

  const { leftArm, rightArm, head } = ahwon.userData.parts
  leftArm.position.set(-0.145, 0.3, 0.1)
  leftArm.rotation.set(-1, 0, -0.12)

  // Keep the mug attached to the hand through the seated sipping motion.
  const shoulder = new THREE.Group()
  shoulder.position.set(0.145, 0.512, 0.015)
  shoulder.rotation.order = 'YXZ'
  rightArm.position.set(0, -0.12, 0)
  rightArm.rotation.set(0, 0, 0)
  shoulder.add(rightArm)
  const elbow = new THREE.Group()
  elbow.position.y = -0.24
  elbow.add(capsule(0.029, 0.18, materials.person, { y: -0.095 }))
  shoulder.add(elbow)
  const hand = new THREE.Group()
  hand.name = 'coffee-hand'
  hand.position.y = -0.215
  hand.add(mesh(new THREE.SphereGeometry(0.034, 16, 12), materials.skin))
  hand.add(mug)
  elbow.add(hand)
  ahwon.add(shoulder)

  group.userData.animate = (time, active, { reducedMotion = false } = {}) => {
    const phase = reducedMotion ? 0 : time % 10.4
    const lift = holdMotion(phase, 0.9, 2.45, 3.85, 5.7)
    const drink = holdMotion(phase, 2.3, 2.9, 3.45, 4.1)
    const look = holdMotion(phase, 0.35, 1.15, 4.6, 6.2)
    const breath = reducedMotion ? 0 : Math.sin(time * 1.45) * 0.002
    shoulder.rotation.y = 0
    shoulder.rotation.x = -1.17 + lift * 0.15
    elbow.rotation.x = -0.605 - lift * 1.615
    mug.rotation.x = -(shoulder.rotation.x + elbow.rotation.x) - drink * 0.14
    head.rotation.set(look * 0.035 + drink * 0.025, 0, 0)
    head.position.y = 0.7 + breath
    leftArm.rotation.x = -1 + breath * 2
    group.userData.coffeePhase = phase < 0.9 ? 'resting' : phase < 2.45 ? 'lifting' : phase < 3.85 ? 'sipping' : phase < 5.7 ? 'lowering' : 'resting'
  }
  group.userData.animate(0, false)

  return group
}

export function createWorkspaceScene(planet, materials) {
  const anchor = carouselAnchor(planet, 90)
  const group = new THREE.Group()
  group.name = 'workspace-layout'
  // Turn the complete setup together so the seated person and screen share a clear sightline.
  group.rotation.y = -0.62
  anchor.add(group)

  group.add(roundedBox(1.62, 0.1, 0.82, 0.045, materials.white, { y: 0.72 }))
  group.add(roundedBox(0.11, 0.685, 0.11, 0.025, materials.mid, { x: -0.61, y: 0.3425, z: -0.25 }))
  group.add(roundedBox(0.11, 0.685, 0.11, 0.025, materials.mid, { x: 0.61, y: 0.3425, z: -0.25 }))

  const monitor = new THREE.Group()
  monitor.name = 'workspace-monitor'
  monitor.position.set(0.12, 0.82, -0.15)
  monitor.add(roundedBox(0.7, 0.47, 0.07, 0.045, materials.pale, { y: 0.33 }))
  monitor.add(roundedBox(0.59, 0.36, 0.014, 0.025, materials.screen, { y: 0.33, z: 0.042 }))
  monitor.add(roundedBox(0.065, 0.27, 0.065, 0.02, materials.mid, { y: 0.08 }))
  monitor.add(roundedBox(0.34, 0.035, 0.16, 0.018, materials.mid, { y: -0.045, z: 0.015 }))
  group.add(monitor)

  const laptop = new THREE.Group()
  laptop.name = 'workspace-laptop'
  laptop.position.set(-0.48, 0.8, -0.02)
  laptop.rotation.y = 0.13
  laptop.add(roundedBox(0.57, 0.028, 0.38, 0.02, materials.pale))
  const laptopLid = new THREE.Group()
  laptopLid.position.set(0, 0.014, -0.17)
  laptopLid.rotation.x = -0.15
  laptopLid.add(roundedBox(0.57, 0.35, 0.03, 0.025, materials.white, {
    y: 0.175,
  }))
  laptopLid.add(roundedBox(0.49, 0.285, 0.012, 0.018, materials.screen, {
    y: 0.175,
    z: 0.022,
  }))
  laptop.add(laptopLid)
  group.add(laptop)

  const keyboard = new THREE.Group()
  keyboard.name = 'workspace-keyboard'
  keyboard.position.set(0.12, 0.795, 0.27)
  keyboard.add(roundedBox(0.58, 0.026, 0.22, 0.025, materials.pale))
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 7; column += 1) {
      keyboard.add(roundedBox(0.055, 0.012, 0.045, 0.008, materials.white, {
        x: -0.18 + column * 0.06,
        y: 0.022,
        z: -0.058 + row * 0.055,
      }))
    }
  }
  group.add(keyboard)

  const chair = new THREE.Group()
  chair.name = 'workspace-chair'
  chair.position.set(0.12, 0.11, 0.7)
  chair.rotation.y = Math.PI
  chair.add(roundedBox(0.48, 0.11, 0.44, 0.07, materials.pale, { y: 0.27 }))
  chair.add(roundedBox(0.48, 0.4, 0.09, 0.07, materials.pale, { y: 0.48, z: -0.2, rx: -0.08 }))
  chair.add(mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.35, 20), materials.mid, { y: 0.065 }))
  group.add(chair)

  const plant = new THREE.Group()
  plant.position.set(0.71, 0.86, 0.2)
  plant.add(mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.24, 24), materials.pale))
  plant.add(capsule(0.045, 0.17, materials.green, { x: -0.08, y: 0.25, rz: -0.55 }))
  plant.add(capsule(0.05, 0.2, materials.green, { x: 0.09, y: 0.3, rz: 0.52 }))
  plant.add(capsule(0.045, 0.19, materials.green, { y: 0.39, z: -0.03, rz: -0.08 }))
  group.add(plant)

  const ahwon = createSeatedFigure(materials, { x: 0.12, y: 0.28, z: 0.7, scale: 1.02 })
  ahwon.name = 'workspace-designer'
  ahwon.rotation.y = Math.PI
  const { leftArm, rightArm, head, legs } = ahwon.userData.parts
  const forearms = [-1, 1].map(() => capsule(0.028, 0.18, materials.person))
  ahwon.add(...forearms)
  const hands = [-0.145, 0.145].map((handX, index) => {
    const hand = mesh(new THREE.SphereGeometry(0.034, 16, 12), materials.skin, {
      x: handX,
      y: 0.565,
      z: 0.315,
    })
    hand.name = index === 0 ? 'workspace-left-hand' : 'workspace-right-hand'
    ahwon.add(hand)
    return hand
  })
  group.add(ahwon)

  const idea = new THREE.Group()
  idea.name = 'workspace-idea-cue'
  idea.position.set(0.23, 0.95, 0.04)
  idea.add(mesh(new THREE.SphereGeometry(0.057, 20, 16), materials.blue))
  idea.add(capsule(0.021, 0.035, materials.pale, { y: -0.065 }))
  ;[-0.8, 0, 0.8].forEach((angle) => {
    idea.add(capsule(0.007, 0.026, materials.blue, {
      x: Math.sin(angle) * 0.115,
      y: Math.cos(angle) * 0.115,
      rz: -angle,
    }))
  })
  idea.traverse((object) => { object.castShadow = false })
  idea.visible = false
  ahwon.add(idea)

  const axis = new THREE.Vector3(0, 1, 0)
  const direction = new THREE.Vector3()
  const poseLimb = (limb, start, end) => {
    limb.position.copy(start).lerp(end, 0.5)
    direction.copy(end).sub(start)
    const length = direction.length()
    limb.quaternion.setFromUnitVectors(axis, direction.normalize())
    const { height, radius } = limb.geometry.parameters
    limb.scale.y = length / (height + radius * 2)
  }
  const hip = new THREE.Vector3()
  const knee = new THREE.Vector3()
  const ankle = new THREE.Vector3()
  const shoulder = new THREE.Vector3()
  const elbow = new THREE.Vector3()
  const grip = new THREE.Vector3()
  const footWorld = new THREE.Vector3()
  const inverseFigure = new THREE.Matrix4()
  const kneeBend = new THREE.Vector3()
  const footAt = (side, yaw, z, bodyZ) => new THREE.Vector3(side * 0.06, 0, z)
    .multiplyScalar(ahwon.scale.x)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw)
    .add(new THREE.Vector3(0.12, 0.0475, bodyZ))
  const footsteps = [-1, 1].map((side, index) => ({
    start: footAt(side, 0.62, 0.07, 0.81),
    middle: footAt(side, index === 0 ? 1.8 : 2.7, 0.09, 0.76),
    end: footAt(side, Math.PI, 0.38, 0.7),
    first: index === 0 ? [2.75, 3.38] : [3.45, 4.13],
    second: index === 0 ? [4.22, 4.88] : [4.95, 5.5],
    middleYaw: index === 0 ? 1.8 : 2.7,
  }))

  anchor.userData.animate = (time, active, { settled = true, reducedMotion = false } = {}) => {
    const elapsed = reducedMotion ? 6 : time
    const turn = easeMotion(elapsed, 2.9, 4.85)
    const sit = easeMotion(elapsed, 4.15, 5.55)
    const reach = easeMotion(elapsed, 4.85, 5.9)
    const typingTime = Math.max(0, elapsed - 6)
    const typing = reducedMotion ? 0 : holdMotion(typingTime % 5.8, 0.15, 0.5, 1.9, 2.3)
      + holdMotion(typingTime % 5.8, 3.1, 3.5, 4.65, 5.1)
    const think = holdMotion(elapsed, 0.35, 1.2, 2.35, 3.05)
    const spark = holdMotion(elapsed, 1.55, 2, 2.45, 3.05)
    const reading = reducedMotion ? 0 : holdMotion(typingTime % 8.6, 2.4, 3.2, 4.4, 5.4)

    anchor.userData.workPhase = elapsed < 1.55 ? 'thinking' : elapsed < 2.9 ? 'idea' : elapsed < 5.55 ? 'sitting' : 'working'
    ahwon.position.set(0.12, THREE.MathUtils.lerp(0.482, 0.28, sit), THREE.MathUtils.lerp(0.81, 0.7, turn))
    ahwon.rotation.y = THREE.MathUtils.lerp(0.62, Math.PI, turn)
    head.rotation.set(-0.07 * think + 0.075 * holdMotion(elapsed, 3.8, 4.55, 5.4, 6.2) + 0.02 * reach, reading * 0.17, -0.055 * think)
    idea.visible = spark > 0.01
    idea.scale.setScalar(Math.max(0.001, spark))
    ahwon.updateMatrix()
    inverseFigure.copy(ahwon.matrix).invert()

    // Shift support one foot at a time. A planted foot stays in workspace
    // coordinates while the hips turn and lower; only the stepping foot lifts.
    legs.forEach(({ upper, lower, foot }, index) => {
      const legX = index === 0 ? -0.06 : 0.06
      const step = footsteps[index]
      const first = easeMotion(elapsed, ...step.first)
      const second = easeMotion(elapsed, ...step.second)
      footWorld.lerpVectors(step.start, step.middle, first).lerp(step.end, second)
      const lift = (progress) => Math.sin(Math.PI * progress) ** 2 * 0.045
      footWorld.y += lift(first) + lift(second)
      foot.position.copy(footWorld).applyMatrix4(inverseFigure)
      const footYaw = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0.62, step.middleYaw, first), Math.PI, second)
      foot.rotation.y = footYaw - ahwon.rotation.y
      hip.set(legX, 0.14, 0.02)
      ankle.copy(footWorld)
      ankle.y += 0.0275
      ankle.applyMatrix4(inverseFigure)
      direction.copy(ankle).sub(hip)
      const distance = direction.length()
      direction.normalize()
      const bend = Math.sqrt(Math.max(0, 0.3 ** 2 - (distance / 2) ** 2))
      kneeBend.set(0, 0, 1).addScaledVector(direction, -direction.z).normalize()
      knee.copy(hip).lerp(ankle, 0.5).addScaledVector(kneeBend, bend)
      poseLimb(upper, hip, knee)
      poseLimb(lower, knee, ankle)
    })

    ;[leftArm, rightArm].forEach((arm, index) => {
      const side = index === 0 ? -1 : 1
      shoulder.set(side * 0.145, 0.512, 0)
      elbow.set(side * 0.19, 0.37, 0.04)
      grip.set(side * 0.17, 0.23, 0.04)
      if (index === 1) {
        elbow.lerp(new THREE.Vector3(0.21, 0.42, 0.09), think)
        grip.lerp(new THREE.Vector3(0.065, 0.63, 0.15), think)
      }
      const tap = Math.sin(typingTime * (index === 0 ? 10.2 : 12.7) + index * 1.3) * typing * 0.004
      elbow.lerp(new THREE.Vector3(side * 0.18, 0.395, 0.17), reach)
      grip.lerp(new THREE.Vector3(side * 0.145, 0.565 + tap, 0.315), reach)
      poseLimb(arm, shoulder, elbow)
      poseLimb(forearms[index], elbow, grip)
      hands[index].position.copy(grip)
    })
  }
  anchor.userData.animate(0, false)

  return anchor
}

// Appearance reference: src/img/landing-work.png and src/img/landing-me.png.
// Keep this as actual geometry so the existing head and arm animations still work.
function createAhwonHead(materials, y) {
  const head = new THREE.Group()
  head.name = 'ahwon-head'
  head.position.set(0, y, 0.02)
  const face = mesh(new THREE.SphereGeometry(0.125, 32, 24), materials.skin)
  face.name = 'ahwon-face'
  face.scale.set(1, 1.06, 0.92)
  head.add(face)

  head.add(mesh(new THREE.SphereGeometry(0.134, 32, 20, 0, Math.PI * 2, 0, 1.1), materials.hair, { y: 0.007, z: -0.012 }))
  head.add(roundedBox(0.24, 0.36, 0.09, 0.04, materials.hair, { y: -0.13, z: -0.12 }))
  ;[-1, 1].forEach((side) => {
    const ear = mesh(new THREE.SphereGeometry(0.021, 16, 12), materials.skin, { x: side * 0.122, y: -0.005 })
    ear.scale.set(1, 1.25, 0.85)
    head.add(ear)
    const lock = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.106, 0.08, -0.005),
      new THREE.Vector3(side * 0.127, -0.03, -0.005),
      new THREE.Vector3(side * 0.134, -0.18, -0.04),
      new THREE.Vector3(side * 0.112, -0.28, -0.055),
    ])
    head.add(mesh(new THREE.TubeGeometry(lock, 20, 0.021, 10, false), materials.hair))
    const eye = mesh(new THREE.SphereGeometry(0.0105, 16, 12), materials.eyes, { x: side * 0.042, y: 0.035, z: 0.107 })
    eye.scale.set(0.8, 1.2, 0.5)
    head.add(eye)
    const brow = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.025, 0.061, 0.103),
      new THREE.Vector3(side * 0.042, 0.067, 0.101),
      new THREE.Vector3(side * 0.059, 0.061, 0.096),
    ])
    head.add(mesh(new THREE.TubeGeometry(brow, 12, 0.003, 6, false), materials.hair))
  })

  const leftFringe = new THREE.Shape()
  leftFringe.moveTo(0.017, 0.131)
  leftFringe.quadraticCurveTo(-0.077, 0.151, -0.129, 0.083)
  leftFringe.quadraticCurveTo(-0.135, 0.045, -0.121, 0.019)
  leftFringe.quadraticCurveTo(-0.035, 0.05, 0.017, 0.115)
  leftFringe.closePath()
  const rightFringe = new THREE.Shape()
  rightFringe.moveTo(0.017, 0.131)
  rightFringe.quadraticCurveTo(0.11, 0.13, 0.13, 0.081)
  rightFringe.quadraticCurveTo(0.136, 0.042, 0.119, 0.025)
  rightFringe.quadraticCurveTo(0.06, 0.056, 0.017, 0.112)
  rightFringe.closePath()
  ;[leftFringe, rightFringe].forEach((shape) => {
    head.add(mesh(new THREE.ExtrudeGeometry(shape, {
      depth: 0.018, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, steps: 1, curveSegments: 16,
    }), materials.hair, { z: 0.079 }))
  })
  head.add(mesh(new THREE.SphereGeometry(0.01, 16, 12), materials.skin, { y: -0.003, z: 0.116 }))
  const smile = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.025, -0.025, 0.111),
    new THREE.Vector3(0, -0.033, 0.114),
    new THREE.Vector3(0.025, -0.025, 0.111),
  ])
  head.add(mesh(new THREE.TubeGeometry(smile, 16, 0.0025, 6, false), materials.smile))
  return head
}

function addHoodieDetails(figure, materials, torsoY) {
  figure.add(roundedBox(0.27, 0.16, 0.19, 0.06, materials.hoodieTrim, { y: torsoY + 0.15, z: -0.035 }))
  figure.add(roundedBox(0.15, 0.085, 0.016, 0.022, materials.hoodieTrim, { y: torsoY - 0.075, z: 0.099 }))
  ;[-0.037, 0.037].forEach((cordX) => {
    figure.add(capsule(0.005, 0.1, materials.hoodieCord, { x: cordX, y: torsoY + 0.09, z: 0.108 }))
  })
}

function createSeatedFigure(materials, { x = 0, y = 0.37, z = 0.02, scale = 1, husband = false } = {}) {
  const figure = new THREE.Group()
  figure.position.set(x, y, z)
  figure.scale.setScalar(scale)

  const bodyMaterial = husband ? materials.pale : materials.person
  const torso = roundedBox(0.24, 0.4, 0.19, 0.07, bodyMaterial, { y: 0.36 })
  const neck = capsule(0.037, 0.045, husband ? materials.figure : materials.skin, { y: 0.585 })
  const head = husband
    ? new THREE.Group()
    : createAhwonHead(materials, 0.7)
  if (husband) {
    head.name = 'husband-head'
    head.position.set(0, 0.7, 0.02)
    head.add(mesh(new THREE.SphereGeometry(0.125, 28, 20), materials.figure))
  }
  const leftArm = capsule(0.033, 0.22, bodyMaterial, { x: -0.145, y: 0.38, rz: -0.18 })
  const rightArm = capsule(0.033, 0.22, bodyMaterial, { x: 0.145, y: 0.38, rz: 0.18 })
  figure.add(torso, neck, head, leftArm, rightArm)

  if (!husband) {
    addHoodieDetails(figure, materials, 0.36)
  }

  const legs = [-0.06, 0.06].map((legX) => {
    const upper = capsule(0.036, 0.19, husband ? materials.mid : materials.trousers, {
      x: legX,
      y: 0.14,
      z: 0.12,
      rx: Math.PI / 2,
    })
    const lower = capsule(0.034, 0.18, husband ? materials.mid : materials.trousers, {
      x: legX,
      y: 0.02,
      z: 0.24,
    })
    const foot = roundedBox(0.08, 0.055, 0.13, 0.025, husband ? materials.sole : materials.sneakers, {
      x: legX,
      y: -0.13,
      z: 0.28,
    })
    figure.add(upper, lower, foot)
    return { upper, lower, foot }
  })

  if (husband) {
    // Hair, glasses, and eyes turn with the head, not independently of it.
    head.add(mesh(new THREE.SphereGeometry(0.132, 28, 18, 0, Math.PI * 2, 0, 1.25), materials.ink, { y: 0.006, z: -0.006 }))

    ;[-0.045, 0.045].forEach((glassX) => {
      head.add(mesh(new THREE.TorusGeometry(0.034, 0.008, 8, 18), materials.ink, {
        x: glassX,
        y: 0.018,
        z: 0.121,
      }))
      head.add(mesh(new THREE.SphereGeometry(0.009, 12, 10), materials.eyes, { x: glassX, y: 0.018, z: 0.116 }))
    })
    head.add(mesh(new THREE.BoxGeometry(0.03, 0.009, 0.009), materials.ink, { y: 0.018, z: 0.124 }))
  }

  figure.userData.parts = { torso, head, leftArm, rightArm, legs }

  return figure
}

function createStandingFigure(materials, { x = 0, y = 0, z = 0, scale = 1 } = {}) {
  const figure = new THREE.Group()
  figure.position.set(x, y, z)
  figure.scale.setScalar(scale)

  const torso = roundedBox(0.24, 0.44, 0.19, 0.07, materials.person, { y: 0.56 })
  const neck = capsule(0.037, 0.05, materials.skin, { y: 0.81 })
  const head = createAhwonHead(materials, 0.92)
  const leftArm = capsule(0.033, 0.3, materials.person, { x: -0.15, y: 0.54, rz: -0.1 })
  const rightArm = capsule(0.033, 0.3, materials.person, { x: 0.15, y: 0.54, rz: 0.1 })
  figure.add(torso, neck, head, leftArm, rightArm)
  addHoodieDetails(figure, materials, 0.56)

  ;[-0.065, 0.065].forEach((legX) => {
    figure.add(capsule(0.037, 0.34, materials.trousers, { x: legX, y: 0.21 }))
    figure.add(roundedBox(0.085, 0.055, 0.14, 0.025, materials.sneakers, { x: legX, y: -0.02, z: 0.035 }))
  })

  figure.userData.parts = { torso, head, leftArm, rightArm }
  return figure
}

function createDog(materials, { x = 0, y = 0.025, z = 0, scale = 1, mirrored = false } = {}) {
  const dog = new THREE.Group()
  dog.name = mirrored ? 'park-dog-2' : 'park-dog-1'
  dog.position.set(x, y, z)
  dog.scale.setScalar(scale)

  // Local +Z is the face direction, so the final seated pose faces the viewer.
  const body = capsule(0.105, 0.2, materials.dog)
  const chest = mesh(new THREE.SphereGeometry(0.1, 22, 16), materials.dog)
  const head = new THREE.Group()
  head.name = 'dog-head'
  head.add(mesh(new THREE.SphereGeometry(0.105, 24, 18), materials.dog))
  const muzzle = mesh(new THREE.SphereGeometry(0.057, 20, 14), materials.dog, { y: -0.025, z: 0.084 })
  muzzle.scale.set(0.95, 0.7, 1.1)
  head.add(muzzle)
  const nose = mesh(new THREE.SphereGeometry(0.018, 16, 12), materials.ink, { y: -0.008, z: 0.14 })
  nose.scale.set(1, 0.7, 0.65)
  head.add(nose)
  ;[-1, 1].forEach((side) => {
    head.add(mesh(new THREE.SphereGeometry(0.009, 14, 10), materials.eyes, { x: side * 0.041, y: 0.025, z: 0.094 }))
    head.add(mesh(new THREE.ConeGeometry(0.039, 0.105, 12), materials.dog, { x: side * 0.069, y: 0.102, z: -0.009, rz: -side * 0.16 }))
  })
  dog.add(body, chest, head)

  const legs = [-1, 1].flatMap((side) => [true, false].map((front) => {
    const upper = capsule(0.026, 0.08, materials.dog)
    const lower = capsule(0.023, 0.08, materials.dog)
    const paw = roundedBox(0.067, 0.043, 0.085, 0.02, materials.dog)
    dog.add(upper, lower, paw)
    return { side, front, upper, lower, paw }
  }))

  // Pivot at the rump so the tail stays attached throughout its wag.
  const tail = new THREE.Group()
  tail.name = 'dog-tail-pivot'
  tail.add(capsule(0.018, 0.14, materials.dog, { y: 0.084 }))
  dog.add(tail)
  const up = new THREE.Vector3(0, 1, 0)
  const direction = new THREE.Vector3()
  const hip = new THREE.Vector3()
  const knee = new THREE.Vector3()
  const ankle = new THREE.Vector3()
  const poseLimb = (limb, start, end) => {
    direction.subVectors(end, start)
    const length = direction.length()
    limb.position.copy(start).lerp(end, 0.5)
    limb.quaternion.setFromUnitVectors(up, direction.normalize())
    limb.scale.y = length / (limb.geometry.parameters.height + limb.geometry.parameters.radius * 2)
  }
  dog.userData.pose = ({ time = 0, gaitPhase = time * 10, stepLength = 0.17, sit = 0, stride = 0, pivot = 0, sniff = 0, glance = 0, tilt = 0, wagAmount = 1, active = false } = {}) => {
    body.position.set(0, 0.235 - sit * 0.01, -sit * 0.055)
    body.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, 0.68, sit)
    body.rotation.z = Math.sin(gaitPhase) * stride * 0.012
    chest.position.set(0, THREE.MathUtils.lerp(0.245, 0.31, sit), THREE.MathUtils.lerp(0.15, 0.025, sit))
    head.position.set(0, THREE.MathUtils.lerp(0.38, 0.455, sit), THREE.MathUtils.lerp(0.2, 0.075, sit))
    head.position.y -= sniff * 0.075
    head.position.z += sniff * 0.035
    head.rotation.set(stride * Math.sin(gaitPhase - 0.4) * 0.02 + sniff * 0.5, glance, tilt)
    legs.forEach(({ side, front, upper, lower, paw }, index) => {
      const phase = ((gaitPhase / (Math.PI * 2) + [0, 0.5, 0.75, 0.25][index]) % 1 + 1) % 1
      const swing = THREE.MathUtils.clamp((phase - 0.64) / 0.36, 0, 1)
      // Longer contact than swing: the paw travels back underneath the body
      // while planted, then lifts to recover instead of paddling in a sine wave.
      const strideZ = phase < 0.64 ? 0.32 - phase : THREE.MathUtils.lerp(-0.32, 0.32, easeMotion(swing, 0, 1))
      hip.set(side * 0.067, THREE.MathUtils.lerp(0.22, front ? 0.28 : 0.16, sit), THREE.MathUtils.lerp(front ? 0.13 : -0.12, front ? 0.065 : -0.14, sit))
      ankle.set(
        side * THREE.MathUtils.lerp(0.067, front ? 0.067 : 0.115, sit),
        0.028 + Math.sin(swing * Math.PI) ** 2 * 0.028 * stride
          + Math.max(0, Math.sin(time * 7.5 + index * Math.PI / 2)) ** 2 * 0.018 * pivot,
        THREE.MathUtils.lerp(front ? 0.15 : -0.15, front ? 0.16 : -0.2, sit) + strideZ * stepLength * stride,
      )
      knee.copy(hip).lerp(ankle, 0.5)
      knee.z += front ? -0.012 : -0.035 - sit * 0.055
      poseLimb(upper, hip, knee)
      poseLimb(lower, knee, ankle)
      paw.position.copy(ankle)
      paw.position.z += 0.018
    })
    tail.position.set(sit * 0.06, THREE.MathUtils.lerp(0.255, 0.13, sit), THREE.MathUtils.lerp(-0.2, -0.125, sit))
    const phase = time * (mirrored ? 7.4 : 8.6) + (mirrored ? 1.2 : 0)
    tail.rotation.set(-0.65, 0, active ? Math.sin(phase) * 0.43 * wagAmount : 0)
    dog.userData.sit = sit
  }
  dog.userData.parts = { body, chest, head, tail, legs }
  dog.userData.pose()
  return dog
}

export function createWalkingScene(planet, materials) {
  const group = carouselAnchor(planet, 180)

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.82, 0.06, 0.2),
    new THREE.Vector3(-0.35, 0.08, -0.14),
    new THREE.Vector3(0.15, 0.07, 0.13),
    new THREE.Vector3(0.82, 0.06, -0.18),
  ])
  group.add(mesh(new THREE.TubeGeometry(curve, 32, 0.095, 10, false), materials.white))

  const tree = new THREE.Group()
  tree.position.set(-0.62, 0, -0.34)
  tree.add(mesh(new THREE.CylinderGeometry(0.075, 0.12, 0.82, 20), materials.wood, { y: 0.41 }))
  tree.add(capsule(0.035, 0.38, materials.wood, { x: -0.12, y: 0.72, rz: -0.62 }))
  tree.add(capsule(0.032, 0.34, materials.wood, { x: 0.14, y: 0.78, rz: 0.7 }))
  tree.add(mesh(new THREE.IcosahedronGeometry(0.28, 2), materials.blossom, { x: -0.22, y: 0.94 }))
  tree.add(mesh(new THREE.IcosahedronGeometry(0.34, 2), materials.blossomLight, { x: 0.08, y: 1.04, z: -0.02 }))
  tree.add(mesh(new THREE.IcosahedronGeometry(0.27, 2), materials.blossom, { x: 0.34, y: 0.93 }))
  tree.add(mesh(new THREE.IcosahedronGeometry(0.23, 2), materials.blossomLight, { x: 0.02, y: 1.25 }))
  group.add(tree)

  const bench = new THREE.Group()
  bench.position.set(0.22, 0.005, -0.05)
  bench.add(roundedBox(1.15, 0.09, 0.34, 0.035, materials.white, { y: 0.31 }))
  ;[0.43, 0.57, 0.71].forEach((slatY) => {
    bench.add(roundedBox(1.15, 0.09, 0.065, 0.025, materials.pale, { y: slatY, z: -0.19 }))
  })
  bench.add(roundedBox(0.075, 0.31, 0.075, 0.02, materials.mid, { x: -0.4, y: 0.15 }))
  bench.add(roundedBox(0.075, 0.31, 0.075, 0.02, materials.mid, { x: 0.4, y: 0.15 }))
  group.add(bench)

  const ahwon = createSeatedFigure(materials, { x: 0.01, scale: 1.12 })
  const husband = createSeatedFigure(materials, { x: 0.39, husband: true })
  ahwon.name = 'park-ahwon'
  husband.name = 'park-husband'
  group.add(ahwon, husband)

  const dogs = [
    createDog(materials, { x: -0.65, z: 0.7, scale: 1.2 }),
    createDog(materials, { x: 0.64, z: 0.92, scale: 1.08, mirrored: true }),
  ]
  group.add(...dogs)

  // Short forward walks, followed by a seated hold. Avoid U-turns and return
  // paths: at this scale they read as spinning rather than exploring.
  // Each new carousel visit resets the action only while the park is hidden.
  const makePath = (points) => new THREE.CubicBezierCurve3(...points.map(([x, z]) => new THREE.Vector3(x, 0.025, z)))
  const tracks = [
    {
      out: makePath([[-0.65, 0.7], [-0.61, 0.82], [-0.48, 0.99], [-0.43, 1.15]]),
      walk: [0.65, 3.25], turn: [3.25, 4.2], sit: [4.45, 5.4],
      idleYaw: 0.15, frontYaw: 0.08, stepLength: 0.19,
    },
    {
      out: makePath([[0.64, 0.92], [0.66, 1.03], [0.61, 1.16], [0.55, 1.26]]),
      walk: [4, 6.75], turn: [6.75, 7.8], sit: [8.05, 9],
      idleYaw: 0.15, frontYaw: -0.12, stepLength: 0.16,
    },
  ]
  const ease = (time, interval) => easeMotion(time, ...interval)
  const pulse = (time, enter, leave) => ease(time, enter) * (1 - ease(time, leave))
  const direction = new THREE.Vector3()
  const pathYaw = (path, progress) => {
    path.getTangentAt(progress, direction)
    return Math.atan2(direction.x, direction.z)
  }
  const blendYaw = (from, to, amount) => from + Math.atan2(Math.sin(to - from), Math.cos(to - from)) * amount
  const yawAxis = new THREE.Vector3(0, 1, 0)
  const gazeTarget = new THREE.Vector3()
  const otherDogTarget = new THREE.Vector3()
  const headPosition = new THREE.Vector3()

  group.userData.animate = (time, active, { settled = true, reducedMotion = false } = {}) => {
    // Longer visits keep the dogs seated with small, independent head/tail
    // gestures; their bodies never rotate or teleport into another walk loop.
    const elapsed = reducedMotion ? 10 : time
    const moving = !reducedMotion
    group.userData.parkPhase = elapsed < 4 ? 'first-dog-exploring' : elapsed < 8 ? 'second-dog-exploring' : elapsed < 9.7 ? 'settling' : 'front-pose'

    dogs.forEach((dog, index) => {
      const track = tracks[index]
      let yaw, stride = 0, gaitPhase = 0
      const walkPath = (path, interval) => {
        const progress = THREE.MathUtils.clamp((elapsed - interval[0]) / (interval[1] - interval[0]), 0, 1)
        const distance = easeMotion(progress, 0, 1)
        path.getPointAt(distance, dog.position)
        yaw = pathYaw(path, distance)
        stride = holdMotion(progress, 0, 0.14, 0.86, 1)
        // Paws follow distance travelled, rather than a shared wall-clock beat.
        gaitPhase = distance * path.getLength() / track.stepLength * Math.PI * 2
      }
      if (elapsed < track.walk[0]) {
        track.out.getPointAt(0, dog.position)
        yaw = blendYaw(track.idleYaw, pathYaw(track.out, 0), ease(elapsed, [Math.max(0, track.walk[0] - 1.1), track.walk[0]]))
      } else if (elapsed < track.walk[1]) {
        walkPath(track.out, track.walk)
      } else {
        track.out.getPointAt(1, dog.position)
        yaw = blendYaw(pathYaw(track.out, 1), track.frontYaw, ease(elapsed, track.turn))
      }
      const sit = ease(elapsed, track.sit)
      const pivotWindow = ([start, end]) => Math.sin(Math.PI * easeMotion(elapsed, start, end)) ** 2
      const pivot = stride === 0 && sit < 0.01 ? 0.35 * Math.max(
        pivotWindow([Math.max(0, track.walk[0] - 1.1), track.walk[0]]),
        pivotWindow(track.turn),
      ) : 0
      const sniff = index === 0
        ? 0.8 * pulse(elapsed, [3.25, 3.6], [3.9, 4.35])
        : 0.55 * pulse(elapsed, [0.55, 1.4], [2.4, 3.5]) + 0.75 * pulse(elapsed, [6.75, 7.1], [7.45, 7.95])
      const idle = moving ? easeMotion(elapsed, 11, 12) : 0
      const idlePhase = (elapsed + index * 3.1) % (index === 0 ? 9.2 : 11.6)
      const glance = (index === 0
        ? 0.16 * pulse(elapsed, [5.1, 5.8], [6.75, 7.8])
        : -0.19 * pulse(elapsed, [0.3, 1], [2.7, 3.5]))
        + idle * (index === 0 ? 0.14 : -0.12) * holdMotion(idlePhase, 1, 2.2, 3.4, 4.8)
      const tilt = index === 1
        ? 0.12 * pulse(elapsed, [1.25, 1.7], [2.1, 2.6]) + idle * 0.08 * holdMotion(idlePhase, 5.2, 6.1, 6.8, 8)
        : 0
      dog.quaternion.setFromAxisAngle(yawAxis, yaw)
      // The resting paw sole is y=0.0065 in dog space. Keep it on the floor;
      // animated paw lifts remain above that shared ground plane.
      dog.position.y = -0.0065 * dog.scale.y
      dog.userData.walking = moving && stride > 0.001
      dog.userData.pose({
        time: time + index * 0.17, gaitPhase, stepLength: track.stepLength / dog.scale.x, sit, stride, pivot, sniff, glance, tilt,
        wagAmount: index === 0 ? 0.45 + Math.sin(time * 0.7) * 0.25 : 0.35 + Math.sin(time * 0.9 + 1) * 0.25,
        active: moving,
      })
    })

    ;[ahwon, husband].forEach((person, index) => {
      const head = person.userData.parts.head
      // Both positions share the scene's local coordinates, even after framing.
      gazeTarget.copy(dogs[0].userData.parts.head.position).multiplyScalar(dogs[0].scale.x).applyQuaternion(dogs[0].quaternion).add(dogs[0].position)
      otherDogTarget.copy(dogs[1].userData.parts.head.position).multiplyScalar(dogs[1].scale.x).applyQuaternion(dogs[1].quaternion).add(dogs[1].position)
      const focusSecond = ease(elapsed, [3.5 + index * 0.25, 4.4 + index * 0.25])
      gazeTarget.lerp(otherDogTarget, focusSecond)
      const watch = pulse(elapsed, [0.3 + index * 0.2, 1.25 + index * 0.2], [8.65 + index * 0.25, 9.7 + index * 0.25])
      headPosition.copy(head.position).multiplyScalar(person.scale.x).add(person.position)
      gazeTarget.sub(headPosition)
      const yaw = THREE.MathUtils.clamp(Math.atan2(gazeTarget.x, gazeTarget.z), -0.52, 0.52)
      const pitch = THREE.MathUtils.clamp(Math.atan2(-gazeTarget.y, Math.hypot(gazeTarget.x, gazeTarget.z)), -0.15, 0.4)
      head.rotation.set(pitch * watch, yaw * watch, 0, 'YXZ')
    })
    ahwon.userData.parts.rightArm.rotation.x = -0.24
  }
  group.userData.animate(0, false)

  return group
}

export function createGardenScene(planet, materials) {
  const group = carouselAnchor(planet, 270)

  const createPot = ({ name, x, z, radius, height }) => {
    const pot = new THREE.Group()
    pot.name = name
    pot.position.set(x, 0, z)
    pot.add(mesh(new THREE.CylinderGeometry(radius, radius * 0.74, height, 32, 1, true), materials.white, {
      y: height / 2,
    }))
    pot.add(mesh(new THREE.TorusGeometry(radius - 0.009, 0.014, 10, 40), materials.pale, {
      y: height,
      rx: Math.PI / 2,
    }))
    pot.add(mesh(new THREE.CylinderGeometry(radius - 0.022, radius - 0.022, 0.02, 32), materials.gardenSoil, {
      y: height - 0.03,
    }))
    group.add(pot)
    return pot
  }

  const vines = []
  const tomatoPots = [
    { name: 'garden-tomato-pot-1', x: -0.23, z: -0.16, radius: 0.19, height: 0.3 },
    { name: 'garden-tomato-pot-2', x: 0.25, z: -0.2, radius: 0.2, height: 0.35 },
  ]
  tomatoPots.forEach((config, index) => {
    const pot = createPot(config)
    const vine = new THREE.Group()
    vine.position.set(0, config.height - 0.032, 0)
    vine.add(capsule(0.018, 0.62 + index * 0.05, materials.green, { y: 0.34 }))
    ;[0.18, 0.4, 0.61].forEach((leafY, leafIndex) => {
      const leaf = mesh(new THREE.SphereGeometry(0.075, 18, 12), materials.green, {
        x: leafIndex % 2 === 0 ? -0.07 : 0.07,
        y: leafY,
        z: 0.015,
      })
      leaf.scale.set(1.25, 0.52, 0.78)
      vine.add(leaf)
    })
    const tomato = mesh(new THREE.SphereGeometry(0.055, 20, 14), materials.tomato, {
      x: 0.055,
      y: 0.35 + index * 0.12,
      z: 0.055,
    })
    vine.add(tomato)
    pot.add(vine)
    vines.push(vine)
  })

  const zucchiniPot = createPot({
    name: 'garden-zucchini-pot', x: 0.26, z: 0.34, radius: 0.29, height: 0.23,
  })
  const zucchiniPatch = new THREE.Group()
  zucchiniPatch.position.set(0, 0.21, 0)
  zucchiniPatch.scale.setScalar(0.88)
  ;[-0.16, 0.02, 0.18].forEach((leafX, index) => {
    const leaf = mesh(new THREE.SphereGeometry(0.1, 18, 12), materials.gardenGreen, {
      x: leafX,
      y: 0.09 + (index % 2) * 0.05,
      z: index === 1 ? -0.07 : 0.04,
    })
    leaf.scale.set(1.35, 0.42, 0.78)
    zucchiniPatch.add(leaf)
  })
  ;[-0.08, 0.14].forEach((vegetableX, index) => {
    zucchiniPatch.add(capsule(0.045, 0.2, materials.zucchini, {
      x: vegetableX,
      y: 0.055,
      z: 0.12 + index * 0.04,
      rz: Math.PI / 2 + index * 0.18,
    }))
  })
  zucchiniPot.add(zucchiniPatch)

  const ahwon = createStandingFigure(materials, { x: -0.66, y: 0.05, z: 0.31, scale: 1 })
  ahwon.name = 'garden-designer'
  ahwon.rotation.y = 0.38
  group.add(ahwon)

  const wateringCan = new THREE.Group()
  wateringCan.name = 'garden-watering-can'
  wateringCan.position.set(-0.4, 0.76, 0.05)
  const wateringTarget = new THREE.Vector3(tomatoPots[0].x + 0.035, tomatoPots[0].height - 0.019, tomatoPots[0].z + 0.045)
  wateringCan.rotation.y = Math.atan2(wateringCan.position.z - wateringTarget.z, wateringTarget.x - wateringCan.position.x)
  wateringCan.add(mesh(new THREE.CylinderGeometry(0.105, 0.115, 0.2, 32), materials.pale, { y: -0.185 }))
  wateringCan.add(mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.008, 24), materials.mid, { y: -0.081 }))
  wateringCan.add(mesh(new THREE.TorusGeometry(0.085, 0.014, 10, 28, Math.PI), materials.pale, { y: -0.085 }))
  const spoutCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.075, -0.18, 0),
    new THREE.Vector3(0.16, -0.16, 0),
    new THREE.Vector3(0.23, -0.075, 0),
    new THREE.Vector3(0.3, -0.06, 0),
  ])
  wateringCan.add(mesh(new THREE.TubeGeometry(spoutCurve, 20, 0.021, 10, false), materials.white))
  const spoutHead = mesh(new THREE.CylinderGeometry(0.04, 0.028, 0.055, 20), materials.pale, { x: 0.3, y: -0.06 })
  spoutHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0.21, 0).normalize())
  wateringCan.add(spoutHead)
  const spoutOutlet = new THREE.Object3D()
  spoutOutlet.name = 'garden-spout-outlet'
  spoutOutlet.position.set(0.328, -0.054, 0)
  wateringCan.add(spoutOutlet)
  const hand = mesh(new THREE.SphereGeometry(0.034, 16, 12), materials.skin)
  hand.name = 'garden-watering-hand'
  wateringCan.add(hand)
  group.add(wateringCan)

  // Keep the wrist attached as the forearm gently raises and tips the can.
  ahwon.updateMatrix()
  const grip = wateringCan.position.clone().applyMatrix4(ahwon.matrix.clone().invert())
  const shoulder = new THREE.Vector3(0.15, 0.74, 0)
  const elbow = shoulder.clone().lerp(grip, 0.5)
  elbow.y -= 0.12
  const poseArm = (arm, start, end) => {
    arm.position.copy(start).lerp(end, 0.5)
    arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize())
    const { height, radius } = arm.geometry.parameters
    arm.scale.y = start.distanceTo(end) / (height + radius * 2)
  }
  const rightArm = ahwon.userData.parts.rightArm
  rightArm.geometry.dispose()
  rightArm.geometry = new THREE.CapsuleGeometry(0.033, Math.max(0.01, shoulder.distanceTo(elbow) - 0.066), 8, 16)
  poseArm(rightArm, shoulder, elbow)
  const forearm = capsule(0.028, Math.max(0.01, elbow.distanceTo(grip) - 0.056), materials.person)
  poseArm(forearm, elbow, grip)
  ahwon.add(forearm)

  const water = new THREE.Group()
  water.name = 'garden-water'
  water.visible = false
  const dropGeometry = new THREE.SphereGeometry(0.009, 10, 8)
  for (let index = 0; index < 9; index += 1) {
    const drop = mesh(dropGeometry, materials.water)
    drop.scale.y = 1.65
    drop.castShadow = false
    drop.receiveShadow = false
    water.add(drop)
  }
  group.add(water)
  const streamStart = new THREE.Vector3()
  const canRest = wateringCan.position.clone()
  const canYaw = wateringCan.rotation.y
  const canPosition = new THREE.Vector3()
  const canRotation = new THREE.Quaternion()
  const canMatrix = new THREE.Matrix4()
  const unitScale = new THREE.Vector3(1, 1, 1)
  const canEuler = new THREE.Euler(0, canYaw, 0, 'YXZ')
  const figureInverse = ahwon.matrix.clone().invert()
  const canPose = (elapsed) => {
    const phase = elapsed % 11.8
    const lift = holdMotion(phase, 0.65, 1.65, 6, 7.6)
    const pour = holdMotion(phase, 1.5, 2.9, 5.25, 6.85)
    canPosition.copy(canRest).add(new THREE.Vector3(lift * 0.014, lift * 0.025, -lift * 0.006))
    canEuler.z = -0.58 * pour
    canRotation.setFromEuler(canEuler)
    return pour
  }

  group.userData.animate = (time, active, { reducedMotion = false } = {}) => {
    const elapsed = reducedMotion ? 0 : time
    canPose(elapsed)
    wateringCan.position.copy(canPosition)
    wateringCan.quaternion.copy(canRotation)
    grip.copy(canPosition).applyMatrix4(figureInverse)
    elbow.copy(shoulder).lerp(grip, 0.5)
    elbow.y -= 0.12
    poseArm(rightArm, shoulder, elbow)
    poseArm(forearm, elbow, grip)

    // Emit at the spout's position at release, then let gravity carry each drop
    // to the soil. Existing drops finish falling when the can returns upright.
    const flight = 0.46
    water.children.forEach((drop, index) => {
      const offset = index / water.children.length * flight
      const birth = Math.floor((elapsed - offset) / flight) * flight + offset
      const pourAtBirth = canPose(Math.max(0, birth))
      drop.visible = !reducedMotion && birth >= 0 && pourAtBirth > 0.55
      if (!drop.visible) return
      canMatrix.compose(canPosition, canRotation, unitScale)
      streamStart.copy(spoutOutlet.position).applyMatrix4(canMatrix)
      const progress = (elapsed - birth) / flight
      drop.position.lerpVectors(streamStart, wateringTarget, progress)
      drop.position.y += 0.5 * 2.8 * flight ** 2 * progress * (1 - progress)
      drop.scale.setScalar(0.7 + pourAtBirth * 0.3)
      drop.scale.y *= 1.65
    })
    water.visible = water.children.some((drop) => drop.visible)
    const look = holdMotion(elapsed % 11.8, 0.2, 1.1, 6.3, 8)
    ahwon.userData.parts.head.rotation.set(look * 0.1, 0.18 + look * 0.07, -look * 0.025)
    vines.forEach((vine, index) => {
      vine.rotation.z = reducedMotion ? 0 : Math.sin(elapsed * 0.65 + index * 0.8) * 0.007
        + Math.sin(elapsed * 1.13 + index) * 0.003
    })
  }
  group.userData.animate(0, false)

  return group
}

export function getSceneBubbleLayout({ x, y, headRadius, width, height, diameter, copyBottom, preferredSide }) {
  const radius = diameter / 2
  const margin = 14
  const tailLength = 18
  const headGap = 16
  const tailInset = 5
  const clearance = headRadius + headGap + tailLength - tailInset
  const neededSpace = diameter + clearance
  const room = preferredSide > 0 ? width - x - margin : x - margin
  const oppositeRoom = preferredSide > 0 ? x - margin : width - x - margin
  const side = room < neededSpace && oppositeRoom > room ? -preferredSide : preferredSide
  const centerX = THREE.MathUtils.clamp(x + side * (radius + clearance), radius + margin, width - radius - margin)
  const minY = copyBottom + radius + 16
  const maxY = Math.max(minY, height - radius - 82)
  let centerY = THREE.MathUtils.clamp(y - diameter * 0.65, minY, maxY)
  // When the screen edge limits horizontal space, keep the same head clearance
  // by placing the bubble diagonally above or below, outside the headline.
  const minDistance = radius + clearance
  const minOffsetY = Math.sqrt(Math.max(0, minDistance ** 2 - (centerX - x) ** 2))
  if (Math.abs(centerY - y) < minOffsetY) {
    centerY = y - minOffsetY >= minY ? y - minOffsetY : y + minOffsetY
  }
  // Aim at the near side of the head, not at the face. The short tip never
  // stretches to reach the speaker and the pop animation pivots at the tip.
  const dx = x + side * headRadius - centerX
  const dy = y - centerY
  const distance = Math.max(Math.hypot(dx, dy), 1)
  return {
    x: centerX,
    y: centerY,
    originX: radius + dx / distance * (radius - tailInset + tailLength),
    originY: radius + dy / distance * (radius - tailInset + tailLength),
    tailX: radius + dx / distance * (radius - tailInset),
    tailY: radius + dy / distance * (radius - tailInset),
    tailAngle: Math.atan2(dy, dx),
    tailLength,
  }
}

// Share the existing artwork with the theater preview; keep the earth version available.
export function createThemeMaterials() {
  return {
    planet: material(0xffffff, { vertexColors: true }),
    white: material(COLORS.white),
    pale: material(COLORS.pale),
    mid: material(COLORS.mid),
    tablePedestal: material(0xb2b5ba, { roughness: 0.92, clearcoat: 0 }),
    dark: material(COLORS.dark),
    ink: material(COLORS.ink),
    red: material(COLORS.red),
    green: material(COLORS.green),
    blue: material(COLORS.blue),
    blossom: material(COLORS.blossom),
    blossomLight: material(0xe8c4cc),
    figure: material(0xd2d4d8),
    person: material(0x365b43),
    skin: material(0xeeb995),
    hair: material(0x24211f),
    eyes: material(0x29221d, { roughness: 0.42 }),
    smile: material(0x754832),
    hoodieTrim: material(0x2f503c),
    hoodieCord: material(0x58755c),
    trousers: material(0x967652),
    sneakers: material(0xf1eee5),
    dog: material(0xf0f0ed),
    sole: material(0x7b818b),
    wood: material(0xaaa4a1),
    gardenSoil: material(0xb6b4af),
    gardenGreen: material(0x739268),
    tomato: material(0xc94a43),
    zucchini: material(0x688d52),
    water: material(0x92a3b4, { transparent: true, opacity: 0.65, roughness: 0.3, depthWrite: false }),
    screen: material(0x343b4a, { roughness: 0.55 }),
    steam: material(0xffffff, { transparent: true, opacity: 0.52, depthWrite: false }),
    coffee: material(0x3b2825),
  }
}

export default function PlanetScene3D({ carouselStep = 0, activeIndex = 1, bubbleRef, copyRef, onIntroComplete }) {
  const mountRef = useRef(null)
  const stateRef = useRef({ carouselStep, activeIndex })

  useEffect(() => {
    stateRef.current = { carouselStep, activeIndex }
  }, [carouselStep, activeIndex])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100)
    camera.position.set(0, 0.15, 17.2)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const materials = createThemeMaterials()

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc5c7cc, 1.6))
    // A fixed studio spotlight from the headline, not from either side. The
    // centered front/top source sends every theme's shadows back and down.
    const key = new THREE.SpotLight(0xffffff, 750, 40, Math.PI / 5, 0.7, 2)
    key.name = 'headline-spotlight'
    key.position.set(0, 8.5, 8)
    key.target.position.set(0, -1.7, 1.6)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 40
    key.shadow.bias = -0.00005
    key.shadow.normalBias = 0.003
    scene.add(key, key.target)
    const fill = new THREE.DirectionalLight(0xe9eeff, 0.5)
    fill.position.set(0, 2, 10)
    scene.add(fill)

    const world = new THREE.Group()
    world.rotation.set(0, -stateRef.current.carouselStep * (Math.PI / 2), 0)
    scene.add(world)
    // Only the earth gets the opening spin. The scenes share the normal
    // carousel rotation, but stay in their own slots throughout the entrance.
    const earthSpin = new THREE.Group()
    earthSpin.name = 'earth-entrance-spin'
    world.add(earthSpin)
    const globe = mesh(createGroundedEarthGeometry(), materials.planet)
    globe.name = 'grounded-earth'
    earthSpin.add(globe)

    const orbitMaterial = new THREE.MeshStandardMaterial({ color: COLORS.white, roughness: 0.9 })
    const orbit = mesh(new THREE.TorusGeometry(PLANET_RADIUS + 0.035, 0.035, 10, 180), orbitMaterial, { rx: Math.PI / 2.08, rz: -0.12 })
    earthSpin.add(orbit)

    const anchors = [
      createCoffeeScene(world, materials),
      createWorkspaceScene(world, materials),
      createWalkingScene(world, materials),
      createGardenScene(world, materials),
    ]
    anchors.forEach((anchor) => {
      frameThemeComposition(anchor, camera)
      anchor.scale.setScalar(FOCUSED_THEME_SCALE)
    })
    const themeRevealEnd = THEME_REVEAL_START
      + (anchors.length - 1) * THEME_REVEAL_STAGGER + THEME_REVEAL_DURATION

    const bubbleHeads = anchors.map((anchor) => anchor.getObjectByName('ahwon-head'))
    const preferredBubbleSides = [-1, -1, 1, -1]
    const bubblePoint = new THREE.Vector3()
    const headEdge = new THREE.Vector3()
    const headScale = new THREE.Vector3()
    const bubbleMetrics = { node: null, diameter: 0, copyBottom: 0 }
    let viewportWidth = 1
    let viewportHeight = 1
    let visibleHalfHeight = 1
    let settledSince = null
    const resize = () => {
      const width = Math.max(mount.clientWidth, 1)
      const height = Math.max(mount.clientHeight, 1)
      viewportWidth = width
      viewportHeight = height
      bubbleMetrics.node = null
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      visibleHalfHeight = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
    if (copyRef?.current) resizeObserver.observe(copyRef.current)
    resize()

    const clock = new THREE.Clock()
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = motionPreference.matches
    const updateMotionPreference = (event) => { reduceMotion = event.matches }
    motionPreference.addEventListener('change', updateMotionPreference)
    let time = 0
    let rotationFrom = world.rotation.y
    let rotationTarget = world.rotation.y
    let carouselRotation = world.rotation.y
    let transitionTime = 1.2
    let introFinished = false
    const sceneTimes = anchors.map(() => 0)
    const updateBubble = (time, targetY) => {
      const bubble = bubbleRef?.current
      const index = stateRef.current.activeIndex - 1
      const head = bubbleHeads[index]
      if (!bubble || !head) return
      if (bubbleMetrics.node !== bubble) {
        bubbleMetrics.node = bubble
        bubbleMetrics.diameter = bubble.offsetWidth
        bubbleMetrics.copyBottom = (copyRef?.current?.getBoundingClientRect().bottom ?? 0) - mount.getBoundingClientRect().top
      }
      // Project the speaker's position so the bubble and pointer belong to the
      // scene even after framing, animation, scrolling, or viewport changes.
      head.localToWorld(bubblePoint.set(0, 0, 0))
      head.getWorldScale(headScale)
      // A conservative skull-and-hair radius, measured in screen pixels.
      headEdge.copy(bubblePoint)
      headEdge.x += 0.18 * Math.max(headScale.x, headScale.y, headScale.z)
      headEdge.project(camera)
      bubblePoint.project(camera)
      const layout = getSceneBubbleLayout({
        x: (bubblePoint.x + 1) * viewportWidth / 2,
        y: (1 - bubblePoint.y) * viewportHeight / 2,
        headRadius: Math.abs(headEdge.x - bubblePoint.x) * viewportWidth / 2,
        width: viewportWidth,
        height: viewportHeight,
        diameter: bubbleMetrics.diameter,
        copyBottom: bubbleMetrics.copyBottom,
        preferredSide: preferredBubbleSides[index],
      })
      const properties = {
        '--bubble-x': layout.x,
        '--bubble-y': layout.y,
        '--bubble-origin-x': layout.originX,
        '--bubble-origin-y': layout.originY,
        '--bubble-tail-x': layout.tailX,
        '--bubble-tail-y': layout.tailY,
        '--bubble-tail-length': layout.tailLength,
      }
      Object.entries(properties).forEach(([name, value]) => bubble.style.setProperty(name, `${value.toFixed(1)}px`))
      bubble.style.setProperty('--bubble-tail-angle', `${layout.tailAngle}rad`)
      const settled = introFinished && Math.abs(world.rotation.y - targetY) < 0.025
        && Math.abs(anchors[index].scale.x - FOCUSED_THEME_SCALE) < 0.025
      if (!settled) settledSince = null
      else if (settledSince === null) settledSince = time
      bubble.dataset.visible = String(settled && (reduceMotion || time - settledSince > 0.12))
    }
    let frameId
    const animate = () => {
      // Time-based motion behaves the same on a 30 Hz laptop and a 120 Hz
      // display. A background tab cannot jump a character ahead on return.
      const delta = Math.min(clock.getDelta(), 0.05) * (document.hidden ? 0 : 1)
      time += delta
      const targetY = -stateRef.current.carouselStep * (Math.PI / 2)
      if (targetY !== rotationTarget) {
        // Keep the entrance turn separate from user-driven carousel movement.
        rotationFrom = carouselRotation
        rotationTarget = targetY
        transitionTime = 0
        settledSince = null
      }
      transitionTime += delta
      const entranceProgress = reduceMotion ? 1 : THREE.MathUtils.clamp((time - INTRO_DELAY) / INTRO_DURATION, 0, 1)
      // One full turn with steadily decreasing speed, landing on coffee. The
      // smaller globe is fully visible before settling into its normal framing.
      const remainingTurn = (1 - entranceProgress) ** 3
      const growth = 1 - remainingTurn
      world.scale.setScalar(THREE.MathUtils.lerp(0.38, 1, growth))
      world.position.y = -visibleHalfHeight * THREE.MathUtils.lerp(0.2, WORLD_VERTICAL_OFFSET, growth)
      mount.style.opacity = reduceMotion ? '1' : String(easeMotion(time, INTRO_DELAY, INTRO_DELAY + 0.4))
      carouselRotation = reduceMotion ? targetY : THREE.MathUtils.lerp(rotationFrom, targetY, easeMotion(transitionTime, 0, 1.2))
      world.rotation.x = 0
      world.rotation.y = carouselRotation
      earthSpin.rotation.y = Math.PI * 2 * remainingTurn
      world.rotation.z = 0
      // Don't start the bubble, character action, or autoplay while later
      // themes are still rising. Reduced motion skips the entrance sequence.
      if (!introFinished && entranceProgress === 1 && (reduceMotion || time >= themeRevealEnd)) {
        introFinished = true
        onIntroComplete?.()
      }

      anchors.forEach((anchor, index) => {
        const selected = index === stateRef.current.activeIndex - 1
        const revealStart = THEME_REVEAL_START + index * THEME_REVEAL_STAGGER
        const reveal = reduceMotion ? 1 : easeMotion(time, revealStart, revealStart + THEME_REVEAL_DURATION)
        const facing = Math.cos(world.rotation.y + anchor.rotation.y)
        const front = easeMotion(facing, FRONT_THEME_THRESHOLD, 1)
        // Move the whole rigid scene under the round silhouette before its
        // side/back slot arrives. The opaque globe occludes that movement;
        // cull the parked scenes once fully hidden, including their shadows.
        // No vertex deformation, miniature side scenes, or independent scaling.
        anchor.position.y = THREE.MathUtils.lerp(HIDDEN_THEME_HEIGHT, GROUND_HEIGHT, front)
          - (1 - reveal) * THEME_REVEAL_RISE
        anchor.visible = reveal > 0 && front > 0
        const settled = introFinished && (reduceMotion || transitionTime >= 1.2)
        if (selected && settled && !reduceMotion) sceneTimes[index] += delta
        // Freeze the outgoing gesture; only rewind once it is behind the globe.
        // The incoming character waits for center before starting its action.
        if (!selected && Math.cos(world.rotation.y + anchor.rotation.y) < -0.05) sceneTimes[index] = 0
        anchor.userData.animate?.(sceneTimes[index], !reduceMotion && selected && settled, { settled, reducedMotion: reduceMotion, delta })
      })

      updateBubble(time, targetY)
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      motionPreference.removeEventListener('change', updateMotionPreference)
      resizeObserver.disconnect()
      world.traverse((object) => {
        object.geometry?.dispose?.()
      })
      Object.values(materials).forEach((item) => item.dispose())
      orbitMaterial.dispose()
      key.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [bubbleRef, copyRef, onIntroComplete])

  return <div ref={mountRef} className="planet-canvas" aria-hidden="true" />
}
