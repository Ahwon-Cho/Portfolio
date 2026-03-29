import { useEffect, useRef } from 'react'

const N = 3000

// Timing
const WIND_INTRO    = 8    // seconds of wind before first shape
const FORM_DURATION = 5.0  // long enough to see every dot travel to its spot
const HOLD_DURATION = 5    // seconds to hold / rotate
const BREAK_DURATION= 4.0  // long enough to see dots scatter
const WIND_BREAK    = 3    // seconds of free wind between shapes

// Spring constants  [stiffness, damping]
// Low stiffness = slow visible travel; higher damping = smooth, not bouncy
const SPR_WIND   = [2.2,  0.87]
const SPR_FORM   = [1.8,  0.83]   // gentle pull → long visible journey to shape
const SPR_HOLD   = [5.0,  0.78]   // firmer once settled
const SPR_BREAK  = [1.2,  0.88]   // slow drift outward

// Pearl palette
const PEARL_DARK  = ['#FFFFFF','#F0F0FF','#E0E8FF','#D8D8F8','#C8C8F0','#E8F0FF','#F8F8FF']
const PEARL_LIGHT = ['#888899','#9090A8','#7878A0','#A0A0B8','#6868A0','#9898B0','#B0B0C8']

function proj(wx, wy, wz, W, H, F) {
  const d = Math.max(F * 0.06, F + wz)
  const s = F / d
  return { sx: W * 0.5 + wx * s, sy: H * 0.72 - wy * s, s }
}

function rotate(wx, wy, wz, rX, rY) {
  const cy = Math.cos(rY), sy = Math.sin(rY)
  const cx = Math.cos(rX), sx = Math.sin(rX)
  const x1 = wx * cy + wz * sy
  const z1 = -wx * sy + wz * cy
  return { x: x1, y: wy * cx - z1 * sx, z: wy * sx + z1 * cx }
}

function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t }

function hexToRgba(hex, a) {
  return `rgba(${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)},${a.toFixed(3)})`
}

function lerpColor(from, to, t, alpha) {
  const fr=parseInt(from.slice(1,3),16), fg=parseInt(from.slice(3,5),16), fb=parseInt(from.slice(5,7),16)
  const tr=parseInt(to.slice(1,3),16),   tg=parseInt(to.slice(3,5),16),   tb=parseInt(to.slice(5,7),16)
  return `rgba(${Math.round(fr+(tr-fr)*t)},${Math.round(fg+(tg-fg)*t)},${Math.round(fb+(tb-fb)*t)},${Math.min(1,alpha).toFixed(3)})`
}

function buildFromChar(char, W, H, colors) {
  const S = Math.min(W, H)
  const sz = Math.round(S * 0.50), pad = Math.round(S * 0.12)
  const cw = sz + pad * 2, ch = sz + pad * 2
  const oc = document.createElement('canvas')
  oc.width = cw; oc.height = ch
  const octx = oc.getContext('2d')
  octx.fillStyle = '#fff'
  octx.font = `900 ${sz}px Georgia,"Times New Roman",serif`
  octx.textAlign = 'center'; octx.textBaseline = 'middle'
  octx.fillText(char, cw * 0.5, ch * 0.5)
  const img = octx.getImageData(0, 0, cw, ch)
  const cands = []
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++)
      if (img.data[(y * cw + x) * 4 + 3] > 80)
        cands.push({ x: x - cw * 0.5, y: ch * 0.5 - y })
  if (!cands.length) return []
  const depth = S * 0.08
  return Array.from({ length: N }, () => {
    const c   = cands[Math.floor(Math.random() * cands.length)]
    const col = colors[Math.floor(Math.random() * colors.length)]
    return {
      wx: c.x + (Math.random() - 0.5) * 2,
      wy: c.y + (Math.random() - 0.5) * 2,
      wz: (Math.random() - 0.5) * depth,
      color: col, layer: Math.random(),
      twinkleSpeed: 0.8 + Math.random() * 3.5,
      twinklePhase: Math.random() * Math.PI * 2,
      isSpark: Math.random() < 0.12,
    }
  })
}

export default function ParticleCanvas({ darkMode = false }) {
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const st = {
      // phase: 'wind' | 'forming' | 'holding' | 'breaking' | 'wind-break'
      phase: 'wind', phaseTimer: 0,
      mouse: { x: 0.5, y: 0.5 },
      drag: { active: false, lastX: 0, lastY: 0, vx: 0, vy: 0 },
      rotX: 0.25, rotY: 0,
      shapeIdx: 0,            // which shape is target: 0=?, 1=!
      particles: [], shapes: null,
      raf: null, t: 0, lastTime: null,
      W: 0, H: 0, darkMode,
    }
    stateRef.current = st

    // ── Wind target for a particle ──────────────────────────────────────────
    function windTarget(p, windT) {
      const tx = p.ox
        + Math.sin(windT * p.speed  + p.phase)  * p.amp
        + Math.sin(windT * p.speed2 + p.phase2) * p.amp2
      const ty = p.oy
        + Math.cos(windT * p.speed  * 0.7 + p.phaseY) * p.ampY
        + Math.cos(windT * p.speed2 * 0.5 + p.phase2) * p.ampY2
      return { tx, ty }
    }

    // ── 3D shape target for a particle ─────────────────────────────────────
    function shapeTarget(p, idx, rotX, rotY, W, H, F) {
      const tgt = st.shapes[idx][p.shapeI]
      const r   = rotate(tgt.wx, tgt.wy, tgt.wz, rotX, rotY)
      const { sx, sy } = proj(r.x, r.y, r.z, W, H, F)
      return { tx: sx, ty: sy, tgt }
    }

    // ── Init ────────────────────────────────────────────────────────────────
    function init() {
      const W = canvas.width, H = canvas.height
      st.W = W; st.H = H
      const pal = st.darkMode ? PEARL_DARK : PEARL_LIGHT
      st.shapes = [buildFromChar('?', W, H, pal), buildFromChar('!', W, H, pal)]

      st.particles = Array.from({ length: N }, (_, i) => {
        const ox = Math.random() * W
        const oy = Math.random() * H
        return {
          ox, oy,
          x: ox, y: oy,     // current screen position — ALWAYS STORED
          vx: 0, vy: 0,     // velocity
          shapeI: i,        // index into shape point array
          // wave params
          phase:  Math.random() * Math.PI * 2,
          phaseY: Math.random() * Math.PI * 2,
          phase2: Math.random() * Math.PI * 2,
          speed:  0.2 + Math.random() * 0.6,
          speed2: 0.05 + Math.random() * 0.12,
          amp:    35 + Math.random() * 80,
          ampY:   18 + Math.random() * 45,
          amp2:   15 + Math.random() * 40,
          ampY2:  8  + Math.random() * 25,
          // visual
          baseSize:  0.6 + Math.random() * 1.8,
          baseAlpha: 0.12 + Math.random() * 0.38,
          layer: Math.random(),
          twinkleSpeed: 0.8 + Math.random() * 3.5,
          twinklePhase: Math.random() * Math.PI * 2,
          isSpark: Math.random() < 0.10,
          color: '#ccc',
          shapeColor: '#ccc',
        }
      })

      st.phase = 'wind'; st.phaseTimer = 0
      st.shapeIdx = 0; st.t = 0
      st.rotX = 0.25; st.rotY = 0
      st.drag.vx = 0; st.drag.vy = 0
    }

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }

    // ── Input ───────────────────────────────────────────────────────────────
    function onMouseMove(e) {
      st.mouse.x = e.clientX / canvas.width
      st.mouse.y = e.clientY / canvas.height
      if (st.drag.active) {
        const dx = e.clientX - st.drag.lastX, dy = e.clientY - st.drag.lastY
        st.drag.vx = dx * 0.012; st.drag.vy = dy * 0.008
        st.rotY += dx * 0.008
        st.rotX  = Math.max(-1.2, Math.min(1.2, st.rotX + dy * 0.005))
        st.drag.lastX = e.clientX; st.drag.lastY = e.clientY
      }
    }
    function onMouseDown(e) {
      st.drag.active = true; st.drag.lastX = e.clientX; st.drag.lastY = e.clientY
      st.drag.vx = 0; st.drag.vy = 0
    }
    function onMouseUp() { st.drag.active = false }
    function onTouchMove(e) {
      if (!e.touches.length) return
      const tx = e.touches[0].clientX, ty = e.touches[0].clientY
      st.mouse.x = tx / canvas.width; st.mouse.y = ty / canvas.height
      if (st.drag.active) {
        const dx = tx - st.drag.lastX, dy = ty - st.drag.lastY
        st.drag.vx = dx * 0.012; st.drag.vy = dy * 0.008
        st.rotY += dx * 0.008
        st.rotX  = Math.max(-1.2, Math.min(1.2, st.rotX + dy * 0.005))
        st.drag.lastX = tx; st.drag.lastY = ty
      }
    }
    function onTouchStart(e) {
      if (!e.touches.length) return
      st.drag.active = true; st.drag.lastX = e.touches[0].clientX; st.drag.lastY = e.touches[0].clientY
      st.drag.vx = 0; st.drag.vy = 0
    }
    function onTouchEnd() { st.drag.active = false }

    // ── Draw loop ────────────────────────────────────────────────────────────
    function draw(now) {
      st.raf = requestAnimationFrame(draw)
      const dt = st.lastTime ? Math.min((now - st.lastTime) / 1000, 0.05) : 0.016
      st.lastTime = now
      st.t += dt; st.phaseTimer += dt

      const { W, H } = st
      const F       = Math.min(W, H) * 1.8
      const windT   = st.t * 0.42

      ctx.clearRect(0, 0, W, H)

      // ── Phase transitions ─────────────────────────────────────────────────
      if (st.phase === 'wind'      && st.phaseTimer > WIND_INTRO)    { st.phase = 'forming';    st.phaseTimer = 0 }
      if (st.phase === 'forming'   && st.phaseTimer > FORM_DURATION) { st.phase = 'holding';    st.phaseTimer = 0 }
      if (st.phase === 'holding'   && st.phaseTimer > HOLD_DURATION) { st.phase = 'breaking';   st.phaseTimer = 0 }
      if (st.phase === 'breaking'  && st.phaseTimer > BREAK_DURATION){ st.phase = 'wind-break'; st.phaseTimer = 0 }
      if (st.phase === 'wind-break'&& st.phaseTimer > WIND_BREAK)    {
        st.shapeIdx = (st.shapeIdx + 1) % 2
        st.phase = 'forming'; st.phaseTimer = 0
        // Assign fresh color from shape to each particle
        st.particles.forEach(p => { p.shapeColor = st.shapes[st.shapeIdx][p.shapeI].color })
      }

      // ── Rotation ──────────────────────────────────────────────────────────
      const inShape = st.phase === 'forming' || st.phase === 'holding'
      if (inShape || st.phase === 'breaking') {
        if (st.drag.active) {
          st.drag.vx *= 0.85; st.drag.vy *= 0.85
        } else if (Math.abs(st.drag.vx) > 0.0008 || Math.abs(st.drag.vy) > 0.0008) {
          st.rotY += st.drag.vx; st.rotX += st.drag.vy
          st.drag.vx *= 0.93;   st.drag.vy *= 0.93
        } else {
          st.drag.vx = 0; st.drag.vy = 0
          if (st.phase === 'holding') {
            st.rotY += dt * 0.16    // slow constant spin
            st.rotX += (0.20 - st.rotX) * dt * 0.6
          } else {
            const tY = (st.mouse.x - 0.5) * Math.PI * 0.7
            const tX = 0.18 + (st.mouse.y - 0.5) * 0.3
            st.rotY += (tY - st.rotY) * dt * 1.4
            st.rotX += (tX - st.rotX) * dt * 1.4
          }
        }
        st.rotX = Math.max(-1.2, Math.min(1.2, st.rotX))
      }

      // ── Per-particle update + draw ─────────────────────────────────────────
      const ph = st.phase

      // During forming, stiffness gradually increases so dots visibly travel
      // first, then lock into position near the end
      let k, damp
      if (ph === 'forming') {
        const progress = Math.min(1, st.phaseTimer / FORM_DURATION)
        k    = SPR_FORM[0] + (SPR_HOLD[0] - SPR_FORM[0]) * Math.pow(progress, 2)
        damp = SPR_FORM[1] + (SPR_HOLD[1] - SPR_FORM[1]) * progress
      } else if (ph === 'holding') {
        ;[k, damp] = SPR_HOLD
      } else if (ph === 'breaking') {
        ;[k, damp] = SPR_BREAK
      } else {
        ;[k, damp] = SPR_WIND
      }

      const dampFactor = Math.pow(damp, dt * 60)
      const windC  = st.darkMode ? '215,215,228' : '125,125,148'

      st.particles.forEach(p => {
        // ── Compute target ──────────────────────────────────────────────────
        let tx, ty, targetColor, targetScale = 1

        if (ph === 'wind' || ph === 'wind-break' || ph === 'breaking') {
          const w = windTarget(p, windT)
          // Mouse repulsion during wind phases
          const pdx  = w.tx - st.mouse.x * W
          const pdy  = w.ty - st.mouse.y * H
          const dist = Math.sqrt(pdx * pdx + pdy * pdy)
          const rep  = ph !== 'breaking' ? Math.max(0, 1 - dist / 150) * 75 : 0
          tx = w.tx + (pdx / (dist + 1)) * rep
          ty = w.ty + (pdy / (dist + 1)) * rep
          targetColor = null  // use wind color
        } else {
          // forming or holding — spring toward 3D shape position
          const tgt = st.shapes[st.shapeIdx][p.shapeI]
          const r   = rotate(tgt.wx, tgt.wy, tgt.wz, st.rotX, st.rotY)
          const prj = proj(r.x, r.y, r.z, W, H, F)
          tx = prj.sx; ty = prj.sy
          targetColor = tgt.color
          targetScale = prj.s
        }

        // ── Spring integration ──────────────────────────────────────────────
        p.vx += (tx - p.x) * k * dt
        p.vy += (ty - p.y) * k * dt
        p.vx *= dampFactor
        p.vy *= dampFactor
        p.x  += p.vx * dt * 60
        p.y  += p.vy * dt * 60

        // ── Twinkle ─────────────────────────────────────────────────────────
        const twinkle    = 0.5 + 0.5 * Math.sin(st.t * p.twinkleSpeed + p.twinklePhase)
        const sparkBoost = p.isSpark ? (0.3 + twinkle * 1.8) : twinkle

        // ── Draw ─────────────────────────────────────────────────────────────
        const drawX = p.x, drawY = p.y
        if (drawX < -60 || drawX > W + 60 || drawY < -60 || drawY > H + 60) return

        let drawSize, drawColor

        if (ph === 'wind' || ph === 'wind-break') {
          drawSize  = p.baseSize * (0.5 + sparkBoost * 0.7)
          const a   = p.baseAlpha * (0.35 + sparkBoost * 0.55)
          drawColor = `rgba(${windC},${Math.min(1, a).toFixed(3)})`

        } else if (ph === 'breaking') {
          // Lerp color from shape to wind as they scatter
          const fade = Math.min(1, st.phaseTimer / BREAK_DURATION)
          const sc   = p.shapeColor || '#cccccc'
          const wHex = st.darkMode ? '#D7D7E4' : '#7D7D94'
          drawSize  = p.baseSize * (0.5 + sparkBoost * 0.7)
          drawColor = lerpColor(sc, wHex, easeInOut(fade),
                        p.baseAlpha * (0.35 + sparkBoost * 0.55))

        } else {
          // forming / holding
          // inProg only controls color crossfade, NOT alpha — dots stay visible throughout
          const inProg = ph === 'forming' ? Math.min(1, st.phaseTimer / FORM_DURATION) : 1
          const sc     = targetColor || '#ffffff'
          const wHex   = st.darkMode ? '#D7D7E4' : '#7D7D94'

          // Alpha stays at wind-equivalent level the whole time
          const a = p.isSpark
            ? Math.min(1, 0.4 + sparkBoost * 0.9)
            : (0.25 + p.layer * 0.38 + twinkle * 0.32)

          // Size: wind size during travel → pearl size once arrived
          const windSz  = p.baseSize * (0.5 + sparkBoost * 0.6)
          const pearlSz = Math.max(0.3, targetScale * (p.isSpark
            ? 1.5 + twinkle * 1.0
            : 1.1 + twinkle * 0.4))
          drawSize  = windSz + (pearlSz - windSz) * easeInOut(inProg)

          // Color: wind gray → pearl/silver as they arrive
          drawColor = lerpColor(wHex, sc, easeInOut(inProg), a)

          // Glow halo on bright sparks once they're near their target
          if (p.isSpark && twinkle > 0.72 && inProg > 0.4) {
            ctx.beginPath()
            ctx.arc(drawX, drawY, drawSize * 3.5, 0, Math.PI * 2)
            const grd = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, drawSize * 3.5)
            const gc  = st.darkMode ? '255,255,255' : '80,80,130'
            grd.addColorStop(0, `rgba(${gc},${(twinkle * 0.20 * inProg).toFixed(3)})`)
            grd.addColorStop(1, `rgba(${gc},0)`)
            ctx.fillStyle = grd
            ctx.fill()
          }
        }

        ctx.beginPath()
        ctx.arc(drawX, drawY, Math.max(0.2, drawSize), 0, Math.PI * 2)
        ctx.fillStyle = drawColor
        ctx.fill()
      })
    }

    // ── Register ─────────────────────────────────────────────────────────────
    window.addEventListener('resize',     resize)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mouseup',    onMouseUp)
    window.addEventListener('touchmove',  onTouchMove,  { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend',   onTouchEnd)

    resize()
    st.raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize',     resize)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mouseup',    onMouseUp)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend',   onTouchEnd)
      cancelAnimationFrame(st.raf)
    }
  }, [])

  useEffect(() => {
    if (stateRef.current) stateRef.current.darkMode = darkMode
  }, [darkMode])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}
