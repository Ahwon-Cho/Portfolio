import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  createThemeMaterials, createCoffeeScene, createWorkspaceScene,
  createWalkingScene, createGardenScene,
} from './PlanetScene3D'

const IDS = ['coffee', 'work', 'nature', 'garden']
const ELEVATION = Math.asin(69 / 361)
const TURN_SECONDS = 1.04
const ease = (value) => THREE.MathUtils.smootherstep(value, 0, 1)
const PIGMENTS = {
  white: 0xf8f7f1, pale: 0xe7e8e1, mid: 0x979e9b, tablePedestal: 0xb9bfbd,
  dark: 0x374440, ink: 0x18211f, red: 0xa44d4b, green: 0x668777,
  blue: 0x657e95, figure: 0xe2bda4, person: 0x87a493, skin: 0xecc8ac,
  hair: 0x17201e, eyes: 0x121a18, smile: 0x443c35,
  hoodieTrim: 0x87a493, hoodieCord: 0xa7b8a7, trousers: 0xb6a18a,
  sneakers: 0xf3f1e7, dog: 0xf0eee3, sole: 0x768080, wood: 0x9b9e91,
  gardenSoil: 0xa19f8f, gardenGreen: 0x7c9786, tomato: 0xb56a67,
  zucchini: 0x536e60, water: 0x92acba, screen: 0x657a8c,
  steam: 0xd6cec0, coffee: 0x675750,
}

function paintedMaterials() {
  return Object.fromEntries(Object.entries(createThemeMaterials()).map(([role, source]) => {
    const material = new THREE.MeshBasicMaterial({
      color: PIGMENTS[role] ?? source.color,
      // Only water/steam are translucent. Brushwork never fades the figures.
      transparent: ['water', 'steam'].includes(role),
      opacity: ['water', 'steam'].includes(role) ? source.opacity : 1,
      depthWrite: !['water', 'steam'].includes(role), side: source.side,
    })
    material.userData.paintedRole = role
    const foliage = ['green', 'gardenGreen', 'zucchini', 'wood'].includes(role)
    const darkInk = ['hair', 'ink', 'eyes', 'smile'].includes(role)
    const delicate = ['skin', 'figure', 'white', 'pale', 'sneakers', 'dog'].includes(role)
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uPigmentSoftness = { value: darkInk ? .035 : delicate ? .1 : .32 }
      shader.uniforms.uInkPooling = { value: foliage ? .62 : darkInk ? .18 : 0 }
      shader.vertexShader = 'varying vec3 vPaintedNormal; varying vec3 vPigmentPosition;\n' + shader.vertexShader
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', `
        #include <begin_vertex>
        vPaintedNormal = normalize(normalMatrix * normal);
        vPigmentPosition = position;
      `)
      shader.fragmentShader = `
        varying vec3 vPaintedNormal;
        varying vec3 vPigmentPosition;
        uniform float uPigmentSoftness;
        uniform float uInkPooling;
        float pigmentHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        float pigmentNoise(vec3 p) {
          vec3 i = floor(p), f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(pigmentHash(i), pigmentHash(i + vec3(1,0,0)), f.x),
                         mix(pigmentHash(i + vec3(0,1,0)), pigmentHash(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(pigmentHash(i + vec3(0,0,1)), pigmentHash(i + vec3(1,0,1)), f.x),
                         mix(pigmentHash(i + vec3(0,1,1)), pigmentHash(i + vec3(1,1,1)), f.x), f.y), f.z);
        }
      ` + shader.fragmentShader
      shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', `
        #include <color_fragment>
        // Soft color diffusion remains inside a solid form. Crisp black ink
        // supplies structure; neither body alpha nor a page-wide blur does.
        float form = smoothstep(-0.5, 0.85, dot(normalize(vPaintedNormal), normalize(vec3(-0.3, 0.8, 1.0))));
        float bloom = pigmentNoise(vPigmentPosition * 8.0 + vec3(2.4, 7.1, 4.6));
        float pool = smoothstep(0.4, 0.72, pigmentNoise(vPigmentPosition * 13.0));
        diffuseColor.rgb *= mix(0.95, 1.0, form);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.94, 0.935, 0.91), smoothstep(0.24, 0.8, bloom) * uPigmentSoftness);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.013, 0.021, 0.018), pool * uInkPooling);
      `)
    }
    material.customProgramCacheKey = () => 'painted-ink-led-color-v2'
    source.dispose()
    return [role, material]
  }))
}

function brushOutlineMaterial() {
  const brush = new THREE.TextureLoader().load('/textures/ink-dry-brush.webp')
  brush.wrapS = brush.wrapT = THREE.MirroredRepeatWrapping
  brush.colorSpace = THREE.NoColorSpace
  const outline = new THREE.MeshBasicMaterial({ color: 0x19211e, side: THREE.BackSide })
  outline.name = 'opaque-brush-contour'
  outline.userData.brushTexture = brush
  outline.onBeforeCompile = (shader) => {
    shader.uniforms.uContourBrush = { value: brush }
    shader.vertexShader = 'uniform sampler2D uContourBrush;\n' + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace('#include <project_vertex>', `
      #include <project_vertex>
      // A pressure-loaded black brush: tapered hairlines and broader dry nib
      // marks, with texture in the contour rather than translucent gray ink.
      float bristle = texture2D(uContourBrush, position.xy * 3.7 + position.z * 0.8).r;
      float pressure = 0.28 + bristle * 1.7 + 0.48 * sin(position.y * 27.0 + position.x * 19.0)
        + 0.18 * sin(position.z * 113.0 + position.y * 79.0);
      pressure = max(0.12, pressure);
      vec2 direction = (projectionMatrix * vec4(normalize(normalMatrix * normal), 0.0)).xy;
      direction /= max(length(direction), 0.0001);
      gl_Position.xy += direction * pressure * vec2(2.0 / 780.0, 2.0 / 440.0) * gl_Position.w;
    `)
  }
  outline.customProgramCacheKey = () => 'painted-black-brush-outline-v2'
  return outline
}

function solidBounds(group, bounds = new THREE.Box3()) {
  group.updateMatrixWorld(true)
  group.traverseVisible((object) => {
    if (!object.isMesh || !object.castShadow || object.name === 'painted-brush-contour') return
    object.geometry.computeBoundingBox()
    bounds.union(object.geometry.boundingBox.clone().applyMatrix4(object.matrixWorld))
  })
  return bounds
}

// Reuse the original articulated models; never crop or stretch the reference
// painting to invent the missing lower half of a person.
export function createPaintedActors() {
  const world = new THREE.Group()
  const materials = paintedMaterials()
  const outline = brushOutlineMaterial()
  const factories = [createCoffeeScene, createWorkspaceScene, createWalkingScene, createGardenScene]
  const actors = factories.map((factory, index) => {
    const anchor = factory(world, materials)
    anchor.name = `painted-full-body-${IDS[index]}`
    anchor.position.set(0, 0, 0)
    anchor.rotation.set(0, 0, 0)

    if (IDS[index] === 'nature') {
      // The cherry tree and path belong to the full-page painted backdrop,
      // not to the rotating set. Retain just bench, people and two dogs here.
      const scenery = anchor.children.filter((child) => {
        let tree = false
        child.traverse((part) => { if (['blossom', 'blossomLight'].includes(part.material?.userData.paintedRole)) tree = true })
        return tree || (child.isMesh && child.geometry.type === 'TubeGeometry')
      })
      scenery.forEach((child) => {
        anchor.remove(child)
        child.traverse((part) => part.geometry?.dispose())
      })
    }

    const meshes = []
    anchor.traverse((object) => {
      if (!object.isMesh) return
      const role = object.material.userData.paintedRole
      const tinyHeadDetail = object.parent.name === 'ahwon-head' && (
        (role === 'hair' && object.geometry.type === 'TubeGeometry' && object.geometry.parameters.radius < .01)
        || (role === 'skin' && object.geometry.parameters.radius < .015)
      )
      if (tinyHeadDetail || ['hoodieCord', 'hoodieTrim'].includes(role)) {
        object.visible = false
        object.castShadow = false
      }
      object.receiveShadow = false
      if (object.visible && !['eyes', 'smile', 'steam', 'water'].includes(role)) {
        object.geometry.computeBoundingSphere()
        if (object.geometry.boundingSphere.radius >= .028) meshes.push(object)
      }
    })

    // Reserve the whole motion envelope once, so standing, sitting, stepping
    // and sipping never change scale or cut off a head, foot or dog.
    const bounds = new THREE.Box3()
    for (const time of [0, 1.5, 3, 4.5, 6, 8, 10, 12]) {
      anchor.userData.animate(time, true, { settled: true })
      solidBounds(anchor, bounds)
    }
    const center = bounds.getCenter(new THREE.Vector3())
    const size = bounds.getSize(new THREE.Vector3())
    const scale = Math.min(2.65, 3.05 / size.y, 5.6 / size.x, 4.4 / size.z)
    anchor.userData.animate(0, false)
    const composition = new THREE.Group()
    composition.name = 'painted-full-body-composition'
    composition.add(...anchor.children)
    composition.scale.setScalar(scale)
    composition.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale)
    anchor.add(composition)
    anchor.userData.framing = { scale, size: size.toArray() }

    meshes.forEach((object) => {
      const contour = new THREE.Mesh(object.geometry, outline)
      contour.name = 'painted-brush-contour'
      object.add(contour)
    })
    return anchor
  })
  return { world, actors, materials, outline }
}

export function createPaintedCamera() {
  const camera = new THREE.OrthographicCamera(-3.9, 3.9, 2.2, -2.2, .1, 50)
  const up = new THREE.Vector3(0, Math.cos(ELEVATION), -Math.sin(ELEVATION))
  const target = up.clone().multiplyScalar(1.32)
  camera.position.set(0, Math.sin(ELEVATION) * 18, Math.cos(ELEVATION) * 18).add(target)
  camera.up.copy(up)
  camera.lookAt(target)
  camera.updateMatrixWorld(true)
  return camera
}

export default function PaintedActors3D({ sceneStep, direction, arrived, running, reducedMotion, onReady, onError, onSettled }) {
  const mountRef = useRef(null)
  const state = useRef({ sceneStep, direction, arrived, running, reducedMotion })
  state.current = { sceneStep, direction, arrived, running, reducedMotion }

  useEffect(() => {
    const mount = mountRef.current
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    } catch { onError(); return undefined }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
    renderer.setSize(780, 440)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.NoToneMapping
    renderer.domElement.setAttribute('aria-hidden', 'true')
    mount.append(renderer.domElement)
    const scene = new THREE.Scene()
    const camera = createPaintedCamera()
    const { world, actors, materials, outline } = createPaintedActors()
    scene.add(world)
    const wrap = (step) => (step % actors.length + actors.length) % actors.length
    let activeStep = state.current.sceneStep
    let displayed = wrap(activeStep)
    let transition = 1
    let elapsed = 0
    let firstArrival = false
    let settled = false
    let frame
    let previousTime = performance.now()
    let wasRunning = false
    let renderDirty = true
    let brushVersion = outline.userData.brushTexture.version
    const contextLost = (event) => { event.preventDefault(); onError() }
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    renderer.compile(scene, camera)
    actors.forEach((actor) => { actor.visible = false })
    renderer.render(scene, camera)
    onReady()

    function draw(now) {
      const delta = Math.min((now - previousTime) / 1000, .05)
      previousTime = now
      const current = state.current
      if (outline.userData.brushTexture.version !== brushVersion) {
        brushVersion = outline.userData.brushTexture.version
        renderDirty = true
      }
      if (current.sceneStep !== activeStep) {
        activeStep = current.sceneStep
        transition = current.reducedMotion ? 1 : 0
        settled = false
        renderDirty = true
      }
      if (current.arrived && !firstArrival) {
        firstArrival = true
        transition = current.reducedMotion ? 1 : .5
        renderDirty = true
      }
      if (firstArrival && transition < 1) {
        transition = current.reducedMotion ? 1 : Math.min(1, transition + delta / TURN_SECONDS)
        renderDirty = true
      }
      const incoming = wrap(activeStep)
      if (transition >= .5 && displayed !== incoming) {
        displayed = incoming
        elapsed = 0
        renderDirty = true
      }
      // Manual navigation still finishes when paused; only the character and
      // automatic carousel clocks pause. Never reset a pose when pausing it.
      const moving = current.running && current.arrived && transition >= 1
      if (moving) { elapsed += wasRunning ? delta : 0; renderDirty = true }
      if (current.reducedMotion !== actors[displayed].userData.reduced) renderDirty = true
      wasRunning = moving
      if (renderDirty) {
        actors.forEach((actor, index) => { actor.visible = current.arrived && index === displayed })
        const actor = actors[displayed]
        const half = transition < .5 ? transition * 2 : (transition - .5) * 2
        const travel = transition < .5 ? -ease(half) : 1 - ease(half)
        actor.position.x = current.direction * travel * 1.15
        actor.position.y = 0
        // A short horizontal turn, not skewed image planes. Each set stays
        // rigid and upright; only one act is visible at a time.
        actor.rotation.y = -current.direction * travel * .16
        actor.scale.setScalar(transition < .5 ? 1 - ease(half) * .12 : .88 + ease(half) * .12)
        mount.style.opacity = String(current.arrived ? (transition < .5 ? 1 - ease(half) : ease(half)) : 0)
        actor.userData.animate(elapsed, moving, { settled: transition >= 1, reducedMotion: current.reducedMotion })
        actor.userData.reduced = current.reducedMotion
        renderer.render(scene, camera)
        mount.dataset.scene = IDS[displayed]
        mount.dataset.motionTime = elapsed.toFixed(3)
        mount.dataset.phase = actor.userData.parkPhase || actor.userData.workPhase || actor.userData.coffeePhase || 'watering'
        mount.dataset.fullBody = 'true'
        renderDirty = false
      }
      if (current.arrived && transition >= 1 && !settled) { settled = true; onSettled() }
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      const geometries = new Set()
      world.traverse((part) => { if (part.geometry) geometries.add(part.geometry) })
      geometries.forEach((geometry) => geometry.dispose())
      Object.values(materials).forEach((material) => material.dispose())
      outline.userData.brushTexture.dispose()
      outline.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [onReady, onError, onSettled])

  return <div className="painted-actors-3d" ref={mountRef} aria-hidden="true" />
}
