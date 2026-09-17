import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { AHWON_MARK, getMarkPoint, getMarkWritingProgress, MARK_WRITING_STROKES, MARK_WRITING_END } from '../data/ahwonMark'
import {
  createThemeMaterials, createCoffeeScene, createWorkspaceScene,
  createWalkingScene, createGardenScene, getSceneBubbleLayout,
} from './PlanetScene3D'

const STAGE_RADIUS = 4.45
const ACT_RADIUS = 2.1
const VIEW_HALF_HEIGHT = 4.8
const SIDE_ELEVATION = THREE.MathUtils.degToRad(10)
const TURN_DURATION = 1.2
const CAMERA_START = MARK_WRITING_END + 0.65
const CAMERA_END = CAMERA_START + 2.2
const ACT_START = CAMERA_END + 0.05
const INTRO_END = ACT_START + 0.75
const smooth = (value, start, end) => THREE.MathUtils.smootherstep(value, start, end)

// Refined geometric master: concentric circles, equal ring spacing, matched
// arc openings and uniform rounded terminals, not the sketch's hand-drawn wobble.
function createNameMark(markMaterial) {
  const group = new THREE.Group()
  group.name = 'ahwon-korean-name-mark'
  const unit = 3.7 / AHWON_MARK.outerRadius
  const strokeRadius = AHWON_MARK.strokeWidth * unit / 2
  class MarkCurve extends THREE.Curve {
    constructor(definition, from, to) { super(); this.definition = definition; this.from = from; this.to = to }
    getPoint(t, target = new THREE.Vector3()) {
      const point = getMarkPoint(this.definition, this.from + (this.to - this.from) * t)
      return target.set(point.x * unit, 0.014, -point.y * unit)
    }
  }
  MARK_WRITING_STROKES.forEach((writing, index) => {
    const definition = AHWON_MARK.paths[writing.path]
    const path = new MarkCurve(definition, writing.from, writing.to)
    const closed = !!definition.closed && Math.abs(writing.to - writing.from) === 1
    const geometry = new THREE.TubeGeometry(path, definition.radius ? 240 : 8, strokeRadius, 12, closed)
    const body = new THREE.Mesh(geometry, markMaterial)
    const startCap = new THREE.Mesh(new THREE.SphereGeometry(strokeRadius, 16, 12), markMaterial)
    const endCap = new THREE.Mesh(new THREE.SphereGeometry(strokeRadius, 16, 12), markMaterial)
    startCap.position.copy(path.getPoint(0))
    endCap.position.copy(path.getPoint(1))
    const stroke = new THREE.Group()
    stroke.name = 'name-mark-stroke-' + index
    stroke.add(body, startCap, endCap)
    stroke.userData = { body, startCap, endCap, path, closed, indexCount: geometry.index.count, writing }
    stroke.traverse((object) => { object.castShadow = false; object.receiveShadow = true })
    group.add(stroke)
  })
  return group
}

function fitAct(anchor) {
  anchor.userData.animate?.(0, false)
  const composition = new THREE.Group()
  composition.name = 'theater-act-artwork'
  composition.add(...anchor.children)
  const bounds = new THREE.Box3()
  composition.updateMatrixWorld(true)
  composition.traverse((object) => {
    if (object.isMesh && object.castShadow) bounds.union(new THREE.Box3().setFromObject(object))
  })
  const size = bounds.getSize(new THREE.Vector3())
  const center = bounds.getCenter(new THREE.Vector3())
  // The angled desk needs more depth, not a smaller person. Give the complete
  // work set room so its front-view height matches coffee and gardening.
  const depthLimit = composition.getObjectByName('workspace-layout') ? 3.2 : 2.7
  const scale = Math.min(3.15 / size.x, 3.15 / size.y, depthLimit / size.z)
  composition.scale.setScalar(scale)
  composition.position.set(-center.x * scale, 0, -center.z * scale)
  anchor.add(composition)
  anchor.scale.setScalar(1)
  anchor.position.set(Math.sin(anchor.rotation.y) * ACT_RADIUS, 0, Math.cos(anchor.rotation.y) * ACT_RADIUS)

  // Each act has its own materials so the brief stage change cannot fade the
  // other acts, their character parts, or the circular floor.
  const clones = new Map()
  anchor.traverse((object) => {
    if (!object.isMesh) return
    const clone = (original) => {
      if (!clones.has(original)) {
        const copy = original.clone()
        copy.userData.baseOpacity = original.opacity
        copy.transparent = true
        clones.set(original, copy)
      }
      return clones.get(original)
    }
    object.material = Array.isArray(object.material) ? object.material.map(clone) : clone(object.material)
  })
  anchor.userData.fadeMaterials = [...clones.values()]
  return anchor
}

function refineAct(anchor) {
  // Simplify only after fitting: keep the approved scene sizes, poses and
  // character silhouettes while removing detail that becomes visual noise.
  anchor.traverse((object) => {
    if (!object.isMesh) return
    const role = object.material.userData.sceneRole
    const geometry = object.geometry
    const clothingDetail = ['hoodieTrim', 'hoodieCord'].includes(role)
    const keyboardKey = object.parent.name === 'workspace-keyboard' && geometry.parameters.width < 0.1
    const faceDetail = object.parent.name === 'ahwon-head' && (
      (role === 'hair' && geometry.type === 'TubeGeometry' && geometry.parameters.radius < 0.01)
      || (role === 'skin' && geometry.parameters.radius === 0.01)
    )
    const decorativePath = role === 'white' && geometry.type === 'TubeGeometry' && geometry.parameters.radius === 0.095
    if (clothingDetail || keyboardKey || faceDetail || decorativePath) {
      object.visible = false
      object.castShadow = false
    }
  })
  return anchor
}

export default function TheaterScene3D({ carouselStep = 0, activeIndex = 1, bubbleRef, copyRef, onIntroComplete }) {
  const mountRef = useRef(null)
  const stateRef = useRef({ carouselStep, activeIndex })
  useEffect(() => { stateRef.current = { carouselStep, activeIndex } }, [carouselStep, activeIndex])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined
    const scene = new THREE.Scene()
    // Parallel projection keeps furniture upright and the mark truly circular
    // in the opening; camera elevation alone reveals the depth of the stage.
    const camera = new THREE.OrthographicCamera(-VIEW_HALF_HEIGHT, VIEW_HALF_HEIGHT, VIEW_HALF_HEIGHT, -VIEW_HALF_HEIGHT, 0.1, 80)
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
    Object.entries(materials).forEach(([role, material]) => {
      material.userData.sceneRole = role
      material.clearcoat = 0
      material.roughness = Math.max(material.roughness, 0.85)
    })
    // Quiet neutral clothing lets the mug, foliage and blossoms carry color.
    materials.person.color.set(0xe5e9e7)
    materials.trousers.color.set(0x89919a)
    materials.mid.color.set(0xc5c8cd)
    const surfaceMaterial = new THREE.MeshPhysicalMaterial({ color: 0xf7f7f5, roughness: 0.87, transparent: true })
    const edgeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xd4d7dc, roughness: 0.78, transparent: true })
    const markMaterial = new THREE.MeshPhysicalMaterial({ color: 0x2949a9, roughness: 0.7, emissive: 0x496bce, emissiveIntensity: 0 })
    const markBlue = new THREE.Color(0x2949a9)
    const inlayColor = new THREE.Color(0xe0e4ed)
    const shadowMaterial = new THREE.ShadowMaterial({ color: 0x505967, opacity: 0.07 })

    scene.add(new THREE.HemisphereLight(0xffffff, 0xc7cbd2, 1.65))
    const spotlight = new THREE.SpotLight(0xffffff, 580, 40, Math.PI / 5, 0.72, 2)
    spotlight.name = 'headline-spotlight'
    spotlight.position.set(0, 10, 8)
    spotlight.target.position.set(0, 0, 1.2)
    spotlight.castShadow = true
    spotlight.shadow.mapSize.set(2048, 2048)
    spotlight.shadow.camera.near = 0.5
    spotlight.shadow.camera.far = 35
    spotlight.shadow.bias = -0.00005
    spotlight.shadow.normalBias = 0.012
    scene.add(spotlight, spotlight.target)
    const fill = new THREE.DirectionalLight(0xe9eeff, 0.5)
    fill.position.set(0, 3, 10)
    scene.add(fill)

    const world = new THREE.Group()
    world.name = 'circular-theater'
    const turntable = new THREE.Group()
    turntable.name = 'rotating-stage'
    world.add(turntable)
    scene.add(world)
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(STAGE_RADIUS, STAGE_RADIUS, 0.14, 128), surfaceMaterial)
    floor.name = 'circular-stage-floor'
    floor.position.y = -0.07
    floor.castShadow = true
    floor.receiveShadow = true
    const edge = new THREE.Mesh(new THREE.CylinderGeometry(STAGE_RADIUS - 0.06, STAGE_RADIUS - 0.14, 0.045, 128), edgeMaterial)
    edge.position.y = -0.1625
    edge.castShadow = true
    edge.receiveShadow = true
    turntable.add(floor, edge)
    const mark = createNameMark(markMaterial)
    turntable.add(mark)
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), shadowMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.19
    ground.receiveShadow = true
    world.add(ground)

    const anchors = [
      createCoffeeScene(turntable, materials), createWorkspaceScene(turntable, materials),
      createWalkingScene(turntable, materials), createGardenScene(turntable, materials),
    ].map(fitAct).map(refineAct)
    const heads = anchors.map((anchor) => anchor.getObjectByName('ahwon-head'))
    const preferredSides = [-1, -1, 1, -1]
    const headPosition = new THREE.Vector3()
    const headEdge = new THREE.Vector3()
    const headScale = new THREE.Vector3()
    const cameraUp = new THREE.Vector3()
    const target = new THREE.Vector3()
    let width = 1
    let height = 1
    let responsiveScale = 1
    let bubbleMetrics = null
    const resize = () => {
      width = Math.max(mount.clientWidth, 1)
      height = Math.max(mount.clientHeight, 1)
      const aspect = width / height
      camera.left = -VIEW_HALF_HEIGHT * aspect
      camera.right = VIEW_HALF_HEIGHT * aspect
      camera.updateProjectionMatrix()
      responsiveScale = Math.min(1, VIEW_HALF_HEIGHT * aspect * 0.91 / STAGE_RADIUS)
      renderer.setSize(width, height, false)
      bubbleMetrics = null
    }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    if (copyRef?.current) observer.observe(copyRef.current)
    resize()
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = preference.matches
    const updatePreference = (event) => { reduceMotion = event.matches }
    preference.addEventListener('change', updatePreference)
    const clock = new THREE.Clock()
    const sceneTimes = anchors.map(() => 0)
    let time = 0
    let introFinished = false
    let turnTime = TURN_DURATION
    let rotation = -stateRef.current.carouselStep * Math.PI / 2
    let rotationFrom = rotation
    let rotationTarget = rotation
    let settledSince = null
    let frameId

    const updateBubble = () => {
      const bubble = bubbleRef?.current
      const index = stateRef.current.activeIndex - 1
      const head = heads[index]
      if (!bubble || !head) return
      if (!bubbleMetrics || bubbleMetrics.node !== bubble) {
        bubbleMetrics = {
          node: bubble, diameter: bubble.offsetWidth,
          copyBottom: (copyRef?.current?.getBoundingClientRect().bottom ?? 0) - mount.getBoundingClientRect().top,
        }
      }
      head.getWorldPosition(headPosition)
      head.getWorldScale(headScale)
      headEdge.copy(headPosition)
      headEdge.x += 0.18 * Math.max(headScale.x, headScale.y, headScale.z)
      headPosition.project(camera)
      headEdge.project(camera)
      const layout = getSceneBubbleLayout({
        x: (headPosition.x + 1) * width / 2, y: (1 - headPosition.y) * height / 2,
        headRadius: Math.abs(headPosition.x - headEdge.x) * width / 2,
        width, height, diameter: bubbleMetrics.diameter, copyBottom: bubbleMetrics.copyBottom,
        preferredSide: preferredSides[index],
      })
      const properties = {
        '--bubble-x': layout.x, '--bubble-y': layout.y,
        '--bubble-origin-x': layout.originX, '--bubble-origin-y': layout.originY,
        '--bubble-tail-x': layout.tailX, '--bubble-tail-y': layout.tailY,
        '--bubble-tail-length': layout.tailLength,
      }
      Object.entries(properties).forEach(([name, value]) => bubble.style.setProperty(name, value.toFixed(1) + 'px'))
      bubble.style.setProperty('--bubble-tail-angle', layout.tailAngle + 'rad')
      const settled = introFinished && turnTime >= TURN_DURATION && anchors[index].visible
      if (!settled) settledSince = null
      else if (settledSince === null) settledSince = time
      bubble.dataset.visible = String(settled && (reduceMotion || time - settledSince > 0.12))
    }

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05) * (document.hidden ? 0 : 1)
      time += delta
      const cameraProgress = reduceMotion ? 1 : smooth(time, CAMERA_START, CAMERA_END)
      const stageProgress = reduceMotion ? 1 : smooth(time, CAMERA_START + 0.3, CAMERA_END - 0.5)
      const firstReveal = reduceMotion ? 1 : smooth(time, ACT_START, INTRO_END)
      const elevation = THREE.MathUtils.lerp(Math.PI / 2, SIDE_ELEVATION, cameraProgress)
      cameraUp.set(0, Math.cos(elevation), -Math.sin(elevation))
      target.copy(cameraUp).multiplyScalar(VIEW_HALF_HEIGHT * THREE.MathUtils.lerp(0.27, 0.51, cameraProgress))
      camera.position.set(0, Math.sin(elevation) * 18, Math.cos(elevation) * 18).add(target)
      camera.up.copy(cameraUp)
      camera.lookAt(target)
      camera.updateMatrixWorld(true)
      world.scale.setScalar(responsiveScale * THREE.MathUtils.lerp(0.55, 1, cameraProgress))
      mount.style.opacity = reduceMotion ? '1' : String(smooth(time, 0.25, 0.7))
      floor.visible = edge.visible = ground.visible = stageProgress > 0
      surfaceMaterial.opacity = edgeMaterial.opacity = stageProgress
      shadowMaterial.opacity = stageProgress * 0.07
      markMaterial.color.lerpColors(markBlue, inlayColor, cameraProgress)
      // One soft lift in the ink's light as the drawing resolves, then settle
      // back to the original blue before the camera begins its move.
      const inkLight = reduceMotion ? 0 : smooth(time, 2.4, MARK_WRITING_END) * (1 - smooth(time, MARK_WRITING_END, CAMERA_START))
      markMaterial.emissiveIntensity = inkLight * 0.32
      mark.scale.y = THREE.MathUtils.lerp(1, 0.25, cameraProgress)
      mark.children.forEach((stroke) => {
        const { body, startCap, endCap, path, closed, indexCount, writing } = stroke.userData
        // Independent, overlapping pen tips ease into the unchanged mark.
        // Reveal complete tube rings so moving tips stay rounded and clean.
        const drawn = reduceMotion ? 1 : getMarkWritingProgress(time, writing)
        stroke.visible = drawn > 0
        const ringIndices = body.geometry.parameters.radialSegments * 6
        body.geometry.setDrawRange(0, Math.floor(indexCount * drawn / ringIndices) * ringIndices)
        startCap.visible = !closed || drawn < 1
        endCap.visible = !closed || drawn < 1
        endCap.position.copy(path.getPoint(drawn))
      })

      const nextTarget = -stateRef.current.carouselStep * Math.PI / 2
      if (nextTarget !== rotationTarget) {
        rotationFrom = rotation
        rotationTarget = nextTarget
        turnTime = 0
        settledSince = null
      }
      turnTime += delta
      rotation = reduceMotion ? rotationTarget : THREE.MathUtils.lerp(rotationFrom, rotationTarget, smooth(turnTime, 0, TURN_DURATION))
      // Read the mark before any carousel turn. User input during the entrance
      // is queued to the selected act rather than rotating the opening drawing.
      turntable.rotation.y = cameraProgress < 1 ? 0 : rotation
      if (!introFinished && (reduceMotion || time >= INTRO_END)) {
        introFinished = true
        onIntroComplete?.()
      }
      anchors.forEach((anchor, index) => {
        const selected = index === stateRef.current.activeIndex - 1
        const angle = Math.acos(THREE.MathUtils.clamp(Math.cos(turntable.rotation.y + anchor.rotation.y), -1, 1))
        // One act occupies the front window; the rest wait backstage. Only a
        // horizontal circular orbit moves the set—no bending or sinking floor.
        const focus = 1 - smooth(angle, Math.PI * 0.14, Math.PI * 0.24)
        const opacity = focus * firstReveal
        anchor.visible = opacity > 0.001
        anchor.position.y = (1 - firstReveal) * 0.22
        anchor.userData.fadeMaterials.forEach((item) => { item.opacity = item.userData.baseOpacity * opacity })
        const settled = introFinished && (reduceMotion || turnTime >= TURN_DURATION)
        if (selected && settled && !reduceMotion) sceneTimes[index] += delta
        if (!selected && !anchor.visible) sceneTimes[index] = 0
        anchor.userData.animate?.(sceneTimes[index], !reduceMotion && selected && settled, { settled, reducedMotion: reduceMotion, delta })
      })
      world.updateMatrixWorld(true)
      updateBubble()
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      preference.removeEventListener('change', updatePreference)
      observer.disconnect()
      world.traverse((object) => { object.geometry?.dispose() })
      anchors.forEach((anchor) => anchor.userData.fadeMaterials.forEach((item) => item.dispose()))
      Object.values(materials).forEach((item) => item.dispose())
      ;[surfaceMaterial, edgeMaterial, markMaterial, shadowMaterial].forEach((item) => item.dispose())
      spotlight.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [bubbleRef, copyRef, onIntroComplete])

  return <div ref={mountRef} className="planet-canvas" aria-hidden="true" />
}
