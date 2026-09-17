import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PaintedBackdrop from '../components/PaintedBackdrop'
import InkLayerScenes from '../components/InkLayerScenes'
import { AHWON_MARK, MARK_WRITING_STROKES, getMarkPoint } from '../data/ahwonMark'
import './PaintedMotion.css'

// Temporarily bypass the opening mark while reviewing the painted scenes.
// Keep its artwork and animation intact so it can be restored later.
const SHOW_OPENING_LOGO = false

// This route's bolder mark keeps the original 3D version untouched.
const PAINTED_MARK = {
  ...AHWON_MARK,
  strokeWidth: 14,
  paths: AHWON_MARK.paths.map(path => path.closed ? { ...path, radius: 48 } : path),
}

function PersonalMark() {
  const point = ({ x, y }) => `${200 + x} ${200 - y}`
  return <svg className="painted-personal-mark" viewBox="0 0 400 400" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth={PAINTED_MARK.strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {PAINTED_MARK.paths.map((path, index) => {
        if (path.closed) return <circle key={index} cx="200" cy="200" r={path.radius} />
        const command = path.radius ? `A ${path.radius} ${path.radius} 0 ${path.end - path.start > 180 ? 1 : 0} 0` : 'L'
        return <path key={index} d={`M ${point(getMarkPoint(path, 0))} ${command} ${point(getMarkPoint(path, 1))}`} />
      })}
    </g>
  </svg>
}

const SCENES = [
  { id: 'coffee', name: 'Coffee', sentence: 'Coffee inspires me!', duration: 10000,
    description: 'Ahwon sitting behind a café table, lifting a red mug to drink coffee.' },
  { id: 'work', name: 'Work', sentence: 'I visualize early, fail fast, and make ideas clear.', duration: 12000,
    description: 'Ahwon sits in her chair, using a mouse at her desk with a laptop and monitor.' },
  { id: 'nature', name: 'Nature', sentence: 'Nature helps me solve problems.', duration: 13000,
    description: 'Ahwon relaxes in the breeze while her two seated dogs gently wag their tails on the grass.' },
  { id: 'garden', name: 'Growing', sentence: 'Watching things grow brings me peace.', duration: 11000,
    description: 'Ahwon standing and watering tomatoes and zucchini in pots.' },
]
const wrap = (index) => (index % SCENES.length + SCENES.length) % SCENES.length

function Arrow({ back = false }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={back ? { transform: 'rotate(180deg)' } : undefined}>
    <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

// Pressure changes the contour, never the ink's opacity. These ribbons follow
// the existing Korean-name paths, preserving every ring, opening and connector.
function brushRibbon(path, from, to, seed) {
  const left = []
  const right = []
  for (let index = 0; index <= 160; index++) {
    const t = index / 160
    const progress = from + (to - from) * t
    const p = getMarkPoint(path, progress)
    const a = getMarkPoint(path, progress - .001)
    const b = getMarkPoint(path, progress + .001)
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
    const normal = { x: -(b.y - a.y) / length, y: (b.x - a.x) / length }
    const pressure = (4.6 + 1.8 * Math.sin(Math.PI * t) + .7 * Math.sin(t * 19 + seed)) * PAINTED_MARK.strokeWidth / AHWON_MARK.strokeWidth
    const bristle = .48 * Math.sin(index * 1.91 + seed) + .3 * Math.sin(index * .71)
    const point = (width) => `${(200 + p.x + normal.x * width).toFixed(3)} ${(200 - p.y - normal.y * width).toFixed(3)}`
    left.push(point(pressure + bristle))
    right.push(point(-pressure + bristle * .7))
  }
  return `M ${left.join(' L ')} L ${right.reverse().join(' L ')} Z`
}

function OpeningMark() {
  const point = ({ x, y }) => `${200 + x} ${200 - y}`
  return <svg className="painted-opening-mark" viewBox="0 0 400 400" aria-hidden="true">
    <defs>
      {MARK_WRITING_STROKES.map((stroke, index) => {
        const path = PAINTED_MARK.paths[stroke.path]
        const points = Array.from({ length: 160 }, (_, i) => point(getMarkPoint(path, stroke.from + (stroke.to - stroke.from) * i / 159)))
        return <mask key={index} id={`painted-mark-write-${index}`} maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
          <path className="painted-mark-reveal" d={`M ${points.join(' L ')}`} pathLength="1" fill="none" stroke="white" strokeWidth="26" strokeLinecap="round"
            style={{ animationDelay: `${stroke.start}s`, animationDuration: `${stroke.end - stroke.start}s` }} />
        </mask>
      })}
    </defs>
    <g className="painted-mark-ink">
      {MARK_WRITING_STROKES.map((stroke, index) => {
        const path = PAINTED_MARK.paths[stroke.path]
        return <path key={index} d={brushRibbon(path, stroke.from, stroke.to, index)} mask={`url(#painted-mark-write-${index})`} />
      })}
    </g>
  </svg>
}

const FLOOR_SURFACES = {
  coffee: { image: '/images/painted-motion/floors-v1/coffee.webp', edge: '#d9d6d0' },
  work: { image: '/images/painted-motion/floors-v1/work.webp', edge: '#d3c4b0' },
  nature: { image: '/images/painted-motion/floors-v1/nature.webp', edge: '#adb69e' },
  garden: { image: '/images/painted-motion/floors-v1/garden.webp', edge: '#bc9480' },
}

function CircularBase({ arrived, theme, reducedMotion }) {
  const [displayed, setDisplayed] = useState(theme)
  const [loaded, setLoaded] = useState({})
  useEffect(() => {
    // Match the scene's 300ms exit; the pad itself stays fixed in place.
    const timer = window.setTimeout(() => setDisplayed(theme), reducedMotion || !arrived ? 0 : 300)
    return () => window.clearTimeout(timer)
  }, [theme, arrived, reducedMotion])
  return <div className="painted-foundation" data-arrived={arrived} data-floor-theme={displayed}
    style={{ '--pad-edge': FLOOR_SURFACES[displayed].edge }} aria-hidden="true">
    <svg className="painted-circular-base" viewBox="0 0 780 440">
      <defs><clipPath id="painted-floor-top"><ellipse cx="390" cy="352" rx="361" ry="69" /></clipPath></defs>
      <path className="painted-base-side" d="M 29 352 C 29 314 191 283 390 283 C 589 283 751 314 751 352 L 751 373 C 751 411 589 442 390 442 C 191 442 29 411 29 373 Z" />
      <ellipse className="painted-base-top" cx="390" cy="352" rx="361" ry="69" />
      <g clipPath="url(#painted-floor-top)">
        {Object.entries(FLOOR_SURFACES).map(([id, surface]) => <image key={id} className="painted-base-texture"
          href={surface.image} x="29" y="283" width="722" height="138" preserveAspectRatio="none"
          data-floor={id} data-active={id === displayed && Boolean(loaded[id])}
          onLoad={() => setLoaded(previous => previous[id] ? previous : { ...previous, [id]: true })} />)}
      </g>
      <ellipse className="painted-base-outline" cx="390" cy="352" rx="361" ry="69" />
    </svg>
  </div>
}

export default function PaintedMotionPage() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const navigate = useNavigate()
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const stepRef = useRef(0)
  const lockRef = useRef(0)
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible, setVisible] = useState(!document.hidden)
  const [ready, setReady] = useState(false)
  const [assetError, setAssetError] = useState(false)
  const [introDone, setIntroDone] = useState(!SHOW_OPENING_LOGO || Boolean(reducedMotion))
  const [settled, setSettled] = useState(false)
  const [focusPaused, setFocusPaused] = useState(false)
  const sceneReady = useCallback(() => setReady(true), [])
  const sceneError = useCallback(() => setAssetError(true), [])
  const sceneSettled = useCallback(() => setSettled(true), [])
  const scene = SCENES[wrap(step)]
  // Focus stops autoplay, not the selected theme's action.
  const motionRunning = playing && visible && !reducedMotion

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return undefined
    const placeBackdrop = () => {
      const floor = stage.querySelector('.painted-base-top')
      if (!floor) return
      const rootTop = root.getBoundingClientRect().top
      const height = floor.getBoundingClientRect().top - rootTop
      const pad = stage.querySelector('.painted-base-side') || floor
      root.style.setProperty('--painted-backdrop-floor', `${Math.max(0, height)}px`)
      root.style.setProperty('--painted-backdrop-pad-bottom', `${Math.max(0, pad.getBoundingClientRect().bottom - rootTop)}px`)
    }
    const observer = new ResizeObserver(placeBackdrop)
    observer.observe(root)
    observer.observe(stage)
    const frame = requestAnimationFrame(placeBackdrop)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reducedMotion) { setIntroDone(true); setPlaying(false); return undefined }
    if (!SHOW_OPENING_LOGO) { setIntroDone(true); return undefined }
    if (!ready) return undefined
    const timer = window.setTimeout(() => setIntroDone(true), 5800)
    return () => window.clearTimeout(timer)
  }, [ready, reducedMotion])

  const advance = useCallback((change, absolute = false) => {
    if (!ready || (!absolute && performance.now() < lockRef.current)) return
    const next = absolute ? stepRef.current + change - wrap(stepRef.current) : stepRef.current + change
    if (next === stepRef.current) return
    setDirection(next > stepRef.current ? 1 : -1)
    stepRef.current = next
    setStep(next)
    setSettled(false)
    setIntroDone(true)
    lockRef.current = performance.now() + (reducedMotion ? 180 : 1150)
  }, [ready, reducedMotion])

  useEffect(() => {
    if (!ready || !introDone || !settled || !motionRunning || focusPaused) return undefined
    const timer = window.setTimeout(() => advance(1), scene.duration)
    return () => window.clearTimeout(timer)
  }, [step, ready, introDone, settled, motionRunning, focusPaused, scene.duration, advance])

  useEffect(() => {
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return undefined
    let last = 0
    let distance = 0
    let handled = false
    const wheel = (event) => {
      // Only the picture is a carousel surface; the rest of the page scrolls
      // normally, including on small screens and when text is enlarged.
      if (!event.target.closest('.painted-stage') || event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      if (!ready) return
      event.preventDefault()
      const now = performance.now()
      if (now - last > 180) { distance = 0; handled = false }
      last = now
      if (handled) return
      distance += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? node.clientHeight : 1)
      if (Math.abs(distance) > 44) { handled = true; advance(distance > 0 ? 1 : -1) }
    }
    node.addEventListener('wheel', wheel, { passive: false })
    return () => node.removeEventListener('wheel', wheel)
  }, [advance, ready])

  const pointer = useRef({ x: 0, y: 0, swiped: false })
  const goToWork = () => {
    if (import.meta.env.DEV) {
      const destination = new URL('/work2', window.location.href)
      destination.port = '5175'
      window.location.assign(destination.href)
    } else navigate('/work')
  }
  const keyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); advance(1) }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); advance(-1) }
  }

  return <section ref={rootRef} className="painted-page" data-motion={motionRunning ? 'running' : 'paused'}
    data-ready={ready} data-intro={introDone} aria-label="An illustrated introduction to Ahwon Cho">
    <PaintedBackdrop theme={scene.id} visible={ready && introDone} reducedMotion={reducedMotion} />
    <header className="painted-header">
      <div className="painted-brand"><PersonalMark /><span>Ahwon Cho<small>UX + Visual Designer</small></span></div>
      <nav aria-label="Preview controls">
        <Link to="/">Original 3D</Link>
        <button type="button" disabled={Boolean(reducedMotion)}
          title={reducedMotion ? 'Motion is off to match your device’s reduced-motion setting.' : undefined}
          aria-label={reducedMotion ? 'Motion off: reduced-motion setting' : playing ? 'Pause all motion' : 'Play motion'} aria-pressed={!playing}
          onClick={() => { setPlaying(!playing); setFocusPaused(false); setIntroDone(true) }}>
          <svg viewBox="0 0 20 20" aria-hidden="true">{playing ? <path d="M5 4h3v12H5zm7 0h3v12h-3z" /> : <path d="m6 4 10 6-10 6z" />}</svg>
          {reducedMotion ? 'Motion off' : playing ? 'Pause' : 'Play'}
        </button>
      </nav>
    </header>

    <div className="painted-copy">
      <h1>UX designer.<br />Visual thinker.</h1>
      <p>I’m Ahwon. I make ideas tangible through visual design and hands-on prototyping.</p>
    </div>

    <div ref={stageRef} className="painted-stage"
      onPointerDown={(event) => { pointer.current = { x: event.clientX, y: event.clientY, swiped: false } }}
      onPointerUp={(event) => {
        const dx = event.clientX - pointer.current.x
        const dy = event.clientY - pointer.current.y
        if (Math.max(Math.abs(dx), Math.abs(dy)) > 45) {
          pointer.current.swiped = true
          advance(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : (dy < 0 ? 1 : -1))
        }
      }}>
      {!introDone && !assetError && <div className="painted-opening" data-ready={ready}><OpeningMark /></div>}
      {assetError && <p className="painted-error" role="alert">The illustrations couldn’t load. Please refresh, or skip to my work below.</p>}
      <span className="painted-scroll-guide" aria-hidden="true">
        <svg className="painted-scroll-cue" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1" />
          <path className="painted-scroll-cue-motion" d="M16 9v10m-4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Scroll to go faster</span>
      </span>
      <div className="painted-perspective">
        <CircularBase arrived={introDone} theme={scene.id} reducedMotion={reducedMotion} />
        <InkLayerScenes sceneStep={step} direction={direction} arrived={introDone && !assetError}
          running={motionRunning} reducedMotion={Boolean(reducedMotion)}
          onReady={sceneReady} onError={sceneError} onSettled={sceneSettled} />
      </div>
      {ready && introDone && <button className="painted-art-link" type="button" aria-label={`${scene.description} View Ahwon’s work.`}
        onKeyDown={keyDown} onFocus={(event) => { if (event.target.matches(':focus-visible')) setFocusPaused(true) }} onBlur={() => setFocusPaused(false)}
        onClick={(event) => { if (pointer.current.swiped && event.detail) { pointer.current.swiped = false; return }; goToWork() }} />}
      <div className={`painted-bubble painted-bubble--${scene.id}`} data-visible={ready && introDone && settled}
        aria-live={playing ? 'off' : 'polite'}><p>{scene.sentence}</p></div>
    </div>

    <footer className="painted-footer">
      <button className="painted-skip" type="button" onClick={goToWork}>Skip to work <Arrow /></button>
    </footer>
  </section>
}
