import * as THREE from 'three'
import { createBookCloth } from './bookMaterials'
import { createActorMotion } from './bookSceneMotion'
import { createBookContactShadow } from './bookContactShadow'
import { chapters, FIRST_PAGE, CHAPTER_LENGTH, DURATION, chapterAt, chapterStart, chapterSettled, stageAt, nextStop, previousStop } from './bookChapters'

// Original coffee cutouts and reference-matched layers share one real book.
// Objects are 2.5D cutouts; page geometry and camera movement are real 3D.
export async function createBookScene(container, { onState = () => {} } = {}) {
  if (!container) throw new Error('Book canvas host is unavailable.')
  const W = 3.12, H = 4.2, PW = 3.01, PH = 4.06, TOP = .16
  const BLUE = '#414757', PAPER = '#fffdf7'
  const BOARD_THICKNESS = .095, BACK_Y = .025, CLOSED_SURFACE = TOP + .016
  const OPEN_COVER_Y = BACK_Y - BOARD_THICKNESS
  const CLOSED_COVER_Y = 2 * CLOSED_SURFACE - OPEN_COVER_Y + .002
  const base = '/images/book-story/'
  let disposed = false, needsRender = true, renderedTime = NaN
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const testing = new URLSearchParams(location.search).has('render')
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: testing })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.localClippingEnabled = true
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.setClearColor('#f7f7f5')
  renderer.domElement.setAttribute('aria-hidden', 'true')
  container.appendChild(renderer.domElement)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 70)
  scene.add(new THREE.HemisphereLight('#ffffff', '#cdd1d5', 2.3))
  const light = new THREE.DirectionalLight('#fffaf2', 2.1)
  light.position.set(-3, 10, 4)
  light.castShadow = true
  light.shadow.mapSize.set(2048, 2048)
  Object.assign(light.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: .1, far: 22 })
  light.shadow.bias = -.00025
  light.shadow.normalBias = .008
  light.shadow.radius = 5
  scene.add(light)
  const fill = new THREE.DirectionalLight('#e8eef8', .35)
  fill.position.set(5, 3, -5); scene.add(fill)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.ShadowMaterial({ color: '#43505c', opacity: .17 }))
  ground.rotation.x = -Math.PI / 2; ground.position.y = OPEN_COVER_Y - .01; ground.receiveShadow = true; scene.add(ground)
  const book = new THREE.Group(); scene.add(book)
  const contactShadow = createBookContactShadow(book, W, H, ground.position.y)
  const textures = new Set()
  const cloth = createBookCloth(Math.min(renderer.capabilities.getMaxAnisotropy(), 8))
  textures.add(cloth.texture)
  const clamp = n => Math.min(1, Math.max(0, n))
  const ease = n => { n = clamp(n); return n * n * n * (n * (n * 6 - 15) + 10) }
  const range = (t, a, b) => ease((t - a) / (b - a))
  const lerp = THREE.MathUtils.lerp
  const ctex = (w, h, paint) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h
    paint(c.getContext('2d'), w, h)
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)
    textures.add(tex); return tex
  }
  const paper = ctex(256, 256, (g, w, h) => {
    g.fillStyle = PAPER; g.fillRect(0, 0, w, h)
    // Very fine deterministic paper grain, not decorative illustration.
    for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(125,112,95,${.01 + (i % 4) * .006})`; g.fillRect((i * 53) % w, (i * 89) % h, 1, 1) }
  })
  function rounded(w, h, r = .06) {
    const s = new THREE.Shape()
    s.moveTo(r, -h / 2); s.lineTo(w - r, -h / 2); s.quadraticCurveTo(w, -h / 2, w, -h / 2 + r)
    s.lineTo(w, h / 2 - r); s.quadraticCurveTo(w, h / 2, w - r, h / 2)
    s.lineTo(r, h / 2); s.quadraticCurveTo(0, h / 2, 0, h / 2 - r)
    s.lineTo(0, -h / 2 + r); s.quadraticCurveTo(0, -h / 2, r, -h / 2)
    return s
  }
  function board() {
    const geom = new THREE.ExtrudeGeometry(rounded(W, H, .035), { depth: BOARD_THICKNESS, bevelEnabled: true, bevelSize: .008, bevelThickness: .008, bevelSegments: 4, curveSegments: 16 })
    geom.rotateX(-Math.PI / 2); geom.translate(0, -BOARD_THICKNESS, 0)
    const mesh = new THREE.Mesh(geom, cloth.binding(BLUE))
    mesh.castShadow = true; mesh.receiveShadow = true; return mesh
  }
  const back = board(); back.position.y = BACK_Y; book.add(back)
  const cover = new THREE.Group(); book.add(cover)
  cover.add(board())
  const coverGeom = new THREE.ShapeGeometry(rounded(W - .012, H - .012, .032), 20)
  coverGeom.rotateX(-Math.PI / 2)
  const pos = coverGeom.attributes.position, uv = coverGeom.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / (W - .012), .5 - pos.getZ(i) / (H - .012))
  const coverMaterial = cloth.cover
  const print = new THREE.Mesh(coverGeom, coverMaterial); print.position.set(.006, .010, 0)
  print.receiveShadow = true; cover.add(print)
  // Rounded cloth spine closes the exposed gutter. It relaxes flat beneath
  // the spread as the book opens, rather than leaving a standing center wall.
  const spineHeight = CLOSED_COVER_Y - OPEN_COVER_Y
  const spineShape = new THREE.Shape()
  spineShape.moveTo(.035, 0); spineShape.lineTo(-.045, 0)
  spineShape.bezierCurveTo(-.19, .035, -.19, spineHeight - .035, -.045, spineHeight)
  spineShape.lineTo(.035, spineHeight); spineShape.closePath()
  const spineGeometry = new THREE.ExtrudeGeometry(spineShape, { depth: H - .04, bevelEnabled: true, bevelSize: .006, bevelThickness: .006, bevelSegments: 3, curveSegments: 24 })
  spineGeometry.translate(0, 0, -(H - .04) / 2)
  const spine = new THREE.Mesh(spineGeometry, cloth.binding('#383e4c'))
  spine.position.y = OPEN_COVER_Y; spine.castShadow = true; spine.receiveShadow = true; book.add(spine)
  const joint = new THREE.Mesh(new THREE.BoxGeometry(.012, .003, H - .10), cloth.binding('#373e4d'))
  joint.position.set(.072, .012, 0); cover.add(joint)
  const pageBlocks = []
  function surface(x) { const u = clamp(x / PW); return TOP + .055 * Math.sin(Math.PI * u ** .66) - .052 * Math.exp(-u * 15) }
  function sheetGeometry() {
    const g = new THREE.PlaneGeometry(PW, PH, 72, 20)
    g.rotateX(-Math.PI / 2); g.translate(PW / 2, 0, 0)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) p.setY(i, surface(p.getX(i)))
    g.computeVertexNormals(); return g
  }
  function pageBlock(parent, mirror = false) {
    const shape = new THREE.Shape(); shape.moveTo(.035, .035); shape.lineTo(PW, .035)
    for (let i = 60; i >= 0; i--) shape.lineTo(i / 60 * PW, surface(i / 60 * PW) - .006)
    shape.closePath()
    const geom = new THREE.ExtrudeGeometry(shape, { depth: PH, bevelEnabled: false, curveSegments: 12 })
    geom.translate(0, 0, -PH / 2)
    const group = new THREE.Group(); if (mirror) group.scale.y = -1
    const block = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color: '#e8e4db', roughness: 1 }))
    block.castShadow = true; block.receiveShadow = true; group.add(block)
    const page = new THREE.Mesh(sheetGeometry(), new THREE.MeshStandardMaterial({ map: paper, roughness: .99, side: THREE.DoubleSide }))
    page.castShadow = true; page.receiveShadow = true; group.add(page)
    const lineMat = new THREE.LineBasicMaterial({ color: '#aaa49c', transparent: true, opacity: .28 })
    const lines = []
    for (let layer = 1; layer < 26; layer++) {
      const points = []
      // Continuous head, fore-edge and foot lines retain the paper layers
      // from the oblique closed view as well as the open front view.
      for (let i = 0; i <= 60; i++) { const x = i / 60 * PW; points.push(new THREE.Vector3(x, 0, -PH / 2 - .001)) }
      points.push(new THREE.Vector3(PW + .001, 0, PH / 2 + .001))
      for (let i = 60; i >= 0; i--) points.push(new THREE.Vector3(i / 60 * PW, 0, PH / 2 + .001))
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMat)
      lines.push({ line, fraction: layer / 26 }); group.add(line)
    }
    pageBlocks.push({ block, page, lines, original: geom.attributes.position.array.slice() })
    parent.add(group)
    return group
  }
  pageBlock(book)
  const leftPages = pageBlock(cover, true)
  leftPages.position.y = OPEN_COVER_Y
  let previousOpen = NaN
  function shapePageBlocks(open) {
    if (open === previousOpen) return
    previousOpen = open
    for (const { block, page, lines, original } of pageBlocks) {
      const bp = block.geometry.attributes.position
      for (let i = 0; i < bp.count; i++) {
        const x = original[i * 3], y = original[i * 3 + 1]
        const fraction = clamp((y - .035) / (surface(x) - .006 - .035))
        bp.setY(i, lerp(.035, lerp(CLOSED_SURFACE, surface(x), open) - .006, fraction))
      }
      bp.needsUpdate = true; block.geometry.computeVertexNormals()
      const pp = page.geometry.attributes.position
      for (let i = 0; i < pp.count; i++) pp.setY(i, lerp(CLOSED_SURFACE, surface(pp.getX(i)), open))
      pp.needsUpdate = true; page.geometry.computeVertexNormals()
      for (const { line, fraction } of lines) {
        const lp = line.geometry.attributes.position
        for (let i = 0; i < lp.count; i++) lp.setY(i, lerp(.035, lerp(CLOSED_SURFACE, surface(lp.getX(i)), open) - .008, fraction))
        lp.needsUpdate = true
      }
    }
  }
  // Ink follows the same curved sheet as the paper, not the screen plane.
  const titleMeasure = document.createElement('canvas').getContext('2d')
  const titleFontFamily = 'Georgia, "Times New Roman", serif'
  titleMeasure.font = `400 250px ${titleFontFamily}`
  const widestTitle = Math.max(...chapters.map(chapter => titleMeasure.measureText(chapter.title).width))
  const titleFontSize = Math.floor(Math.min(250, 250 * 1536 * .8 / widestTitle) * .8)
  const titleMaps = chapters.map(chapter => ctex(1536, 2048, (g, w, h) => {
    g.fillStyle = '#343434'; g.textAlign = 'center'; g.textBaseline = 'middle'
    g.globalAlpha = .68
    g.font = `400 ${Math.round(titleFontSize * .9)}px ${titleFontFamily}`
    g.fillText('“', w / 2, h * .405)
    g.fillText('”', w / 2, h * .675)
    g.font = `400 ${titleFontSize}px ${titleFontFamily}`
    g.fillText(chapter.title, w / 2, h * .525)
  }))
  const titleGeometry = sheetGeometry()
  const titleUV = titleGeometry.attributes.uv
  for (let i = 0; i < titleUV.count; i++) titleUV.setX(i, 1 - titleUV.getX(i))
  const titleMaterial = new THREE.MeshStandardMaterial({
    map: titleMaps[0], transparent: true, opacity: 0, roughness: 1,
    side: THREE.DoubleSide, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
  })
  const printedTitle = new THREE.Mesh(titleGeometry, titleMaterial)
  printedTitle.position.y = .002; printedTitle.receiveShadow = true; leftPages.add(printedTitle)
  const turnPage = new THREE.Mesh(sheetGeometry(), new THREE.MeshStandardMaterial({ map: paper, roughness: .98, side: THREE.DoubleSide }))
  turnPage.castShadow = true; turnPage.receiveShadow = true; book.add(turnPage)
  const turnReference = turnPage.geometry.attributes.position.array.slice()
  // Only the foot tail is exposed. Its inner end sits between the pages;
  // it clears the board's edge, then rests just above the ground.
  const ribbonShape = new THREE.PlaneGeometry(.085, .66, 4, 36)
  ribbonShape.rotateX(-Math.PI / 2)
  const rp = ribbonShape.attributes.position
  for (let i = 0; i < rp.count; i++) {
    const z = rp.getZ(i) + 2.33
    const drape = range(z, 2.12, 2.59)
    rp.setXYZ(i, rp.getX(i) + .018 + .026 * drape, lerp(.042, ground.position.y + .004, drape), z)
  }
  ribbonShape.computeVertexNormals()
  const ribbonMaterial = cloth.binding('#92928d')
  ribbonMaterial.side = THREE.DoubleSide; ribbonMaterial.bumpScale = .004
  const ribbon = new THREE.Mesh(ribbonShape, ribbonMaterial)
  ribbon.castShadow = true; ribbon.receiveShadow = true; book.add(ribbon)
  const floorY = surface(1.6) + .008
  const localClip = new THREE.Plane(new THREE.Vector3(0, 1, 0), -floorY), worldClip = localClip.clone()
  const clippingPlanes = [worldClip]
  const miniature = new THREE.Group(); book.add(miniature)
  miniature.position.x = -.24
  const pad = new THREE.Group(); miniature.add(pad)
  const radius = 1.19, padH = .065
  const padMat = color => new THREE.MeshStandardMaterial({ color, roughness: 1, clippingPlanes, clipShadows: true })
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, padH, 96), [padMat('#d0cbc1'), padMat('#e3ded4'), padMat('#cec8bc')])
  disc.castShadow = true; disc.receiveShadow = true; pad.add(disc)
  const tileGrid = new THREE.Group(); pad.add(tileGrid)
  const floorMaps = new Map()
  let displayedFloor = -1
  for (let v = -.9; v <= .91; v += .3) for (const rotate of [false, true]) {
    const chord = Math.sqrt((radius - .015) ** 2 - v ** 2)
    const line = new THREE.Mesh(new THREE.BoxGeometry(chord * 2, .001, .007), padMat('#c4bfb4'))
    line.position.set(rotate ? v : 0, padH / 2 + .002, rotate ? 0 : v)
    if (rotate) line.rotation.y = Math.PI / 2
    line.receiveShadow = true; tileGrid.add(line)
  }
  async function clayTexture(name) {
    const img = new Image(); img.src = `${base}${name}.png`; await img.decode()
    const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0)
    const pixels = g.getImageData(0, 0, c.width, c.height).data
    let minX = c.width, minY = c.height, maxX = 0, maxY = 0
    for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (pixels[(y * c.width + x) * 4 + 3] > 12) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y)
    }
    const w = maxX - minX + 5, h = maxY - minY + 5
    const map = ctex(w, h, ctx => ctx.drawImage(img, minX - 2, minY - 2, w, h, 0, 0, w, h))
    return { map, aspect: w / h }
  }
  const layout = chapters.flatMap((chapter, chapterIndex) => chapter.objects.map(object => ({ ...object, chapterIndex })))
  const props = []
  let raf = 0, time = 0, playing = !reduced && !testing, target = DURATION, speed = 1, skipHolds = false
  let loopPlayback = !reduced && !testing
  let queuedChapter = null
  let previousNow = performance.now(), lastReport = -1, stateKey = ''
  const width = () => container.clientWidth || 1280
  const height = () => container.clientHeight || 800
  function resize() { renderer.setSize(width(), height()); camera.aspect = width() / height(); camera.updateProjectionMatrix(); needsRender = true }
  function frame(t) {
    const chapterIndex = chapterAt(t), chapter = chapters[chapterIndex]
    const start = chapterStart(chapterIndex), age = t - start
    const hasNext = chapterIndex < chapters.length - 1 || loopPlayback
    const exitStart = start + CHAPTER_LENGTH - .65
    const exit = hasNext ? range(t, exitStart, start + CHAPTER_LENGTH - .06) : 0
    const open = range(t, 1.35, 3.65), turn = range(age, 0, .85)
    cover.rotation.z = Math.PI * open; cover.position.y = lerp(CLOSED_COVER_Y, OPEN_COVER_Y, open)
    contactShadow.update(open)
    spine.scale.y = lerp(1, .22, open)
    shapePageBlocks(open)
    book.rotation.y = lerp(-.20, 0, open)
    const targetX = lerp(W / 2, 0, open)
    const desktopFit = lerp(1, .87, clamp((height() - 460) / 120))
    const fit = Math.max(desktopFit, 1.18 / camera.aspect)
    const openingArc = Math.sin(Math.PI * open)
    const cameraDistance = fit * (1 + .23 * openingArc)
    // Final camera is exactly centered on the spine: no yaw or asymmetric tilt.
    camera.position.set(targetX, lerp(9.5, 3.15, open) * cameraDistance, lerp(7.0, 10.2, open) * cameraDistance)
    camera.lookAt(targetX, lerp(.16, 1.0, open) + .6 * openingArc, 0)
    book.updateMatrixWorld(true); worldClip.copy(localClip).applyMatrix4(book.matrixWorld)
    const p = turnPage.geometry.attributes.position
    const angle = Math.PI * turn
    for (let i = 0; i < p.count; i++) {
      const x = turnReference[i * 3], z = turnReference[i * 3 + 2], u = x / PW
      p.setXYZ(i, x * Math.cos(angle), surface(x) + .014 + x * Math.sin(angle) + .20 * Math.sin(Math.PI * u) * Math.sin(angle), z)
    }
    p.needsUpdate = true; turnPage.geometry.computeVertexNormals()
    turnPage.visible = age >= 0 && age < .86
    const padRise = range(age, .86, 1.25) * (1 - exit)
    pad.visible = padRise > 0
    pad.position.set(1.63, floorY + padH / 2 - (1 - padRise) * .12, .03)
    if (displayedFloor !== chapterIndex) {
      displayedFloor = chapterIndex
      disc.material[0].color.set(chapter.edge)
      disc.material[1].map = floorMaps.get(chapter.floor) || null
      disc.material[1].color.set(chapter.floor ? '#ffffff' : '#e3ded4')
      disc.material[1].needsUpdate = true
      tileGrid.visible = !chapter.floor
    }
    for (const prop of props) {
      const rise = range(age, .9 + prop.delay, 1.9 + prop.delay) * (1 - exit)
      prop.rise = prop.chapterIndex === chapterIndex ? rise : 0
      prop.group.visible = prop.chapterIndex === chapterIndex && rise > 0
      prop.group.position.set(prop.x, floorY + padH + (prop.y || 0) - (1 - rise) * (prop.height + (prop.y || 0) + .15), prop.z)
      // Saved mesh coordinates keep feet, furniture and silhouettes anchored.
      // Motion follows the same clock as the pages, so pause freezes both.
      prop.motion?.apply(age, reduced || prop.chapterIndex !== chapterIndex ? 0 : range(age, 2.46, 2.95) * (1 - exit))
    }
    titleMaterial.map = titleMaps[chapterIndex]
    titleMaterial.opacity = range(age, .86, 1.45) * (1 - exit)
    printedTitle.visible = titleMaterial.opacity > 0
    renderer.render(scene, camera)
    // Anchor the bubble to the illustrated person's head in screen space.
    // It stays upright while the page title keeps the paper's perspective.
    const speaker = props.find(prop => prop.name === chapter.speaker.object)
    if (speaker) {
      const head = new THREE.Vector3(speaker.x + chapter.speaker.x, floorY + padH + speaker.height * chapter.speaker.y, speaker.z)
      miniature.localToWorld(head); head.project(camera)
      const x = (head.x + 1) * width() / 2, y = (1 - head.y) * height() / 2
      const bubbleWidth = width() <= 700 ? 140 : 178
      const gap = width() <= 700 ? 26 : 42
      const bx = Math.max(bubbleWidth + 16, x - gap)
      container.style.setProperty('--book-bubble-x', `${bx}px`)
      container.style.setProperty('--book-bubble-y', `${y + 5}px`)
      container.dataset.bubbleSide = 'left'
    }
    renderedTime = t; needsRender = false
  }
  function report(force = false) {
    const chapterIndex = chapterAt(time)
    const manualTurn = playing && skipHolds && Math.abs(target - time) > .001
    const hasNext = chapterIndex < chapters.length - 1 || loopPlayback
    const bubbleVisible = !manualTurn && time >= chapterSettled(chapterIndex) && (!hasNext || time < chapterStart(chapterIndex + 1) - .85)
    const next = { stage: stageAt(time), theme: chapters[chapterIndex].title, chapterIndex, selectedChapter: queuedChapter ?? chapterIndex, hasChapter: time >= FIRST_PAGE || queuedChapter !== null, lastPage: chapterIndex === chapters.length - 1, playing, bubbleVisible, time: +time.toFixed(2) }
    const key = `${next.stage}:${chapterIndex}:${queuedChapter}:${playing}:${bubbleVisible}:${Math.round(time * 4)}`
    if (force || key !== stateKey) { stateKey = key; onState(next) }
  }
  function advance(destination) {
    queuedChapter = null
    loopPlayback = false; needsRender = true
    target = destination; speed = 1.5; skipHolds = true
    if (reduced) { time = destination; playing = false; frame(time); report(true); return }
    playing = true; report(true)
  }
  function pause() { playing = false; report(true) }
  function selectChapter(index) {
    if (!Number.isInteger(index) || index < 0 || index >= chapters.length) return
    loopPlayback = false; needsRender = true
    if (reduced) { advance(chapterSettled(index)); return }
    if (time < FIRST_PAGE) {
      // Preserve the cover opening, then go straight to the chosen page.
      queuedChapter = index; target = FIRST_PAGE; speed = 1.5; skipHolds = false
      time = Math.max(time, 1.35); playing = true; report(true); return
    }
    const sameChapter = index === chapterAt(time)
    if (sameChapter && time >= chapterSettled(index)) {
      time = chapterSettled(index); target = time; frame(time); pause(); return
    }
    if (!sameChapter) time = chapterStart(index)
    advance(chapterSettled(index)); frame(time)
  }
  function next() {
    if (queuedChapter !== null) { playing = true; report(true); return }
    const destination = nextStop(time)
    if (destination === 0) return selectChapter(0)
    if (time < 1.35) time = 1.35
    advance(destination)
  }
  function previous() { advance(previousStop(time)) }
  function replay() { queuedChapter = null; skipHolds = false; time = 0; target = DURATION; speed = 1; playing = !reduced; loopPlayback = !reduced; frame(time); report(true) }
  function toggle() {
    if (reduced && !playing) return next()
    if (!playing && queuedChapter === null) {
      if (time >= DURATION) time = FIRST_PAGE
      target = DURATION; skipHolds = false; loopPlayback = !reduced; needsRender = true
    }
    playing = !playing; report(true)
  }
  let wheelAt = 0, touchY = null
  function wheel(event) {
    if (event.ctrlKey) return
    if (Math.abs(event.deltaY) < 3) return
    event.preventDefault()
    if (performance.now() - wheelAt < 160) return
    wheelAt = performance.now()
    if (event.deltaY < 0) previous()
    else { if (!playing || target < time) next(); speed = 2.8 }
  }
  function key(event) {
    if (event.target.closest('button, a, input')) return
    if (['ArrowRight', 'ArrowDown', ' '].includes(event.key)) { event.preventDefault(); event.key === ' ' ? toggle() : next() }
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) { event.preventDefault(); previous() }
  }
  function pointerDown(event) { touchY = event.clientY }
  function pointerUp(event) { if (touchY === null) return; const delta = touchY - event.clientY; touchY = null; if (Math.abs(delta) > 35) delta > 0 ? next() : previous(); else next() }
  const observer = new ResizeObserver(resize); observer.observe(container); resize(); frame(0)
  function dispose() {
    if (disposed) return; disposed = true
    cancelAnimationFrame(raf); observer.disconnect()
    container.removeEventListener('wheel', wheel); container.removeEventListener('pointerdown', pointerDown); container.removeEventListener('pointerup', pointerUp); window.removeEventListener('keydown', key)
    const geometries = new Set(), materials = new Set()
    scene.traverse(o => { if (o.geometry) geometries.add(o.geometry); if (o.material) for (const m of Array.isArray(o.material) ? o.material : [o.material]) materials.add(m); if (o.customDepthMaterial) materials.add(o.customDepthMaterial) })
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose())
    renderer.dispose(); renderer.domElement.remove()
    if (window.bookStoryPreview?.canvas === renderer.domElement) delete window.bookStoryPreview
  }
  try {
    const coverTexture = await new THREE.TextureLoader().loadAsync(`${base}cover-ahwon-v17.png`)
    if (disposed) { coverTexture.dispose(); return { dispose } }
    coverTexture.colorSpace = THREE.SRGBColorSpace
    coverTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8)
    textures.add(coverTexture); coverMaterial.map = coverTexture
    textures.add(cloth.emboss(coverTexture.image)); coverMaterial.needsUpdate = true
    await Promise.all(chapters.filter(chapter => chapter.floor).map(async chapter => {
      const texture = await new THREE.TextureLoader().loadAsync(`/images/painted-motion/floors-v1/${chapter.floor}.webp`)
      if (disposed) { texture.dispose(); return }
      texture.colorSpace = THREE.SRGBColorSpace; textures.add(texture); floorMaps.set(chapter.floor, texture)
    }))
    await Promise.all(layout.map(async spec => {
      const art = await clayTexture(spec.name)
      if (disposed) { art.map.dispose(); return }
      const h = Math.min(spec.height, spec.width / art.aspect)
      const geom = new THREE.PlaneGeometry(h * art.aspect, h, 40, 60); geom.translate(0, h / 2, 0)
      const mat = new THREE.MeshBasicMaterial({ map: art.map, toneMapped: false, transparent: true, alphaTest: .04, side: THREE.DoubleSide, clippingPlanes, clipShadows: true })
      const mesh = new THREE.Mesh(geom, mat); mesh.castShadow = true
      mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ map: art.map, alphaTest: .04, depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide, clippingPlanes, clipShadows: true })
      const motion = createActorMotion(mesh, spec.name, h * art.aspect, h)
      const group = new THREE.Group(); group.add(mesh); miniature.add(group); props.push({ ...spec, group, height: h, motion })
    }))
  } catch (error) { dispose(); throw error }
  needsRender = true; displayedFloor = -1
  container.addEventListener('wheel', wheel, { passive: false }); container.addEventListener('pointerdown', pointerDown); container.addEventListener('pointerup', pointerUp); window.addEventListener('keydown', key)
  const api = { next, previous, replay, toggle, pause, selectChapter, dispose }
  if (testing) window.bookStoryPreview = {
    canvas: renderer.domElement, ready: true, frame: t => { time = Math.max(0, Math.min(DURATION, t)); frame(time); report(true) },
    diagnostics: () => ({ time, playing, loopPlayback, target, stage: stageAt(time), theme: chapters[chapterAt(time)].title, chapterIndex: chapterAt(time), printedTitle: { onPage: printedTitle.parent === leftPages, opacity: titleMaterial.opacity, visible: printedTitle.visible }, bookYaw: book.rotation.y, camera: camera.position.toArray(), assets: props.map(p => p.name), visibleProps: props.filter(p => p.group.visible).map(p => ({ name: p.name, rise: p.rise })), duration: DURATION }),
    materialDiagnostics: () => ({ coverSaturation: coverMaterial.userData.saturation, roughness: coverMaterial.roughness, bumpScale: coverMaterial.bumpScale, sheen: coverMaterial.sheen, letteringRelief: coverMaterial.userData.letteringRelief, insideInk: '#343434', ribbon: { minZ: Math.min(...Array.from({ length: rp.count }, (_, i) => rp.getZ(i))), maxZ: Math.max(...Array.from({ length: rp.count }, (_, i) => rp.getZ(i))), minY: Math.min(...Array.from({ length: rp.count }, (_, i) => rp.getY(i))), groundY: ground.position.y, receivesShadow: ribbon.receiveShadow } }),
    motionDiagnostics: () => props.filter(p => p.group.visible && p.motion).map(p => ({ name: p.name, ...p.motion.measure() })),
    shadowDiagnostics: () => contactShadow.diagnostics(),
    ...api,
  }
  previousNow = performance.now(); report(true)
  function tick(now) {
    if (disposed) return
    const dt = Math.min((now - previousNow) / 1000, .05); previousNow = now
    if (playing && document.visibilityState !== 'hidden') {
      const direction = Math.sign(target - time)
      if (skipHolds && time >= FIRST_PAGE) {
        const index = chapterAt(time)
        if (direction > 0 && target > chapterStart(index + 1) && time >= chapterSettled(index)) {
          time = Math.max(time, chapterStart(index + 1) - .65)
        }
        if (direction < 0 && time > chapterSettled(index)) time = Math.max(target, chapterSettled(index))
      }
      const amount = Math.min(Math.abs(target - time), dt * speed)
      time += amount * direction
      if (Math.abs(target - time) < .001) {
        if (queuedChapter !== null) {
          const index = queuedChapter; queuedChapter = null
          time = chapterStart(index); target = chapterSettled(index); skipHolds = true
          report(true)
        } else if (loopPlayback && !reduced && target === DURATION) {
          // The last scene has retracted: turn straight into Coffee on the
          // already-open book, without replaying the cover or camera intro.
          time = FIRST_PAGE; skipHolds = false
          report(true)
        } else playing = false
      }
      speed = lerp(speed, 1, dt * .6)
    }
    if (document.visibilityState !== 'hidden' && (needsRender || time !== renderedTime)) frame(time)
    if (now - lastReport > 120) { report(); lastReport = now }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return api
}
