/* Rich case study — Pantry Note (personal/side project) */
/* ART: warm editorial tone, research-first narrative, generous process documentation */
/* MOTION: scroll reveals, staggered image grids */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { getAdjacentProjects } from '../data/projects'

const SLUG = 'pantry-note'
import pnHero        from '../img/pn_hero.gif'
import pnScreens1    from '../img/pn_screens1.png'
import pnScreens2    from '../img/pn_screens2.png'
import pnInline      from '../img/pn_inline.gif'
import pnScreens3    from '../img/pn_screens3.png'
import pnTimeline    from '../img/pn_timeline.png'
import pnSurvey1     from '../img/pn_survey1.jpg'
import pnSurvey2     from '../img/pn_survey2.jpg'
import pnPersona     from '../img/pn_persona.jpg'
import pnJourney     from '../img/pn_journey.jpg'
import pnMentalModel from '../img/pn_mentalmodel.jpg'
import pnUserFlow    from '../img/pn_userflow.jpg'
import pnColorSystem from '../img/pn_colorsystem.png'
import pnWire1       from '../img/pn_wire1.png'
import pnWire2       from '../img/pn_wire2.png'
import pnWire3       from '../img/pn_wire3.png'
import pnWire4       from '../img/pn_wire4.png'
import pnWire5       from '../img/pn_wire5.png'
import pnWire6       from '../img/pn_wire6.png'
import pnWire7       from '../img/pn_wire7.png'
import pnWire8       from '../img/pn_wire8.png'
import pnWire9       from '../img/pn_wire9.png'
import pnWire10      from '../img/pn_wire10.png'
import pnWire11      from '../img/pn_wire11.png'
import pnWire12      from '../img/pn_wire12.png'
import pnWire13      from '../img/pn_wire13.png'
import pnScreen1     from '../img/pn_screen1.png'
import pnScreen2     from '../img/pn_screen2.png'
import pnScreen3     from '../img/pn_screen3.png'
import pnScreen4     from '../img/pn_screen4.png'
import pnScreen5     from '../img/pn_screen5.png'
import pnScreen6     from '../img/pn_screen6.png'
import pnScreen7     from '../img/pn_screen7.png'
import pnScreen8     from '../img/pn_screen8.png'
import pnScreen9     from '../img/pn_screen9.png'
import pnScreen10    from '../img/pn_screen10.png'
import pnScreen11    from '../img/pn_screen11.png'

const IMG = {
  heroGif:     pnHero,
  screens1:    pnScreens1,
  screens2:    pnScreens2,
  inlineGif:   pnInline,
  screens3:    pnScreens3,
  timeline:    pnTimeline,
  survey1:     pnSurvey1,
  survey2:     pnSurvey2,
  persona:     pnPersona,
  journey:     pnJourney,
  mentalModel: pnMentalModel,
  userFlow:    pnUserFlow,
  colorSystem: pnColorSystem,
}

const WIREFRAMES = [
  pnWire1, pnWire2, pnWire3, pnWire4, pnWire5, pnWire6, pnWire7,
  pnWire8, pnWire9, pnWire10, pnWire11, pnWire12, pnWire13,
]

const FINAL_SCREENS = [
  pnScreen1, pnScreen2, pnScreen3, pnScreen4, pnScreen5, pnScreen6,
  pnScreen7, pnScreen8, pnScreen9, pnScreen10, pnScreen11,
]

/* ── Lightbox ─────────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/95 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
        onClick={onClose} role="dialog" aria-modal="true" aria-label={`Full-size: ${alt}`}
      >
        <motion.img src={src} alt={alt}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()} />
        <button onClick={onClose} aria-label="Close image"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

function Zoomable({ src, alt, className, children }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={`block w-full text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-indigo-400 rounded-xl ${className ?? ''}`}
        aria-label={`View full size: ${alt}`}>
        {children}
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={close} />}
    </>
  )
}

function ZoomImg({ src, alt, className }) {
  return (
    <Zoomable src={src} alt={alt}>
      <img src={src} alt={alt} className={className ?? 'w-full object-cover'} loading="lazy" />
    </Zoomable>
  )
}

function BackIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
}
function NextIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
}

function Eyebrow({ label }) {
  return (
    <div className="flex items-center gap-4 mb-10" aria-hidden="true">
      <span className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-400">{label}</span>
      <div className="flex-1 h-px bg-stone-200" />
    </div>
  )
}
function DarkEyebrow({ label }) {
  return (
    <div className="flex items-center gap-4 mb-10" aria-hidden="true">
      <span className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}

/* ── Main ─────────────────────────────────────────────────── */
export default function PantryNoteCaseStudy() {
  const navigate = useNavigate()
  const { prev, next } = getAdjacentProjects(SLUG)
  const shouldReduce = useReducedMotion()

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 28 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] } },
  }
  const stagger = { hidden: {}, show: { transition: { staggerChildren: shouldReduce ? 0 : 0.07 } } }

  return (
    <article className="min-h-screen bg-ink-50 pt-14" aria-label="Case study: Pantry Note">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <motion.div variants={stagger} initial="hidden" animate="show">

            <motion.div variants={fadeUp}>
              <button onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-12 group"
                aria-label="Go back to all work">
                <BackIcon /><span className="group-hover:underline">All Work</span>
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-100">Product Design</span>
              <span className="text-sm font-medium text-stone-400">Personal Project</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-bold text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-tight mb-5">
              Pantry Note
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-stone-500 leading-relaxed max-w-2xl mb-10">
              A food inventory app designed for busy people — helping families track pantry items,
              reduce waste, and get notified before food goes bad.
              Full end-to-end product design: research, ideation, visual design, and prototype.
            </motion.p>

            <motion.div variants={fadeUp}
              className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 flex-shrink-0">TL;DR</span>
              <p className="text-sm text-indigo-900 leading-relaxed">
                Solo UX design from problem to prototype. Ran 29-person survey, built persona + journey map,
                went through multiple visual design iterations, and shipped an interactive Framer prototype.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* ── METADATA ────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { term: 'Role',      detail: 'Product Designer'           },
              { term: 'Engineer',  detail: 'Andy Shin'                  },
              { term: 'Tools',     detail: 'Figma · Framer'             },
              { term: 'Type',      detail: 'Personal Project'           },
            ].map(({ term, detail }) => (
              <div key={term}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{term}</dt>
                <dd className="text-sm font-medium text-ink-800">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── HERO GIF ────────────────────────────────────────── */}
      <div className="bg-stone-50 border-b border-stone-100 py-12">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <ZoomImg src={IMG.heroGif} alt="Pantry Note animated product overview" className="w-full rounded-2xl object-cover shadow-lg" />
          </motion.div>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Problem + Solution */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp}><Eyebrow label="Problem & Solution" /></motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-white border border-stone-100">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Problem</div>
              <p className="text-ink-800 leading-relaxed text-lg font-medium mb-4">
                Busy people need an easier way to track their food items.
              </p>
              <p className="text-stone-500 leading-relaxed text-sm">
                People who don't have enough time to manage their pantry need an efficient smartphone solution
                to check and track food items — improving budgetary planning without adding cognitive load.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-indigo-600 border border-indigo-700">
              <div className="text-xs font-bold uppercase tracking-widest text-indigo-200 mb-4">Solution</div>
              <p className="text-white leading-relaxed text-lg font-medium mb-4">
                Accurate food inventory with smart notifications.
              </p>
              <p className="text-indigo-200 leading-relaxed text-sm">
                Pantry Note helps users create an accurate food inventory and sends push notifications
                before items expire — reducing waste and saving money.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Key Discovery */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <Eyebrow label="Key Discovery" />
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-center">
            <div>
              <h2 className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
                The plus button was the problem.
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                In the first iteration, adding an item required tapping a plus button — a pattern borrowed
                from todo apps. Testing revealed this created unexpected friction: users had to stop and
                think about how the action worked before doing it.
              </p>
              <p className="text-stone-600 leading-relaxed">
                The core insight: <strong className="text-ink-800">users don't want to think about how to use the app.</strong> Any
                moment of "how do I do this?" signals a design failure for a utility tool. This drove
                the redesign toward more direct, contextual entry points.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-700">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Iteration Trigger</div>
              <blockquote className="text-stone-300 text-sm leading-relaxed italic">
                "The plus button required cognitive effort — making users perceive the app as burdensome rather than helpful."
              </blockquote>
            </div>
          </div>
        </motion.section>

        {/* App Screens Showcase */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <div className="space-y-5">
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
              <ZoomImg src={IMG.screens1} alt="Pantry Note app screens overview" className="w-full object-cover" />
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
              <ZoomImg src={IMG.screens2} alt="Pantry Note UI detail screens" className="w-full object-cover" />
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
              <ZoomImg src={IMG.inlineGif} alt="Pantry Note interaction animation" className="w-full object-cover" />
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
              <ZoomImg src={IMG.screens3} alt="Pantry Note additional app screens" className="w-full object-cover" />
            </motion.figure>
          </div>
        </motion.section>

        {/* Process & Timeline */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp}><Eyebrow label="Process & Timeline" /></motion.div>
          <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-100">
            <ZoomImg src={IMG.timeline} alt="Pantry Note process and timeline diagram" className="w-full object-contain" />
          </motion.figure>
        </motion.section>

        {/* Research */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="research-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Research" />
            <h2 id="research-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
              Understanding the problem space
            </h2>
            <p className="text-stone-500 mb-10 max-w-xl">
              Before designing anything, I needed to understand who manages food at home, what frustrates them,
              and why existing apps weren't solving it.
            </p>
          </motion.div>

          {/* Methodology + Competitive Analysis */}
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-4">Methodology</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                {['Guerrilla interviews', 'Online data research', 'Competitive analysis', 'Participant survey (n=29)', 'Data analysis', 'Persona + journey mapping'].map(m => (
                  <li key={m} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-4">Competitive Analysis</h3>
              <div className="space-y-3 text-sm text-stone-600">
                {['NoWaste', 'Pantry Check', 'Cozzo.app', 'Grocy.info'].map(app => (
                  <div key={app} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500 flex-shrink-0">
                      {app[0]}
                    </div>
                    <span>{app}</span>
                  </div>
                ))}
                <p className="text-xs text-stone-400 pt-2">Key finding: limited products, several discontinued; remaining apps require extensive user learning</p>
              </div>
            </motion.div>
          </div>

          {/* Survey stats */}
          <motion.div variants={stagger} className="mb-10">
            <motion.h3 variants={fadeUp} className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-6">
              Survey — 29 participants
            </motion.h3>
            <div className="grid grid-cols-3 gap-5 mb-8">
              {[
                { value: '19/29', label: 'Cook daily', pct: '66%' },
                { value: '24/29', label: 'Have discarded food previously', pct: '83%' },
                { value: '21/29', label: 'Want inventory visibility in-app', pct: '72%' },
              ].map(({ value, label, pct }) => (
                <motion.div key={label} variants={fadeUp} className="p-5 rounded-2xl bg-white border border-stone-100 text-center">
                  <div className="font-bold text-3xl text-indigo-600 mb-1">{pct}</div>
                  <div className="font-medium text-sm text-ink-800 mb-1">{value}</div>
                  <div className="text-xs text-stone-500 leading-snug">{label}</div>
                </motion.div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { src: IMG.survey1, alt: 'Survey data chart 1' },
                { src: IMG.survey2, alt: 'Survey findings chart 2' },
              ].map((img, i) => (
                <motion.figure key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                  <ZoomImg src={img.src} alt={img.alt} className="w-full object-contain max-h-72" />
                </motion.figure>
              ))}
            </div>
          </motion.div>

          {/* Key Takeaways */}
          <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-5">Key Takeaways from Survey</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'Awareness of inventory prevents problems seen in the past',
                'Food management issues are age-independent and widely shared',
                'Users rely on outdated methods (notes, memory) despite available apps',
                'Co-inhabitants rarely share food inventory data with each other',
                'Frequent cooks (3+ times/week) shop at least weekly',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-stone-600">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

      </div>

      {/* ── ANALYZE & DEFINE — dark section ─────────────────── */}
      <section className="bg-zinc-950 py-24" aria-labelledby="define-heading">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mb-12">
            <DarkEyebrow label="Analyze & Define" />
            <h2 id="define-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight mb-4">
              Who is this for?
            </h2>
            <p className="text-stone-400 max-w-xl">
              The target: people responsible for managing household food — often parents who are
              always too busy to track inventory properly.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-2 gap-4">
            {/* Persona */}
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">Persona — Hailey Wilson</p>
              <figure className="rounded-2xl overflow-hidden bg-zinc-900">
                <ZoomImg src={IMG.persona} alt="Persona: Hailey Wilson" className="w-full h-64 object-cover object-top" />
                <figcaption className="text-xs text-stone-500 px-4 py-3">
                  Chicago · Freelance designer · Two children
                </figcaption>
              </figure>
            </motion.div>

            {/* User Journey Map */}
            <motion.div variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-3">User Journey Map</p>
              <figure className="rounded-2xl overflow-hidden bg-zinc-900">
                <ZoomImg src={IMG.journey} alt="User journey map for Hailey" className="w-full h-64 object-cover object-top" />
                <figcaption className="text-xs text-stone-500 px-4 py-3">
                  End-to-end journey managing food at home
                </figcaption>
              </figure>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── IDEATE & ITERATIONS ──────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Mental Model + User Flow */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="ideate-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Ideate & Iterations" />
            <h2 id="ideate-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-10">
              From mental model to detailed flow
            </h2>
          </motion.div>

          <motion.div variants={stagger} className="grid md:grid-cols-2 gap-5">
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <ZoomImg src={IMG.mentalModel} alt="Mental model and user flow diagram" className="w-full h-56 object-cover object-top" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Mental model and user flow</figcaption>
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <ZoomImg src={IMG.userFlow} alt="Detailed user flow diagram" className="w-full h-56 object-cover object-top" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Detailed user flow</figcaption>
            </motion.figure>
          </motion.div>
        </motion.section>

        {/* Wireframes design goals */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="wireframes-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Sketches & Wireframes" />
            <h2 id="wireframes-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
              Design principles driving the wireframes
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            <motion.div variants={fadeUp} className="space-y-3">
              {[
                { n: '1', goal: 'Easy start point — no steep learning curve for busy people' },
                { n: '2', goal: 'Offer few options per screen — reduce decision fatigue' },
                { n: '3', goal: 'Easy undo / redo — forgive mistakes without friction' },
                { n: '4', goal: 'Make things easy to find — no buried features' },
                { n: '5', goal: 'Efficient and streamlined — every tap should earn its place' },
              ].map(({ n, goal }) => (
                <div key={n} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-stone-100">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                  <span className="text-sm text-stone-600 leading-relaxed">{goal}</span>
                </div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700 mb-4">Key Features</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                {[
                  'Multiple input methods: typing, voice recognition, camera (image + barcode)',
                  'Family sharing — co-inhabitants see the same inventory',
                  'Push notifications before food expires',
                  'Eating habit analysis over time',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Wireframe grid */}
          <motion.div variants={stagger} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
            {WIREFRAMES.map((src, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50 aspect-[9/16]">
                <Zoomable src={src} alt={`Wireframe screen ${i + 1}`} className="h-full">
                  <img src={src} alt={`Wireframe screen ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
                </Zoomable>
              </motion.figure>
            ))}
          </motion.div>
        </motion.section>

      </div>

      {/* ── VISUAL DESIGN — dark section ─────────────────────── */}
      <section className="bg-zinc-950 py-24" aria-labelledby="visual-heading">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mb-12">
            <DarkEyebrow label="Visual Design" />
            <h2 id="visual-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight mb-6">
              Simple, not complicated.
            </h2>
            <div className="grid md:grid-cols-[2fr_1fr] gap-12">
              <p className="text-stone-400 leading-relaxed">
                The visual design goal was clarity over decoration. Food images per item enable quick scanning;
                a white background with minimal color prevents visual clutter. Three colors carry intentional meaning:
                green for growth and health, yellow and orange for warmth and enthusiasm.
                The overall tone: helpful, easy, fun, and environmental.
              </p>
              <div className="space-y-3">
                {[
                  { color: 'bg-green-500',  label: 'Green',  meaning: 'Growth · Health · Refreshing' },
                  { color: 'bg-yellow-400', label: 'Yellow', meaning: 'Warmth · Enthusiasm'           },
                  { color: 'bg-orange-400', label: 'Orange', meaning: 'Excitement · Energy'            },
                ].map(({ color, label, meaning }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 ${color}`} aria-hidden="true" />
                    <div>
                      <div className="text-sm font-medium text-stone-200">{label}</div>
                      <div className="text-xs text-stone-500">{meaning}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Color system + final screens side by side */}
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-[1fr_2fr] gap-5 items-start">
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden bg-zinc-900">
              <ZoomImg src={IMG.colorSystem} alt="Pantry Note color palette and design system" className="w-full h-48 object-cover" />
              <figcaption className="text-xs text-stone-500 px-4 py-3">Color palette</figcaption>
            </motion.figure>

            {/* Final screens grid */}
            <motion.div variants={stagger} className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {FINAL_SCREENS.map((src, i) => (
                <motion.figure key={i} variants={fadeUp} className="rounded-lg overflow-hidden bg-zinc-900 aspect-[9/16]">
                  <Zoomable src={src} alt={`Final screen ${i + 1}`} className="h-full">
                    <img src={src} alt={`Final screen ${i + 1}`} className="w-full h-full object-contain" loading="lazy" />
                  </Zoomable>
                </motion.figure>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── PROTOTYPE + REFLECTION ──────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">


        {/* Challenge + Reflection */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="reflection-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Challenge & Reflection" />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-white border border-stone-100">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Challenge</div>
              <p className="text-stone-600 leading-relaxed">
                Making a clean, simple UI for what is fundamentally an inventory system — a category
                historically associated with complexity — was the central design challenge.
                Inventory systems require managing state, categories, quantities, and time.
                Hiding that complexity while keeping the app powerful enough to be useful is an
                ongoing problem that remains a focus for future iterations.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-ink-900 border border-ink-800">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">Reflection</div>
              <blockquote className="text-stone-300 leading-relaxed mb-5">
                "It was difficult to repeatedly solve problems found in the idea phase.
                But this was a great time to think about what a UX designer should do —
                and I experienced the joy of finding solutions after persistent iteration."
              </blockquote>
              <div className="space-y-2 text-xs text-stone-500">
                <div className="flex gap-2"><span className="text-indigo-400">→</span> Implementation is harder than ideation</div>
                <div className="flex gap-2"><span className="text-indigo-400">→</span> One user flow requires many more screens than expected</div>
                <div className="flex gap-2"><span className="text-indigo-400">→</span> Gained end-to-end product creation experience</div>
                <div className="flex gap-2"><span className="text-indigo-400">→</span> Developed time management for digital products</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

      </div>

      {/* ── NEXT / PREV ──────────────────────────────────────── */}
      <nav aria-label="Project navigation" className="border-t border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid grid-cols-2 gap-4">
          {prev ? (
            <Link to={`/project/${prev.slug}`} aria-label={`Previous project: ${prev.title}`}
              className="group flex flex-col gap-2 p-6 rounded-2xl border border-stone-100 hover:border-stone-300 transition-all duration-200 hover:-translate-y-0.5">
              <span className="text-xs text-stone-400 uppercase tracking-wide flex items-center gap-1"><BackIcon /> Previous</span>
              <span className="text-sm font-semibold text-ink-800 group-hover:text-ink-600 transition-colors line-clamp-1">{prev.title}</span>
            </Link>
          ) : <div aria-hidden="true" />}
          {next ? (
            <Link to={`/project/${next.slug}`} aria-label={`Next project: ${next.title}`}
              className="group flex flex-col gap-2 p-6 rounded-2xl border border-stone-100 hover:border-stone-300 transition-all duration-200 hover:-translate-y-0.5 text-right ml-auto w-full">
              <span className="text-xs text-stone-400 uppercase tracking-wide flex items-center justify-end gap-1">Next <NextIcon /></span>
              <span className="text-sm font-semibold text-ink-800 group-hover:text-ink-600 transition-colors line-clamp-1">{next.title}</span>
            </Link>
          ) : <div aria-hidden="true" />}
        </div>
      </nav>

    </article>
  )
}
