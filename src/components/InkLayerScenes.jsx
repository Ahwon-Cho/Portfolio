import { useEffect, useRef, useState } from 'react'
import './InkLayerScenes.css'

const ROOT = '/images/painted-motion/ink-motion-v4/'
const NAMES = ['coffee', 'work', 'nature', 'garden']
// Temporarily hidden by request; keep the original artwork and placement to restore.
const SHOW_PARK_HUSBAND = false
const wrap = (n) => (n % 4 + 4) % 4
const clamp = (n) => Math.max(0, Math.min(1, n))
const ease = (n) => { const x = clamp(n); return x * x * (3 - 2 * x) }
const rise = (t, a, b) => ease((t - a) / (b - a))
const gesture = (t, a, b, c, d) => rise(t, a, b) * (1 - rise(t, c, d))
const imageStyle = (clip, transform, origin) => ({ clipPath: clip, transform, transformOrigin: origin })

// Every object is an individual alpha cutout. The original ink pixels are not
// faded, recolored, or projected onto a 3D mesh. Only the articulated parts move.
function Art({ name, assets, style, className = '' }) {
  return <img className={`ink-layer-image ${className}`} src={`${ROOT}${assets[name].file}`} alt="" draggable="false" style={style} />
}

function ObjectLayer({ name, assets, x, floor = 356, height, z = 1, style, children, ...attributes }) {
  const width = height * assets[name].width / assets[name].height
  return <div className="ink-object" data-object={name} style={{ left: x - width / 2, top: floor - height, width, height, zIndex: z, ...style }} {...attributes}>
    {children || <Art name={name} assets={assets} />}
  </div>
}

function Person({ name, assets, x, height = 282, floor = 358, look = 0, nod = 0, breath = 0, z = 3, style }) {
  const headLine = name === 'coffee-person' ? 23.5 : 29
  return <ObjectLayer name={name} assets={assets} x={x} floor={floor} height={height} z={z} style={style}>
    <Art name={name} assets={assets} style={imageStyle(`inset(${headLine - .5}% 0 0)`, `scaleY(${1 + breath * .002})`, '50% 100%')} />
    <Art name={name} assets={assets} style={imageStyle(`inset(0 0 ${100 - headLine}%)`, `translate(${look * .7}px, ${nod}px) rotate(${look}deg)`, `51% ${headLine}%`)} />
  </ObjectLayer>
}

function Coffee({ assets, time }) {
  const sip = gesture(time % 10, 1.2, 3.0, 4.2, 6.4)
  const breath = Math.sin(time * 1.1)
  // Keep the cup between the original cupped hands. Head motion approaches
  // the rim; hands are composited in front of the mug, not painted onto it.
  const person = { name: 'coffee-person', assets, x: 385, floor: 361, height: 294, z: 3 }
  return <>
    <ObjectLayer name="chair" assets={assets} x={386} floor={354} height={224} />
    <Person {...person} look={sip * 1.8} nod={sip * 3.4} breath={breath} />
    <ObjectLayer name="table" assets={assets} x={385} floor={362} height={178} z={4} />
    <ObjectLayer name="coffee-palm" assets={assets} x={564} floor={358} height={250} z={3} />
    <ObjectLayer name="mug" assets={assets} x={385} floor={154 - sip * 2} height={30} z={5}
      style={{ transform: `rotate(${-sip * 4}deg)`, transformOrigin: '50% 75%' }} />
    <ObjectLayer {...person} z={6}>
      <Art name="coffee-person" assets={assets} style={imageStyle('polygon(31% 26%, 40% 25%, 46% 26%, 42% 29%, 37% 32%, 34% 36%, 28% 35%)')} />
      <Art name="coffee-person" assets={assets} style={imageStyle('polygon(56% 25%, 64% 25%, 68% 28%, 69% 35%, 65% 36%, 61% 31%, 56% 29%)')} />
    </ObjectLayer>
    <svg className="ink-effect" viewBox="0 0 780 440" style={{ zIndex: 7 }}>
      {[0, 1].map((n) => <path key={n} d={`M ${380 + n * 9} ${121 - sip * 2} q ${-3 + Math.sin(time * 1.3 + n) * 2} -6 0 -12 q 3 -5 1 -9`}
        fill="none" stroke="#918c80" strokeWidth=".9" strokeLinecap="round" opacity={.35 + Math.sin(time + n) * .08} />)}
    </svg>
  </>
}

function Work({ assets, time }) {
  const think = gesture(time, .7, 1.8, 2.6, 3.5)
  // The chair, connected arms and mouse grip are drawn as one coherent pose.
  // Separate workstation props sit around it; no detached hand/sleeve overlays.
  return <>
    <ObjectLayer name="desk" assets={assets} x={437} floor={370} height={200} z={2} />
    <ObjectLayer name="work-seated" assets={assets} x={339} floor={368} height={278} z={5}>
      <Art name="work-seated" assets={assets} style={imageStyle('inset(25% 0 0)')} />
      <Art name="work-seated" assets={assets} style={imageStyle('inset(0 0 74.5%)', `rotate(${think * -.6 + Math.sin(time * .85) * .15}deg)`, '56% 25%')} />
    </ObjectLayer>
    <ObjectLayer name="laptop" assets={assets} x={474} floor={221} height={62} z={6} />
    <ObjectLayer name="monitor" assets={assets} x={529} floor={205} height={126} z={7} />
    <ObjectLayer name="desk-plant" assets={assets} x={596} floor={205} height={80} z={7} />
    <svg className="ink-effect" viewBox="0 0 780 440" style={{ zIndex: 8, opacity: think }}>
      <g fill="none" stroke="#a5784d" strokeWidth="1.6" strokeLinecap="round">
        <path d="M337 89q-8-10 0-16q9-5 13 5q2 6-5 11v5h-8zM338 98h5" />
        <path d="m325 78-4-2m9-12-2-4m14 3 2-4m11 11 4-2" />
      </g>
    </svg>
  </>
}

// Masks follow the actual ink silhouettes; long ears stay with the head.
// A planted paw counters the body's travel, then lifts for its own swing.
const DOG_PARTS = {
  light: {
    legs: [
      '20 66 37 69 33 76 23 86 18 96 7 98 5 91 9 80',
      '32 73 44 73 44 82 49 91 48 99 36 99 31 93 29 83',
      '54 75 65 75 67 85 67 96 62 99 54 98 52 91 54 84',
      '64 66 76 69 82 78 93 89 93 97 84 100 73 96 66 88 62 76',
    ],
    tail: '0 6 20 5 29 21 24 37 22 49 13 54 2 47 0 23', origin: '21% 48%',
  },
  dark: {
    legs: [
      '19 63 33 64 30 75 24 85 15 94 6 94 7 86 12 75',
      '32 61 44 61 47 71 50 85 46 99 31 100 30 93 34 81 31 72',
      '60 68 72 69 76 80 71 93 61 98 54 97 57 91 62 84 60 76',
      '73 61 85 62 88 73 99 88 98 99 86 100 85 91 80 84 75 79 71 72',
    ],
    tail: '77 18 81 11 93 10 100 21 100 41 91 50 81 45 77 37 82 29', origin: '82% 43%',
  },
}
const clipPolygon = points => `polygon(${points.split(' ').reduce((pairs, value, index, all) => index % 2 ? pairs : [...pairs, `${value}% ${all[index + 1]}%`], []).join(', ')})`
const clipOutline = points => `M${points.split(' ').map(Number).map(n => n / 100).join(' ')}Z`

function WalkingDog({ color, assets, x, floor, height, time, start, end, moving, positionAt, cadence, wag, settle }) {
  const name = `dog-${color}-walk`
  const light = color === 'light'
  const parts = DOG_PARTS[color]
  const maskId = `ink-${color}-walk-torso`
  const direction = light ? 1 : -1
  const reach = Math.abs(positionAt(end) - positionAt(start)) / ((end - start) * cadence) * .31
  return <ObjectLayer name={name} assets={assets} x={x} floor={floor} height={height} z={7} data-gait={moving > .01 ? 'walking' : 'standing'}>
    <svg width="0" height="0" className="ink-cutout-definitions" aria-hidden="true"><defs>
      <clipPath id={maskId} clipPathUnits="objectBoundingBox">
        <path clipRule="evenodd" d={`M0 0H1V1H0Z ${[...parts.legs, parts.tail].map(clipOutline).join(' ')}`} />
      </clipPath>
    </defs></svg>
    {parts.legs.map((points, n) => {
      const offset = [0, .5, .25, .75][n]
      const cycle = Math.max(0, time - start) * cadence + offset
      const progress = cycle % 1
      const contactAt = start + (Math.floor(cycle) - offset) / cadence
      const liftedAt = contactAt + .62 / cadence
      const swing = clamp((progress - .62) / .38)
      const plantedX = positionAt(contactAt) - positionAt(time) + direction * reach
      const liftX = positionAt(contactAt) - positionAt(liftedAt) + direction * reach
      const localX = (progress < .62 ? plantedX : liftX + (direction * reach - liftX) * ease(swing)) * moving
      const localY = -Math.sin(Math.PI * swing) * (light ? 1.15 : .95) * moving
      return <Art key={n} name={name} assets={assets} style={imageStyle(clipPolygon(points), `translate(${localX}px, ${localY}px)`)} />
    })}
    <Art name={name} assets={assets} style={imageStyle(clipPolygon(parts.tail), `rotate(${wag * (light ? 2.7 : -2.1)}deg)`, parts.origin)} />
    <Art name={name} assets={assets} style={imageStyle(`url(#${maskId})`, `translateY(${settle * 1.3 - Math.sin((time - start) * cadence * Math.PI * 4) * .2 * moving}px)`)} />
  </ObjectLayer>
}

const SEATED_TAILS = {
  light: { points: '25 70 23 67 19 64 14 63 10 66 8 68 4 71 4 74 1 78 1 81 4 85 6 89 11 92 18 92 22 90 23 87 21 84 21 80 22 76', origin: '23% 87%' },
  dark: { points: '82 62 87 62 92 66 97 72 100 78 99 83 95 87 90 90 82 91 80 89 82 85 83 81 82 77 79 74 81 70 80 66', origin: '81% 88%' },
}

function Dog({ color, assets, time }) {
  const light = color === 'light'
  const x = light ? 217 : 576
  const name = `dog-${color}-sit`
  const tail = SEATED_TAILS[color]
  const maskId = `ink-${color}-seated-body`
  const beat = gesture((time + (light ? 0 : 2.2)) % (light ? 6.7 : 7.9), .4, 1.2, 3.2, 4.5)
  const wag = Math.sin(time * (light ? 3.8 : 3.15) + (light ? 0 : 1.7)) * beat * (light ? 7 : -5.4)
  // Both dogs remain seated on the same spots. Only isolated tails move.
  return <div data-dog={color} data-phase="sitting" data-x={x.toFixed(2)}>
    <ObjectLayer name={name} assets={assets} x={x} floor={light ? 378 : 363} height={light ? 96 : 108} z={7}>
      <svg width="0" height="0" className="ink-cutout-definitions" aria-hidden="true"><defs>
        <clipPath id={maskId} clipPathUnits="objectBoundingBox">
          <path clipRule="evenodd" d={`M0 0H1V1H0Z ${clipOutline(tail.points)}`} />
        </clipPath>
      </defs></svg>
      <Art name={name} assets={assets} className="ink-dog-tail" style={imageStyle(clipPolygon(tail.points), `rotate(${wag}deg)`, tail.origin)} />
      <Art name={name} assets={assets} className="ink-dog-still-body" style={imageStyle(`url(#${maskId})`)} />
    </ObjectLayer>
  </div>
}

const PARK_HAIR = [
  { points: '2 30 13 29 17 32 16 36 18 42 11 44 5 40 1 35', origin: '16% 30%' },
  { points: '91 29 97 29 100 32 98 36 93 39 90 37 92 33', origin: '93% 29%' },
]

function ParkFigure({ assets, time }) {
  const breathe = Math.sin(time * .65)
  return <ObjectLayer name="park-person" assets={assets} x={325} floor={370} height={281} z={3} data-park-pose="enjoying-breeze">
    <svg width="0" height="0" className="ink-cutout-definitions" aria-hidden="true"><defs>
      <clipPath id="ink-park-body" clipPathUnits="objectBoundingBox">
        <path clipRule="evenodd" d={`M0 .29H1V1H0Z ${PARK_HAIR.map(hair => clipOutline(hair.points)).join(' ')}`} />
      </clipPath>
    </defs></svg>
    <Art name="park-person" assets={assets} style={imageStyle('url(#ink-park-body)')} />
    <Art name="park-person" assets={assets} className="ink-park-breeze-head"
      style={imageStyle('inset(0 0 70.8%)', `translateY(${-0.25 - breathe * .2}px) rotate(${-0.5 + breathe * .35}deg)`, '51% 29%')} />
    {PARK_HAIR.map((hair, index) => <Art key={index} name="park-person" assets={assets} className="ink-park-breeze-hair"
      style={imageStyle(clipPolygon(hair.points), `rotate(${Math.sin(time * .65 + index * .7) * (index ? -.9 : 1.2)}deg)`, hair.origin)} />)}
  </ObjectLayer>
}

function Nature({ assets, time }) {
  return <>
    <ObjectLayer name="bench" assets={assets} x={391} floor={355} height={211} />
    <ParkFigure assets={assets} time={time} />
    {SHOW_PARK_HUSBAND && <Person name="husband" assets={assets} x={449} floor={369} height={288} look={0} breath={Math.sin(time * .65 + 1)} />}
    <Dog color="light" assets={assets} time={time} />
    <Dog color="dark" assets={assets} time={time} />
  </>
}

function Plant({ name, assets, x, floor, height, time, phase = 0 }) {
  // Anchor the pot. Only the foliage above the pot responds to a small breeze.
  const line = name === 'tomato-pot' ? 66 : 60
  return <ObjectLayer name={name} assets={assets} x={x} floor={floor} height={height} z={4}>
    <Art name={name} assets={assets} style={imageStyle(`inset(${line}% 0 0)`)} />
    <Art name={name} assets={assets} style={imageStyle(`inset(0 0 ${99 - line}%)`, `rotate(${Math.sin(time * .85 + phase) * .5}deg)`, `50% ${line}%`)} />
  </ObjectLayer>
}

function Garden({ assets, time }) {
  const pouring = gesture(time % 11, 1, 2.6, 5.7, 7.6)
  const angle = pouring * 17
  const can = { name: 'watering-can', assets, x: 398, floor: 253, height: 65, z: 5 }
  const width = can.height * assets['watering-can'].width / assets['watering-can'].height
  // The can pivots at its handle, immediately under the gripping hand.
  const pivot = { x: can.x - width / 2 + width * .21, y: can.floor - can.height + can.height * .04 }
  const theta = angle * Math.PI / 180
  const tip = { x: width * .73, y: can.height * .195 }
  const spout = { x: pivot.x + tip.x * Math.cos(theta) - tip.y * Math.sin(theta), y: pivot.y + tip.x * Math.sin(theta) + tip.y * Math.cos(theta) }
  return <>
    <Person name="garden-person" assets={assets} x={325} floor={362} height={303} look={pouring * 1.3} nod={pouring} breath={Math.sin(time * 1.1)} />
    <Plant name="tomato-pot" assets={assets} x={479} floor={366} height={186} time={time} />
    <Plant name="zucchini-pot" assets={assets} x={593} floor={363} height={154} time={time} phase={2} />
    <ObjectLayer {...can} style={{ transform: `rotate(${angle}deg)`, transformOrigin: '21% 4%' }} />
    <ObjectLayer name="garden-person" assets={assets} x={325} floor={362} height={303} z={6}>
      <Art name="garden-person" assets={assets} style={imageStyle('polygon(68% 39%, 97% 41%, 99% 47%, 80% 48%, 66% 44%)')} />
    </ObjectLayer>
    <svg className="ink-effect" viewBox="0 0 780 440" style={{ zIndex: 7 }}>
      {pouring > .25 && Array.from({ length: 16 }, (_, n) => {
        const progress = ((time * .72 + n / 16) % 1)
        const target = { x: 477 + Math.sin(n * 2.4) * 13, y: 310 }
        const x = spout.x + (target.x - spout.x) * progress
        const y = spout.y + (target.y - spout.y) * progress * progress
        return <path key={n} d={`M${x} ${y}l${(target.x - spout.x) * .025} 3.1`} stroke="#7a9297" strokeWidth="1.2" strokeLinecap="round" opacity={pouring * .72} />
      })}
    </svg>
  </>
}

const SCENES = [Coffee, Work, Nature, Garden]

export default function InkLayerScenes({ sceneStep, direction, arrived, running, reducedMotion, onReady, onError, onSettled }) {
  const [assets, setAssets] = useState(null)
  const [displayStep, setDisplayStep] = useState(sceneStep)
  const [phase, setPhase] = useState('loading')
  const [time, setTime] = useState(0)
  const clock = useRef(0)
  const shown = useRef(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      const response = await fetch(`${ROOT}manifest.json?v=work-seated-mouse-3`)
      if (!response.ok) throw new Error('Ink asset manifest did not load')
      const manifest = await response.json()
      await Promise.all(Object.values(manifest).map(async (item) => {
        const image = new Image()
        image.src = `${ROOT}${item.file}`
        await image.decode()
        if (!image.naturalWidth) throw new Error('Empty ink illustration')
      }))
      if (alive) { setAssets(manifest); onReady?.() }
    }
    load().catch((error) => { console.error('Ink scene loading:', error); if (alive) onError?.() })
    return () => { alive = false }
  }, [onReady, onError])

  useEffect(() => {
    if (!assets || !arrived) return undefined
    let incoming
    let complete
    const reset = () => { clock.current = 0; setTime(0); setDisplayStep(sceneStep); shown.current = sceneStep }
    if (reducedMotion) { reset(); setPhase('center'); onSettled?.(); return undefined }
    const enter = () => {
      reset()
      setPhase('enter')
      complete = window.setTimeout(() => { setPhase('center'); onSettled?.() }, 680)
    }
    if (shown.current === null) enter()
    else { setPhase('leave'); incoming = window.setTimeout(enter, 300) }
    return () => { window.clearTimeout(incoming); window.clearTimeout(complete) }
  }, [sceneStep, assets, arrived, reducedMotion, onSettled])

  useEffect(() => {
    if (!running || reducedMotion || phase !== 'center') return undefined
    let frame
    let previous = performance.now()
    let painted = previous
    const tick = (now) => {
      clock.current += Math.min((now - previous) / 1000, .08)
      previous = now
      if (now - painted > 32) { setTime(clock.current); painted = now }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [running, reducedMotion, phase])

  if (!assets || !arrived) return null
  const index = wrap(displayStep)
  const Scene = SCENES[index]
  const sceneTime = reducedMotion ? [0, 6, 10, 3.5][index] : time
  return <div className="ink-layer-scenes" aria-hidden="true" data-scene={NAMES[index]} data-phase={phase} data-motion-time={sceneTime.toFixed(3)}>
    <div key={displayStep} className="ink-scene-track" data-phase={phase} style={{ '--ink-direction': direction }}>
      <Scene assets={assets} time={sceneTime} />
    </div>
  </div>
}
