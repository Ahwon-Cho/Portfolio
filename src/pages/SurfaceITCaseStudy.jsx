/* Rich case study page for Surface IT Toolkit — Microsoft */
/* ART: editorial layout, full-width image moments, alternating light/dark sections */
/* MOTION: scroll reveals, staggered gallery, hero image fade-in */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { getAdjacentProjects } from '../data/projects'

/* ── Lightbox ─────────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/95 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Full-size view: ${alt}`}
      >
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          aria-label="Close image"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

/* Clickable image wrapper — shows zoom cursor, opens lightbox on click */
function Zoomable({ src, alt, className, children }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block w-full text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-amber-400 rounded-xl ${className ?? ''}`}
        aria-label={`View full size: ${alt}`}
      >
        {children}
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={close} />}
    </>
  )
}

const SLUG = 'surface-it-toolkit'

/* ── Image inventory from reference page ──────────────────── */
const CDN = 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/'

const HERO_IMAGES = [
  {
    src: CDN + '4712fd83-f8aa-400a-ab31-d8d6613e1f34_rw_1920.png?h=27f9fff96f7d191e6d9a413c4e13a4bd',
    alt: 'Surface IT Toolkit — home screen redesign',
  },
  {
    src: CDN + '7e44ecd9-93ad-4859-b23b-dc0686cda271_rw_1920.png?h=921057c3e5e50b21cf8543f3638ea2fc',
    alt: 'Surface IT Toolkit — tool navigation redesign',
  },
  {
    src: CDN + '5741493c-c078-4287-964e-c04f632a717d_rw_1920.png?h=d83700bf77069eaf7f2784d39f694bf8',
    alt: 'Surface IT Toolkit — device management panel',
  },
]

const UEFI_SCREENSHOT = CDN + 'eaf4a5f5-0834-4450-aea7-913aada93aa8_rw_1920.png?h=e0257327489f30769ba0f2ef9334b1c6'

const FINAL_DESIGNS = [
  { src: CDN + 'e092c4f8-b045-45a1-8bc7-0e55ee8dc89d_rw_1200.png?h=724de717dc22f37c08c3a6a5668b524a', alt: 'Final design — home dashboard' },
  { src: CDN + '40e72926-0e8b-425d-9ea8-f5894d0338a8_rw_1200.png?h=0edd99e54013e02bf90bdf52f2d33367', alt: 'Final design — tool list view' },
  { src: CDN + 'd6f257f3-cee7-42fb-a63b-0074c830298c_rw_1200.png?h=d79f4739957e70bc65e6f66a49c9e14b', alt: 'Final design — UEFI Configurator' },
  { src: CDN + '2af826b5-f59d-4b08-8d1f-241e15452876_rw_1200.png?h=438b12c95a91bbd4f541607f9c934ca8', alt: 'Final design — Data Eraser workflow' },
  { src: CDN + 'd15fb61c-be64-4bc6-afef-20c3b66a06ce_rw_1200.png?h=19cc86b913c93785622962a9b385814f', alt: 'Final design — First Run Experience' },
  { src: CDN + '48b65c95-d36a-45ad-853c-81dbea909f34_rw_1200.png?h=1cf2c5c1f04aeeaa3001ad2dc0c34b0a', alt: 'Final design — device diagnostics' },
  { src: CDN + '339c69b3-4f71-40ff-a1a1-c77923318731_rw_1200.png?h=0bb34abb51365815e7cf3e61da59962d', alt: 'Final design — dark mode variant' },
  { src: CDN + '029e0a20-6076-45f6-91dc-7c4222976e3f_rw_1200.png?h=a322f96f94e08312656d4c13bc89789d', alt: 'Final design — settings screen' },
  { src: CDN + '7f6809ae-bfe1-4783-b583-44eb5c593055_rw_1200.png?h=93f2a0790eecd2797166fbd94a531f7c', alt: 'Final design — recovery workflow' },
]

const LEGACY_DESIGNS = [
  {
    src: CDN + 'bb864f36-c55c-4f19-a3b8-f9af545090bf_rw_1920.png?h=f3f8d65bff354ec26f925654ac8117fc',
    caption: 'Legacy Design and flow — UEFI Configurator',
  },
  {
    src: CDN + '4634dfc1-296b-49d8-8ea2-6f236ba10cfd_rw_1920.png?h=b21ba5678170d988358aec87c97fa79d',
    caption: 'Legacy Design and flow — Data Eraser',
  },
]

const WIREFRAMES = [
  {
    src: CDN + '028bb35a-ca69-468b-ae6a-3fac0ca234e8_rw_1920.png?h=c38f44a9bb5530fa941bf99eed3732c1',
    caption: 'Wireframes — Data Eraser',
  },
  {
    src: CDN + 'a09bdc61-3b7a-473a-858a-3a622fe7de10_rw_1920.png?h=291bbda1d2a838f64b664e209a2156cb',
    caption: 'Wireframes — First Run Experience',
  },
]

const FLOWCHART_IMG = CDN + 'af22ce43-0676-431d-b0a2-70eb048c6142_rw_1200.png?h=c91ef71c7bf5e0bc889a3d08e54a37e4'
const ICON_SET_IMG  = CDN + '29814a0f-0905-44af-8c40-43e85cfb253a_rw_1200.png?h=7c3078533484cbe953b32396a1987e0b'

/* ── Sub-components ───────────────────────────────────────── */
function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  )
}

function NextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

function SectionEyebrow({ label, light = false }) {
  return (
    <div className="flex items-center gap-4 mb-12" aria-hidden="true">
      <span className={`text-xs font-semibold tracking-[0.22em] uppercase ${light ? 'text-stone-500' : 'text-stone-400'}`}>
        {label}
      </span>
      <div className={`flex-1 h-px ${light ? 'bg-stone-200' : 'bg-white/10'}`} />
    </div>
  )
}

/* ── Main component ───────────────────────────────────────── */
export default function SurfaceITCaseStudy() {
  const navigate     = useNavigate()
  const { prev, next } = getAdjacentProjects(SLUG)
  const shouldReduce = useReducedMotion()

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 28 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] } },
  }

  const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: shouldReduce ? 0 : 0.08 } },
  }

  return (
    <article className="min-h-screen bg-ink-50 pt-14" aria-label="Case study: Surface IT Toolkit">

      {/* ── PROJECT HEADER ──────────────────────────────────── */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <motion.div
            variants={stagger} initial="hidden" animate="show"
          >
            <motion.div variants={fadeUp}>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-12 group"
                aria-label="Go back to all work"
              >
                <BackIcon />
                <span className="group-hover:underline">All Work</span>
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-700 border-emerald-100">
                Product Design
              </span>
              <span className="text-sm font-medium text-stone-400">Microsoft</span>
              <span className="text-xs font-medium text-stone-400 px-2.5 py-0.5 rounded-full border border-stone-200">
                Full-time
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-bold text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-tight mb-5"
            >
              Surface IT Toolkit
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-stone-500 leading-relaxed max-w-2xl mb-10">
              A Windows application consolidating enterprise IT admin tools into a single,
              centralized interface — redesigned from a developer-built legacy UI in under 8 months.
            </motion.p>

            {/* TL;DR callout */}
            <motion.div
              variants={fadeUp}
              className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-100"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 flex-shrink-0">TL;DR</span>
              <p className="text-sm text-indigo-900 leading-relaxed">
                Sole product designer on a Microsoft enterprise tool used by IT admins worldwide.
                Used existing system components + Figma variables to accelerate the timeline,
                redesigned three core workflows, and shipped in April 2024.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* ── METADATA BAR ────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { term: 'Role',     detail: 'Sole Product Designer'  },
              { term: 'Timeline', detail: 'Sep 2023 – Apr 2024'   },
              { term: 'Team',     detail: '2 PMs · 4 Engineers · 1 Designer' },
              { term: 'Type',     detail: 'Windows Enterprise App' },
            ].map(({ term, detail }) => (
              <div key={term}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{term}</dt>
                <dd className="text-sm font-medium text-ink-800">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── HERO IMAGE TRIPTYCH ──────────────────────────────── */}
      <div className="bg-zinc-950 overflow-hidden">
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-px"
        >
          {HERO_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="overflow-hidden"
            >
              <Zoomable src={img.src} alt={img.alt}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-72 md:h-96 object-cover object-top hover:scale-[1.02] transition-transform duration-700"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </Zoomable>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Background */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="background-heading"
        >
          <SectionEyebrow label="Background" light />
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
            <div>
              <h2 id="background-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
                Enterprise tools built without designers.
                <span className="font-light text-ink-500"> We changed that.</span>
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  The Surface IT Toolkit is a Windows application designed to support enterprise IT
                  administrators managing Microsoft Surface devices. For many commercial customers,
                  managing a fleet of devices requires the right tools for deployment, configuration,
                  and troubleshooting — but those tools were scattered across multiple locations,
                  inconsistent in versioning, and difficult to discover or use efficiently.
                </p>
                <p>
                  When I joined the team, the existing tool had been developed without design support —
                  a common scenario for legacy tools at Microsoft. It lacked visual consistency, clear
                  structure, and user-centered design principles.
                </p>
                <p>
                  Despite the scale and complexity, the team was committed to delivering within a tight
                  timeline. I partnered closely with PMs from day one to structure the experience and
                  align on scope, then worked directly with engineers as wireframes and prototypes took
                  shape — staying slightly ahead of implementation while keeping an iterative workflow.
                </p>
              </div>
            </div>
            {/* Sidebar stat card */}
            <div className="space-y-4">
              {[
                { value: '8 mo',  label: 'Design-to-ship timeline' },
                { value: '1',     label: 'Designer on the team'    },
                { value: '3',     label: 'Core workflows redesigned'},
                { value: '2',     label: 'Theme modes (L + D)'     },
              ].map(({ value, label }) => (
                <div key={label} className="p-5 rounded-2xl border border-stone-200 bg-white">
                  <div className="font-bold text-2xl text-ink-900 mb-1">{value}</div>
                  <div className="text-xs text-stone-500 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* UEFI Screenshot — full width editorial moment */}
        <motion.figure
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="rounded-2xl overflow-hidden shadow-2xl"
        >
          <Zoomable src={UEFI_SCREENSHOT} alt="UEFI Configurator — final redesign screenshot">
            <img
              src={UEFI_SCREENSHOT}
              alt="UEFI Configurator — final redesign screenshot"
              className="w-full object-cover"
              loading="lazy"
            />
          </Zoomable>
          <figcaption className="text-xs text-stone-400 text-center pt-3 pb-1">
            UEFI Configurator — final design
          </figcaption>
        </motion.figure>

        {/* Challenges */}
        <motion.section
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="challenges-heading"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow label="Challenges" light />
            <h2 id="challenges-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-10">
              What made this hard
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                n: '01',
                title: 'Parallel tracks',
                body: 'Design and development ran simultaneously — no buffer. Decisions had to be made fast and final, leaving minimal room for iteration.',
              },
              {
                n: '02',
                title: 'Developer-built UI',
                body: 'The existing interface was created by engineers without design support — inconsistent components, unclear hierarchy, no foundational UX structure.',
              },
              {
                n: '03',
                title: 'Dual-mode in tight scope',
                body: 'Light and dark modes were required, but limited time and resources meant the theming system had to be architected for efficiency, not just aesthetics.',
              },
              {
                n: '04',
                title: 'Domain knowledge gap',
                body: 'The tool was built for expert IT admins. As a non-user, I had limited domain context — and no time for full onboarding before design work began.',
              },
            ].map(({ n, title, body }) => (
              <motion.div
                key={n}
                variants={fadeUp}
                className="p-6 rounded-2xl bg-white border border-stone-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    {n}
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700">
                    {title}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Design Solutions */}
        <motion.section
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="solutions-heading"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow label="Design Solutions" light />
            <h2 id="solutions-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-10">
              How I solved them
            </h2>
          </motion.div>
          <div className="space-y-5">
            {[
              {
                n: '1',
                title: 'Scalable Figma component system',
                body: 'Built a comprehensive component library from the ground up — reducing rework across screens and enabling rapid updates in the final stages without rebuilding from scratch.',
              },
              {
                n: '2',
                title: 'Figma variables for simultaneous light/dark design',
                body: 'Adopted Figma variables shortly after their release to design both light and dark modes in parallel — not as a retrofit. A single source of truth let engineers implement themes directly from the file with no translation layer.',
              },
              {
                n: '3',
                title: 'Workflow restructuring for clarity',
                body: 'Reorganized the three core workflows (UEFI Configurator, Data Eraser, First Run Experience) to align with WCAG accessibility principles, reduce cognitive load, and reflect how admins actually think about tasks.',
              },
              {
                n: '4',
                title: 'Adaptive collaboration rhythm',
                body: 'Established a fast feedback loop with PMs and engineers — daily check-ins during critical phases, with designs always one sprint ahead. Adjusted quickly to technical constraints without sacrificing design intent.',
              },
            ].map(({ n, title, body }) => (
              <motion.div
                key={n}
                variants={fadeUp}
                className="flex gap-6 p-6 rounded-2xl border border-stone-100 bg-white hover:border-stone-300 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">{n}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-ink-800 mb-2">{title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>

      {/* ── FINAL DESIGNS GALLERY (full bleed dark) ─────────── */}
      <section aria-labelledby="final-designs-heading" className="bg-zinc-950 py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-10" aria-hidden="true">
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">Final Designs</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <h2 id="final-designs-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight">
              Surface IT Toolkit — final designs
            </h2>
          </motion.div>

          {/* 3×3 grid — 9 images, perfectly even */}
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {FINAL_DESIGNS.map((img, i) => (
              <motion.figure
                key={i}
                variants={fadeUp}
                className="rounded-xl overflow-hidden aspect-video"
              >
                <Zoomable src={img.src} alt={img.alt} className="h-full">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-500"
                    loading="lazy"
                  />
                </Zoomable>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROCESS ARTIFACTS ───────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Legacy Designs */}
        <motion.section
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="legacy-heading"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow label="Before" light />
            <h2 id="legacy-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
              Legacy designs
            </h2>
            <p className="text-stone-500 mb-10 max-w-xl">
              Developer-built UI from before design joined the team. Inconsistent components,
              no clear hierarchy, and no user-centered structure.
            </p>
          </motion.div>
          <div className="space-y-5">
            {LEGACY_DESIGNS.map((img, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                <Zoomable src={img.src} alt={img.caption}>
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full object-contain max-h-[480px]"
                    loading="lazy"
                  />
                </Zoomable>
                <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">{img.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>

        {/* Wireframes */}
        <motion.section
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="wireframes-heading"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow label="Process" light />
            <h2 id="wireframes-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
              Wireframes
            </h2>
            <p className="text-stone-500 mb-10 max-w-xl">
              Low-fidelity explorations used to align with PMs and engineers before moving to
              high-fidelity components — kept simple to maximize iteration speed.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {WIREFRAMES.map((img, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200">
                <Zoomable src={img.src} alt={img.caption}>
                  <img
                    src={img.src}
                    alt={img.caption}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </Zoomable>
                <figcaption className="text-xs text-stone-400 px-5 py-3">{img.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>

        {/* Flowchart */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="flowchart-heading"
        >
          <SectionEyebrow label="Information Architecture" light />
          <h2 id="flowchart-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
            Flowchart
          </h2>
          <p className="text-stone-500 mb-10 max-w-xl">
            Task flows mapped before wireframing to ensure each workflow had a clear entry
            point, decision tree, and exit state.
          </p>
          <figure className="rounded-2xl overflow-hidden border border-stone-200">
            <Zoomable src={FLOWCHART_IMG} alt="User flow diagram for Surface IT Toolkit workflows">
              <img
                src={FLOWCHART_IMG}
                alt="User flow diagram for Surface IT Toolkit workflows"
                className="w-full object-cover"
                loading="lazy"
              />
            </Zoomable>
            <figcaption className="text-xs text-stone-400 px-5 py-3">Workflow flowchart</figcaption>
          </figure>
        </motion.section>

        {/* Icon Set */}
        <motion.section
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="icons-heading"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow label="Visual Design" light />
            <h2 id="icons-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
              Custom icon set — built from scratch
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-start">
            <motion.div variants={fadeUp} className="space-y-5">
              <p className="text-stone-600 leading-relaxed">
                The lead PM made a clear call: no stock icons. The Surface IT Toolkit needed
                its own visual language — one that felt native to the Windows ecosystem while
                being specific to the tool's operations.
              </p>
              <p className="text-stone-600 leading-relaxed">
                I owned the entire process — from brainstorming the concept for each icon,
                sketching ideas by hand, to crafting the final vectors in Figma. Each icon was
                designed to communicate a specific IT admin action at a glance, while staying
                consistent with Fluent Design System conventions.
              </p>
              {/* Process steps */}
              <div className="space-y-3 pt-2">
                {[
                  { n: '1', step: 'Brainstorm', desc: 'Defined the concept and metaphor for each action' },
                  { n: '2', step: 'Sketch',     desc: 'Hand-drawn explorations to find the right form' },
                  { n: '3', step: 'Figma',      desc: 'Pixel-perfect vector production with Fluent alignment' },
                ].map(({ n, step, desc }) => (
                  <div key={n} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {n}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-ink-800">{step} — </span>
                      <span className="text-sm text-stone-500">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200">
              <Zoomable src={ICON_SET_IMG} alt="Customized icon set for Surface IT Toolkit">
                <img
                  src={ICON_SET_IMG}
                  alt="Customized icon set for Surface IT Toolkit"
                  className="w-full object-cover"
                  loading="lazy"
                />
              </Zoomable>
              <figcaption className="text-xs text-stone-400 px-5 py-3">Customized icon set — designed from scratch</figcaption>
            </motion.figure>
          </div>
        </motion.section>

        {/* Reflection */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="reflection-heading"
        >
          <SectionEyebrow label="Reflection" light />
          <h2 id="reflection-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
            Against the odds — and on time
          </h2>
          <div className="space-y-6 max-w-2xl">
            <blockquote className="border-l-2 border-indigo-500 pl-8">
              <p className="text-stone-600 leading-relaxed text-lg">
                "There were real doubts — internally and externally — about whether this project
                could be finished. The scope was large, the timeline tight, and design was added
                late. We proved them wrong. We shipped on time, and the response from leadership
                and users was overwhelmingly positive."
              </p>
            </blockquote>
            <p className="text-stone-500 leading-relaxed pl-8">
              This fast-paced redesign demanded clarity, precision, and efficiency. Being the sole
              product designer, I focused on establishing coherence and usability quickly —
              without slowing down engineering. I'm grateful for a team that trusted my design
              judgement and delivered on the vision together.
            </p>
          </div>
        </motion.section>
      </div>

      {/* ── NEXT / PREV NAVIGATION ──────────────────────────── */}
      <nav
        aria-label="Project navigation"
        className="border-t border-stone-200 bg-white"
      >
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid grid-cols-2 gap-4">
          {prev ? (
            <Link
              to={`/project/${prev.slug}`}
              aria-label={`Previous project: ${prev.title}`}
              className="group flex flex-col gap-2 p-6 rounded-2xl border border-stone-100 hover:border-stone-300 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span className="text-xs text-stone-400 uppercase tracking-wide flex items-center gap-1">
                <BackIcon /> Previous
              </span>
              <span className="text-sm font-semibold text-ink-800 group-hover:text-ink-600 transition-colors line-clamp-1">
                {prev.title}
              </span>
            </Link>
          ) : <div aria-hidden="true" />}

          {next ? (
            <Link
              to={`/project/${next.slug}`}
              aria-label={`Next project: ${next.title}`}
              className="group flex flex-col gap-2 p-6 rounded-2xl border border-stone-100 hover:border-stone-300 transition-all duration-200 hover:-translate-y-0.5 text-right ml-auto w-full"
            >
              <span className="text-xs text-stone-400 uppercase tracking-wide flex items-center justify-end gap-1">
                Next <NextIcon />
              </span>
              <span className="text-sm font-semibold text-ink-800 group-hover:text-ink-600 transition-colors line-clamp-1">
                {next.title}
              </span>
            </Link>
          ) : <div aria-hidden="true" />}
        </div>
      </nav>

    </article>
  )
}
