import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import walkSrc from '../media/Firefly A young woman walks in place, facing the camera directly. A small white Bichon Frise stands .mp4'
import workImg from '../img/landing-work.png'
import meImg from '../img/landing-me.png'

/*
 * Pseudo-3D walking scene, rendered with D3.
 *
 * World space is metres: x = left/right, y = up from the ground, z = depth
 * away from the camera. Everything on screen goes through project(), a
 * pinhole projection, so one time-driven progress value runs the whole scene:
 *
 *   - the camera dollies forward along +z  → the floor texture streams past
 *   - the girl walks toward the camera     → her z shrinks 58m → 5.8m
 *   - two cards float in at the end of the walk, out of the horizon
 *
 * The backdrop is deliberately empty: a white-to-grey gradient, with movement
 * only in the floor. The girl and her two dogs are the source video — each
 * frame is drawn into a canvas, the white studio background is flood-filled
 * away, and the canvas is scaled by the same projection as everything else.
 */

/* ── World constants ──────────────────────────────────────────────────────── */

const CAM_H       = 0.34   // camera height, metres — down at the dogs' level,
                           // so the grey floor starts around their ears
const CAM_TRAVEL  = 16     // how far the camera dollies over the walk
const GIRL_Z_NEAR = 5.8
const GIRL_Z_FAR  = 7.2

const START_HOLD  = 900    // ms of stillness before she sets off
const WALK_MS     = 30000  // ms from the far end of the path to the cards

/* Where the three of them sit inside the 1280×720 video frame, plus margin. */
const CROP = { sx: 380, sy: 24, sw: 520, sh: 684 }
const CHAR_H = 1.78        // world height of that crop, metres
/* Keying resolution — matched to the crop's aspect and kept just above the
   biggest size the canvas is ever drawn at, so each frame stays cheap. */
const KEY_W = 308, KEY_H = 405

const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v)

/* ── Floating cards ───────────────────────────────────────────────────────── */

/* A round photo bubble with a caption band across its lower half. Each card
   carries its own radius in metres, so the band is sized as a fraction of it. */
const BAND_TOP_F = 0.30   // band's top edge, as a fraction of r below the centre
const BAND_H_F   = 0.50
const CARD_FIXED_Z = 8    // the cards hold this depth — they float, they don't approach

/* Centre height, metres. The cards sit further back than the girl ends up
   (CARD_FIXED_Z vs GIRL_Z_NEAR), so equal world heights do NOT project to the
   same place on screen — a fixed CARD_Y left them riding high above her. Solve
   for the height whose projected centre matches the centre of her crop once
   she has walked in:  (CAM_H - CARD_Y)/CARD_FIXED_Z = (CAM_H - CHAR_H/2)/GIRL_Z_NEAR  */
const CARD_Y = CAM_H - (CARD_FIXED_Z * (CAM_H - CHAR_H / 2)) / GIRL_Z_NEAR

/* Screen-space offsets, applied after projection so they stay pixel-exact
   regardless of the card's depth. */
const CARD_RISE = 50   // px the cards sit above the girl's projected centre
const CARD_BOB  = 6    // px amplitude of the idle float
const CARD_LIFT = 10   // px of extra rise while hovered or focused

/* Entrance: each bubble fades and floats up into place, one after the other. */
const CARD_IN_AT   = 8500   // ms — when the first one starts
const CARD_IN_MS   = 1400   // ms — how long each takes
const CARD_IN_RISE = 18     // px it travels up while arriving

/* Colours and type, declared before CARDS because the cards refer to them.
   The caption band and the tail share one solid fill so the tail reads as a
   continuation of the bubble rather than a shape stuck onto it. */
const BUBBLE_INK   = '#1B211A'
const BUBBLE_GREEN = '#2E4A2C'   // fill for text-only bubbles; ~9.9:1 with white
const LABEL_SIZE   = 0.095       // one type size across every bubble
const TAIL_W = 0.12   // width where the tail meets the bubble's edge
const TAIL_H = 0.10   // how far it reaches past that edge

/* `x` is metres either side of centre; `r` is the bubble's radius in metres.
   The girl's crop is ~1.35 m wide, so keeping `x - r` above ~0.7 leaves her
   path clear — and because she is drawn in front of the bubbles, grazing them
   reads as depth rather than collision.
   `dy` pushes a bubble down the screen in px, `delay` staggers its entrance,
   and `ph` offsets its float so the three never bob in lockstep. */
const CARDS = [
  { label: 'My work',  href: '/work',  x: -1.45, r: 0.68, dy:  25, delay:    0, ph: 0,   img: workImg },
  { label: 'About me', href: '/about', x:  1.08, r: 0.52, dy: -50, delay:  900, ph: 2.1, img: meImg },
  /* Tucked below and right of About me, and last to arrive. `solid` makes it
     text-only, and `external` keeps the click on the anchor's own behaviour so
     it opens in a new tab rather than routing away from the walk — /resume then
     logs the pageview and hands off to the PDF. Label matches the header nav. */
  { label: 'Résumé',   href: '/resume',
    x: 1.68, r: 0.26, dy:  60, delay: 1800, ph: 4.0, solid: BUBBLE_GREEN, external: true },
]

function drawCard(g, d, i) {
  const sel = d3.select(g)
  const cy = -CARD_Y            // circle centre in local coords
  const R  = d.r
  const clipId = `w3d-card-clip-${i}`

  /* The tail leans back toward the girl walking between the two bubbles. */
  const inner = d.x < 0 ? 1 : -1
  const bx    = inner * R * 0.42
  const ink   = d.solid || BUBBLE_INK   // tail matches whatever the bubble is

  /* Meet the circle where it actually curves: the tip springs from the edge
     directly below bx, while the base is tucked inside the arc at its widest
     point, so no corner of it can peek out from behind the circle. */
  const edgeAt = x => Math.sqrt(Math.max(0, R ** 2 - x ** 2))
  const tipY   = cy + edgeAt(bx) + TAIL_H
  const baseY  = cy + edgeAt(Math.abs(bx) + TAIL_W / 2) - 0.02

  const body = sel.append('g').attr('class', 'w3d-body')

  body.append('clipPath').attr('id', clipId)
    .append('circle').attr('cx', 0).attr('cy', cy).attr('r', R)

  /* Tail first — the circle is drawn over its base, so the join never shows.
     The round linejoin softens the point without needing a curve. */
  body.append('path')
    .attr('d', `M ${bx - TAIL_W / 2} ${baseY} `
             + `L ${bx + TAIL_W / 2} ${baseY} `
             + `L ${bx + inner * TAIL_W * 0.7} ${tipY} Z`)
    .attr('fill', ink)
    .attr('stroke', ink)
    .attr('stroke-width', 0.02)
    .attr('stroke-linejoin', 'round')

  /* Text-only bubble: one filled circle with the label centred in it — no
     photo, no caption band, but the same type size as its neighbours. */
  if (d.solid) {
    body.append('circle')
      .attr('cx', 0).attr('cy', cy).attr('r', R)
      .attr('fill', d.solid)
    body.append('text')
      .attr('x', 0).attr('y', cy + LABEL_SIZE * 0.35)   // optical centre
      .attr('text-anchor', 'middle')
      .attr('font-size', LABEL_SIZE)
      .attr('font-weight', 700)
      .attr('letter-spacing', 0.004)
      .attr('fill', '#ffffff')
      .text(d.label)
    return
  }

  body.append('circle')
    .attr('cx', 0).attr('cy', cy).attr('r', R)
    .attr('fill', 'rgba(255,255,255,.95)')
  body.append('image')
    .attr('href', d.img)
    .attr('x', -R).attr('y', cy - R)
    .attr('width', R * 2).attr('height', R * 2)
    .attr('preserveAspectRatio', 'xMidYMid slice')
    .attr('clip-path', `url(#${clipId})`)

  /* Caption band, clipped to the circle so it reads as a lens across it.
     Sat above the bottom of the arc, where the chord is still wide enough
     to hold the label comfortably. */
  const bandH   = R * BAND_H_F
  const bandTop = cy + R * BAND_TOP_F
  body.append('rect')
    .attr('x', -R).attr('y', bandTop)
    .attr('width', R * 2).attr('height', bandH)
    .attr('fill', BUBBLE_INK)
    .attr('clip-path', `url(#${clipId})`)
  body.append('text')
    .attr('x', 0).attr('y', bandTop + bandH * 0.62)
    .attr('text-anchor', 'middle')
    .attr('font-size', LABEL_SIZE)
    .attr('font-weight', 700)
    .attr('letter-spacing', 0.004)
    .attr('fill', '#ffffff')
    .text(d.label)
}

/* ── Component ────────────────────────────────────────────────────────────── */

export default function WalkScene3D({ progress, onNavigate }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const svg = d3.select(host).append('svg')
      .attr('width', '100%').attr('height', '100%')
      .attr('role', 'img')
      .attr('aria-label',
        'A girl and her two dogs walking toward you, among three floating speech bubbles')
      .style('display', 'block')

    /* Gradients */
    const defs = svg.append('defs')
    const sky = defs.append('linearGradient').attr('id', 'w3d-sky')
      .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
    sky.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff')
    sky.append('stop').attr('offset', '70%').attr('stop-color', '#fafbfa')
    sky.append('stop').attr('offset', '100%').attr('stop-color', '#f1f3f1')
    const ground = defs.append('linearGradient').attr('id', 'w3d-ground')
      .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
    ground.append('stop').attr('offset', '0%').attr('stop-color', '#eef0ee')
    ground.append('stop').attr('offset', '100%').attr('stop-color', '#d9dcd9')
    /* Hover shadow for the cards. Its blur is in world metres, so it scales
       with the card instead of growing coarse. */
    const cardShadow = defs.append('filter').attr('id', 'w3d-card-shadow')
      .attr('x', '-40%').attr('y', '-40%').attr('width', '180%').attr('height', '180%')
    cardShadow.append('feDropShadow')
      .attr('dx', 0).attr('dy', 0.05).attr('stdDeviation', 0.06)
      .attr('flood-color', '#2a2e2a').attr('flood-opacity', 0.45)

    const haze = defs.append('linearGradient').attr('id', 'w3d-haze')
      .attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
    haze.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(255,255,255,0)')
    haze.append('stop').attr('offset', '50%').attr('stop-color', 'rgba(252,253,252,.9)')
    haze.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(255,255,255,0)')

    /* Layers, back to front */
    const skyRect    = svg.append('rect').attr('fill', 'url(#w3d-sky)')
    const groundRect = svg.append('rect').attr('fill', 'url(#w3d-ground)')
    const gCards     = svg.append('g')
    const charShadow = svg.append('ellipse').attr('fill', 'rgba(60,64,60,.16)')
    const hazeRect   = svg.append('rect').attr('fill', 'url(#w3d-haze)')
                          .attr('pointer-events', 'none')

    /* ── The walkers: source video → keyed canvas ─────────────────────────── */
    const video = d3.select(host).append('video')
      .attr('src', walkSrc)
      .attr('muted', '').attr('loop', '').attr('playsinline', '')
      .attr('preload', 'auto').attr('aria-hidden', 'true')
      .style('position', 'absolute').style('width', '2px').style('height', '2px')
      .style('opacity', 0).style('pointer-events', 'none')
      .node()
    video.muted = true
    video.playsInline = true
    if (!reduce) video.play().catch(() => {})

    const canvas = d3.select(host).append('canvas')
      .attr('width', KEY_W).attr('height', KEY_H)
      .attr('aria-hidden', 'true')
      .style('position', 'absolute').style('pointer-events', 'none')
      .node()
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    /* Flood-fill the studio white away from the frame border, so the white
       dog — enclosed by its own outline — keeps its coat.
     *
     * Video compression softens that outline, and one soft pixel is enough for
     * the fill to leak in and dissolve the Bichon. So the fill runs on a mask
     * eroded by SEAL px: any pale channel narrower than 2·SEAL is closed off,
     * which shuts every gap compression opens. The result is dilated back by
     * the same amount afterwards, so the silhouette keeps its true edge. */
    const SEAL = 3
    const N = KEY_W * KEY_H
    const pale = new Uint8Array(N)
    const solid = new Uint8Array(N)
    const blocked = new Uint8Array(N)
    const isBg = new Uint8Array(N)
    const bgWide = new Uint8Array(N)
    const spread = new Uint8Array(N)
    const stack = new Int32Array(N)

    /* Square dilation, done separably (rows then columns) to stay linear. */
    function dilate(src, dst, r) {
      for (let y = 0, i = 0; y < KEY_H; y++, i += KEY_W) {
        let dist = r + 1
        for (let x = 0; x < KEY_W; x++) {
          dist = src[i + x] ? 0 : dist + 1
          spread[i + x] = dist <= r ? 1 : 0
        }
        dist = r + 1
        for (let x = KEY_W - 1; x >= 0; x--) {
          dist = src[i + x] ? 0 : dist + 1
          if (dist <= r) spread[i + x] = 1
        }
      }
      for (let x = 0; x < KEY_W; x++) {
        let dist = r + 1
        for (let y = 0, i = x; y < KEY_H; y++, i += KEY_W) {
          dist = spread[i] ? 0 : dist + 1
          dst[i] = dist <= r ? 1 : 0
        }
        dist = r + 1
        for (let y = KEY_H - 1, i = x + (KEY_H - 1) * KEY_W; y >= 0; y--, i -= KEY_W) {
          dist = spread[i] ? 0 : dist + 1
          if (dist <= r) dst[i] = 1
        }
      }
    }

    function keyFrame() {
      ctx.drawImage(video, CROP.sx, CROP.sy, CROP.sw, CROP.sh, 0, 0, KEY_W, KEY_H)
      const img = ctx.getImageData(0, 0, KEY_W, KEY_H)
      const d = img.data

      for (let i = 0, j = 0; i < N; i++, j += 4) {
        const r = d[j], g = d[j + 1], b = d[j + 2]
        const mn = r < g ? (r < b ? r : b) : (g < b ? g : b)
        const mx = r > g ? (r > b ? r : b) : (g > b ? g : b)
        /* Pale + neutral: the white backdrop and its soft grey contact shadows,
           never the skin, coats or boots, which all carry colour. */
        const p = mn > 198 && mx - mn < 30 ? 1 : 0
        pale[i] = p
        solid[i] = p ? 0 : 1
        isBg[i] = 0
      }

      /* Grow the ink outward by SEAL, so hairline gaps in it close up. */
      dilate(solid, blocked, SEAL)

      let sp = 0
      const push = i => {
        if (pale[i] && !blocked[i] && !isBg[i]) { isBg[i] = 1; stack[sp++] = i }
      }
      for (let x = 0; x < KEY_W; x++) { push(x); push((KEY_H - 1) * KEY_W + x) }
      for (let y = 0; y < KEY_H; y++) { push(y * KEY_W); push(y * KEY_W + KEY_W - 1) }
      while (sp > 0) {
        const i = stack[--sp]
        const x = i % KEY_W
        if (x > 0) push(i - 1)
        if (x < KEY_W - 1) push(i + 1)
        if (i >= KEY_W) push(i - KEY_W)
        if (i < N - KEY_W) push(i + KEY_W)
      }

      /* Hand back the pale border the seal ate — but only pale pixels, so the
         subject's own edge survives. */
      dilate(isBg, bgWide, SEAL + 1)

      for (let i = 0, j = 3; i < N; i++, j += 4) if (bgWide[i] && pale[i]) d[j] = 0
      ctx.putImageData(img, 0, 0)
    }

    /* Only key when the video actually hands us a new frame. */
    let frameReq = null
    if (video.requestVideoFrameCallback) {
      const onFrame = () => {
        keyFrame()
        frameReq = video.requestVideoFrameCallback(onFrame)
      }
      frameReq = video.requestVideoFrameCallback(onFrame)
    } else {
      video.addEventListener('timeupdate', keyFrame)
    }
    video.addEventListener('loadeddata', keyFrame)

    /* Floating cards */
    const cardSel = gCards.selectAll('a').data(CARDS).join('a')
      .attr('class', 'w3d-bubble-link')
      .attr('href', d => d.href)
      .attr('aria-label', d => (d.external ? `${d.label} (opens a PDF in a new tab)` : d.label))
      .attr('target', d => (d.external ? '_blank' : null))
      .attr('rel', d => (d.external ? 'noopener noreferrer' : null))
      .style('cursor', 'pointer')
      .on('mouseenter focus', (e, d) => { d.hover = true })
      .on('mouseleave blur', (e, d) => { d.hover = false })
      /* Keep it a real link, but route in-app when it's a plain left click.
         External targets fall through to the browser so the PDF opens. */
      .on('click', (e, d) => {
        if (!onNavigate || d.external || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        onNavigate(d.href)
      })
    cardSel.each(function (d, i) { drawCard(this, d, i) })

    /* ── Sizing + projection ──────────────────────────────────────────────── */
    let W = 0, H = 0, horizonY = 0, F = 0

    function resize() {
      W = host.clientWidth
      H = host.clientHeight
      horizonY = H * 0.72
      F = Math.min(W * 0.9, H * 1.6)
      svg.attr('viewBox', `0 0 ${W} ${H}`)
      skyRect.attr('x', 0).attr('y', 0).attr('width', W).attr('height', horizonY + 2)
      groundRect.attr('x', 0).attr('y', horizonY).attr('width', W).attr('height', H - horizonY)
      hazeRect.attr('x', 0).attr('y', horizonY - H * 0.07)
        .attr('width', W).attr('height', H * 0.16)
    }

    const px = (x, z) => W / 2 + (F * x) / z
    const py = (y, z) => horizonY + (F * (CAM_H - y)) / z
    const scaleAt = z => F / z

    /* ── Frame ────────────────────────────────────────────────────────────── */
    function render(elapsed) {
      /* One timeline: hold, walk in, arrive. No scrolling involved. */
      const u = clamp01((elapsed - START_HOLD) / WALK_MS)
      const p = reduce ? 1 : u   // linear: one steady pace, start to finish
      progress?.set(p)

      const camZ = p * CAM_TRAVEL
      const t = elapsed

      /* Cards — they hold their depth from five seconds on, and float in place:
         a slow bob, plus a small extra rise while hovered. */
      const cardZ = CARD_FIXED_Z
      const cs = scaleAt(cardZ)

      /* Per card: ease the hover lift so it never snaps, and advance its own
         entrance — `delay` is what makes them arrive one after the other. */
      cardSel.each(d => {
        d.lift = (d.lift ?? 0) + ((d.hover ? 1 : 0) - (d.lift ?? 0)) * 0.12
        d.on   = reduce ? 1 : clamp01((elapsed - CARD_IN_AT - d.delay) / CARD_IN_MS)
      })

      cardSel
        .attr('transform', d => {
          const bob = reduce ? 0 : Math.sin(t * 0.0011 + d.ph) * CARD_BOB
          /* `dy` sits this bubble lower; the last term floats it up as it fades in. */
          const rise = CARD_RISE - d.dy + CARD_LIFT * d.lift - bob
                     - (1 - d.on) * CARD_IN_RISE
          return `translate(${px(d.x, cardZ)},${py(0, cardZ) - rise}) `
               + `scale(${cs * (1 + 0.025 * d.lift)})`
        })
        .attr('opacity', d => d.on)
        .attr('display', d => (d.on <= 0.001 ? 'none' : null))

      /* Shadow deepens as the card lifts, so the two read as one movement. */
      cardSel.select('.w3d-body')
        .attr('filter', d => (d.lift > 0.02 ? 'url(#w3d-card-shadow)' : null))

      /* The girl and her dogs — one video, placed by the same projection */
      const gz = GIRL_Z_FAR + (GIRL_Z_NEAR - GIRL_Z_FAR) * p   // metres per second, flat
      const s = scaleAt(gz)
      const sway = Math.sin(t * 0.0005) * 0.05
      const hpx = CHAR_H * s
      const wpx = hpx * (CROP.sw / CROP.sh)
      const cx = px(sway, gz)
      const base = py(0, gz)

      canvas.style.width = `${wpx}px`
      canvas.style.height = `${hpx}px`
      canvas.style.left = `${cx - wpx / 2}px`
      canvas.style.top = `${base - hpx}px`
      canvas.style.opacity = clamp01(0.86 + (1 - gz / GIRL_Z_FAR) * 3)

      charShadow
        .attr('cx', cx).attr('cy', base - hpx * 0.012)
        .attr('rx', wpx * 0.34).attr('ry', wpx * 0.038)
        .attr('opacity', 0.16 * clamp01(1 - gz / GIRL_Z_FAR + 0.25))

      /* Publish where her feet meet the floor. Chrome outside the scene — the
         skip control — sits relative to this. The foot line is a projection of
         CAM_H against her depth, so it lands anywhere from 74% to 81% of the
         viewport depending on aspect; a hard-coded percentage would only be
         right on one screen. */
      document.documentElement.style.setProperty('--walk-feet-y', `${base}px`)
    }

    /* ── Boot ─────────────────────────────────────────────────────────────── */
    resize()

    const timer = d3.timer(render)

    const ro = new ResizeObserver(() => { resize() })
    ro.observe(host)

    return () => {
      timer.stop()
      ro.disconnect()
      if (frameReq && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frameReq)
      video.removeEventListener('timeupdate', keyFrame)
      video.removeEventListener('loadeddata', keyFrame)
      video.pause()
      video.remove()
      canvas.remove()
      svg.remove()
      document.documentElement.style.removeProperty('--walk-feet-y')
    }
  }, [progress, onNavigate])

  return <div ref={hostRef} className="absolute inset-0" />
}
