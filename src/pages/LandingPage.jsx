import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import WalkScene3D from '../components/WalkScene3D'
import MusicPlayer from '../components/MusicPlayer'

export default function LandingPage() {
  /* The scene owns its timeline and publishes walk progress here. */
  const walkProgress = useMotionValue(0)
  const navigate = useNavigate()
  const shouldReduce = useReducedMotion()

  return (
    <div className="relative h-screen overflow-hidden">
      {/* ── The 3D walk: girl + two dogs coming toward the camera ── */}
      <WalkScene3D progress={walkProgress} onNavigate={navigate} />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          opacity: 0.32,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          background:
            'radial-gradient(ellipse 88% 84% at 50% 50%, transparent 55%, rgba(70,72,68,.14) 100%)',
        }}
      />

      {/* ── Hero text — fixed size, stays put for the whole walk ── */}
      <div
        className="absolute inset-x-0 top-[20%] flex flex-col items-center text-center pointer-events-none select-none z-30"
      >
        {/* The three lines arrive in turn, two seconds apart. */}
        <h1
          className="text-4xl sm:text-6xl font-thin tracking-tight leading-[1.15]"
          /* A solid white outline, drawn as eight offset copies, so the thin
             strokes stay legible while the girl and the dogs walk up through
             the line. paint-order isn't reliable on HTML text, and
             -webkit-text-stroke eats into the glyph rather than sitting
             outside it — offsets are the technique that survives both. */
          style={{
            color: 'rgba(28,32,36,.92)',
            textShadow: [
              '3px 0 0 #fff', '-3px 0 0 #fff', '0 3px 0 #fff', '0 -3px 0 #fff',
              '2px 2px 0 #fff', '-2px 2px 0 #fff', '2px -2px 0 #fff', '-2px -2px 0 #fff',
              '0 0 16px rgba(255,255,255,.95)',
            ].join(', '),
          }}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          >
            Hi, I&rsquo;m Ahwon
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 2, ease: [0.22, 1, 0.36, 1] }}
            /* Picks up the green of her hoodie — the one strong colour in the scene */
            style={{ color: '#2f6b41' }}
          >
            UX / Visual Designer
          </motion.span>
        </h1>
        {/* Last of the three, arriving a word at a time. The words hold their
            place from the start, so the line never reflows as they land. */}
        <p
          className="mt-6 text-lg sm:text-2xl font-light tracking-[0.06em]"
          style={{ color: 'rgba(38,44,50,.82)' }}
        >
          {[
            { text: 'Curiosity', rise: true,  delay: 4.0 },
            { text: '·',    rise: false, delay: 5.0 },
            { text: 'Details',   rise: true,  delay: 5.5 },
            { text: '·',    rise: false, delay: 6.5 },
            { text: 'Craft',     rise: true,  delay: 7.0 },
          ].map((it, i) => (
            <motion.span
              key={i}
              className={it.rise ? 'inline-block' : 'inline-block mx-2'}
              initial={{ opacity: 0, y: it.rise ? 22 : 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: it.delay,
                duration: it.rise ? 1.2 : 0.4,   /* the dots just appear */
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {it.text}
            </motion.span>
          ))}
        </p>
      </div>

      {/* ── Skip — tucked just under her feet. The scene publishes the foot
           line as --walk-feet-y every frame, so this tracks her at any
           viewport rather than guessing a percentage that only holds at one
           aspect ratio. The fallback covers the first frame before the scene
           has measured itself. ── */}
      <div
        className="absolute inset-x-0 flex justify-center z-30"
        style={{ top: 'calc(var(--walk-feet-y, 80%) + 1.25rem)' }}
      >
        {/* The walk runs about eight seconds. This is for anyone who would
            rather not wait for it — a real link, so cmd-click still opens a
            tab. It fades in almost immediately: an exit nobody can find until
            the intro is over is not an exit. */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldReduce ? 0 : 0.6, duration: shouldReduce ? 0 : 0.7 }}
        >
          <Link
            to="/work"
            className="group flex items-center gap-1 pl-6 pr-[18px] py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-ink-200 shadow-lg text-ink-700 text-xs font-medium tracking-[0.04em] hover:bg-white/90 transition-colors duration-200"
          >
            Skip intro
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* ── Music — parked in the corner, out of the walk's way. Squared to
           the same 40px inset as the skip control so the two read as one
           layer rather than two arbitrary placements. ── */}
      <div className="absolute bottom-10 right-6 md:right-10 z-30">
        <MusicPlayer />
      </div>
    </div>
  )
}
