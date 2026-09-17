/* Rich case study page for Surface IT Toolkit — Microsoft */
/* ART: editorial layout, full-width image moments, alternating light/dark sections */
/* MOTION: scroll reveals, staggered gallery, hero image fade-in */
import { Zoomable } from '../components/Lightbox'
import CaseStudyFigure from '../components/CaseStudyFigure'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { getAdjacentProjects } from '../data/projects'

const SLUG = 'surface-it-toolkit'

/* ── Image inventory from reference page ──────────────────── */
import sitHero1      from '../img/sit_hero1.png'
import sitHero2      from '../img/sit_hero2.png'
import sitHero3      from '../img/sit_hero3.png'
import sitUefi       from '../img/sit_uefi.png'
import sitFinal1     from '../img/sit_final1.png'
import sitFinal2     from '../img/sit_final2.png'
import sitFinal3     from '../img/sit_final3.png'
import sitFinal4     from '../img/sit_final4.png'
import sitFinal5     from '../img/sit_final5.png'
import sitFinal6     from '../img/sit_final6.png'
import sitFinal7     from '../img/sit_final7.png'
import sitFinal8     from '../img/sit_final8.png'
import sitFinal9     from '../img/sit_final9.png'
import sitLegacy1    from '../img/sit_legacy1.png'
import sitLegacy2    from '../img/sit_legacy2.png'
import sitWireframe1 from '../img/sit_wireframe1.png'
import sitWireframe2 from '../img/sit_wireframe2.png'
import sitFlowchart  from '../img/sit_flowchart.png'
import sitIconset    from '../img/sit_iconset.png'

const HERO_IMAGES = [
  { src: sitFinal1, alt: 'Dark mode: Recovery Tool with Create New and Manage Existing actions' },
  { src: sitFinal4, alt: 'Dark mode: UEFI dock configuration package creation complete' },
  { src: sitFinal6, alt: 'Dark mode: UEFI dock configuration and component policies' },
]

const UEFI_SCREENSHOT = sitUefi

const FINAL_DESIGNS = [
  { src: sitFinal2, alt: 'Dark mode: managed device family and model selection' },
  { src: sitFinal9, alt: 'Dark mode: Data Eraser device selection and compatibility notice' },
  { src: sitFinal3, alt: 'Dark mode: Data Eraser USB Builder final review' },
  { src: sitFinal5, alt: 'Dark mode: UEFI dock setup and certificate validation' },
  { src: sitFinal7, alt: 'Dark mode: UEFI dock configuration final review' },
  { src: sitFinal8, alt: 'Dark mode: UEFI device configuration and certification' },
]

const LIGHT_DESIGNS = [
  { src: sitHero1, alt: 'Light mode: Data Eraser USB Builder and sanitization certificate', caption: 'Data Eraser' },
  { src: sitHero2, alt: 'Light mode: UEFI Configurator device and dock tools', caption: 'UEFI Configurator' },
  { src: sitHero3, alt: 'Light mode: Tool Library and Surface Asset Tag details', caption: 'Tool Library' },
]

const LEGACY_DESIGNS = [
  { src: sitLegacy1,    caption: 'Legacy Design and flow: UEFI Configurator' },
  { src: sitLegacy2,    caption: 'Legacy Design and flow: Data Eraser' },
]

const WIREFRAMES = [
  { src: sitWireframe1, caption: 'Wireframes: Data Eraser' },
  { src: sitWireframe2, caption: 'Wireframes: First Run Experience' },
]

const FLOWCHART_IMG = sitFlowchart
const ICON_SET_IMG  = sitIconset

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
    <article className="case-study" aria-label="Case study: Surface IT Toolkit">

      {/* ── PROJECT HEADER ──────────────────────────────────── */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <motion.div
            variants={stagger} initial="hidden" animate="show"
          >
            <motion.div variants={fadeUp}>
              <button
                onClick={() => navigate('/work')}
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
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-bold text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-tight mb-5"
            >
              Surface IT Toolkit
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-stone-500 leading-relaxed max-w-2xl mb-10">
              Bringing Surface deployment, configuration, and recovery tools into one
              consistent Windows experience.
            </motion.p>

            {/* TL;DR callout */}
            <motion.div
              variants={fadeUp}
              className="case-study-summary"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 flex-shrink-0">At a glance</span>
              <p className="text-sm text-indigo-900 leading-relaxed">
                I designed all features across the toolkit, from workflows and interface design
                to custom icons and product imagery. The examples below show some of that work.
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
              { term: 'Role',     detail: 'Sole designer for UX, UI, and visual design' },
              { term: 'Timeline', detail: 'Sep 2023 to Apr 2024'   },
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

      {/* Dark mode leads with one large screen and two supporting designs. */}
      <section className="surface-dark-showcase" aria-label="Dark-mode design showcase">
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          className="surface-dark-showcase__grid"
        >
          {HERO_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={i === 0 ? 'surface-dark-showcase__lead' : 'surface-dark-showcase__support'}
            >
              <Zoomable src={img.src} alt={img.alt}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="surface-design-image"
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </Zoomable>
            </motion.div>
          ))}
        </motion.div>
      </section>

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
                Bringing the Surface tools together
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  IT administrators use Surface tools to deploy, configure, and troubleshoot devices.
                  Those tools were spread across different locations, with inconsistent versions
                  and navigation. The toolkit brings them into one Windows application.
                </p>
                <p>
                  The existing tools used different navigation and interaction patterns. My role
                  was to give them a shared structure without losing the detail expert admins need.
                </p>
                <p>
                  I worked with the PMs to define the scope and organize the tools. Design and
                  development ran in parallel, so I reviewed wireframes and prototypes with
                  engineers while they built the application.
                </p>
              </div>
            </div>
            {/* Sidebar stat card */}
            <div className="space-y-4">
              {[
                { value: '1',     label: 'Designer on the team'    },
                { value: 'All',   label: 'Features designed end to end'},
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

        <section aria-labelledby="device-decision-heading">
          <SectionEyebrow label="A closer look / Data Eraser" light />
          <h2 id="device-decision-heading">Start with the device, not its architecture</h2>
          <p className="text-stone-600 max-w-2xl mt-5">
            The legacy selector asked admins to choose an architecture such as x64 or ARM.
            The redesigned selector names Surface families and models, alongside a compatibility
            notice. Admins can select the device model they recognize.
          </p>
          <div className="case-evidence-grid case-evidence-grid--pair">
            <CaseStudyFigure src={sitLegacy2} sourceWidth={1920}
              crop={{ x: 776, y: 254, width: 334, height: 298 }}
              alt="Legacy Data Eraser architecture selection dialog"
              caption="Before: architecture-based selection" />
            <CaseStudyFigure src={sitFinal9}
              alt="Redesigned Data Eraser device selection with family, model, and compatibility guidance"
              caption="Redesign: named devices and compatibility guidance" />
          </div>
        </section>

        <section aria-labelledby="review-decision-heading">
          <SectionEyebrow label="A closer look / UEFI configuration" light />
          <h2 id="review-decision-heading">Make configuration and review distinct steps</h2>
          <p className="text-stone-600 max-w-2xl mt-5">The UEFI flow separates policy choices from
            the final review and completion states. Each screen keeps the tool context visible
            while giving the current step a clear heading and action.</p>
          <div className="case-evidence-grid case-evidence-grid--pair">
            <CaseStudyFigure src={sitFinal6} alt="UEFI dock configuration and component policies" caption="Configure: set the component policies" />
            <CaseStudyFigure src={sitFinal7} alt="UEFI dock configuration final review" caption="Review: inspect the configuration before proceeding" />
          </div>
          <details className="case-artifact-details">
            <summary>Explore the full UEFI workflow canvas</summary>
            <CaseStudyFigure src={UEFI_SCREENSHOT} alt="UEFI Configurator workflow canvas" caption="Full UEFI workflow" />
          </details>
        </section>


        {/* Icon Set */}
        <motion.section
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="icons-heading"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow label="Visual Design" light />
            <h2 id="icons-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">
              Custom icons and product imagery
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-start">
            <motion.div variants={fadeUp} className="space-y-5">
              <p className="text-stone-600 leading-relaxed">
                The lead PM asked for custom icons. I designed them around the toolkit’s
                operations, using Fluent conventions to keep them consistent with Windows.
              </p>
              <p className="text-stone-600 leading-relaxed">
                I sketched ideas by hand, then drew the final vectors in Figma. Each icon
                represents a specific action an IT admin can take.
              </p>
              <p className="text-stone-600 leading-relaxed">
                I also created the product imagery shown throughout the toolkit.
              </p>
              {/* Process steps */}
              <div className="space-y-3 pt-2">
                {[
                  { n: '1', step: 'Brainstorm', desc: 'Defined the concept and metaphor for each action' },
                  { n: '2', step: 'Sketch',     desc: 'Hand-drawn explorations to find the right form' },
                  { n: '3', step: 'Figma',      desc: 'Drew the final vectors using Fluent conventions' },
                ].map(({ n, step, desc }) => (
                  <div key={n} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {n}
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-ink-800">{step}: </span>
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
              <figcaption className="text-xs text-stone-400 px-5 py-3">Customized icon set: designed from scratch</figcaption>
            </motion.figure>
          </div>
        </motion.section>


      </div>

      {/* Further dark-mode details precede the light-mode examples. */}
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
              Dark mode: workflow details
            </h2>
          </motion.div>

          {/* Keep the complete screenshots visible; lightbox opens full size. */}
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {FINAL_DESIGNS.map((img, i) => (
              <motion.figure
                key={i}
                variants={fadeUp}
                className="overflow-hidden"
              >
                <Zoomable src={img.src} alt={img.alt}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="surface-design-image"
                    loading="lazy"
                  />
                </Zoomable>
              </motion.figure>
            ))}
          </motion.div>

          {/* The reaction that came back from the first stakeholder review */}
          <motion.blockquote
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="mt-16 max-w-2xl mx-auto text-center"
          >
            <p className="font-display italic text-3xl md:text-4xl text-stone-100 leading-tight">
              &ldquo;Who&rsquo;s the designer?&rdquo;
            </p>
            <footer className="mt-5 text-sm text-stone-400 leading-relaxed">
              A stakeholder’s reaction when my PM presented the redesign.
            </footer>
          </motion.blockquote>
        </div>
      </section>

      <section className="surface-light-showcase" aria-labelledby="light-designs-heading">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <h2 id="light-designs-heading">One component system, two themes</h2>
          <p className="text-stone-600 max-w-2xl mb-10">Figma variables connected the light and dark
            designs within a shared component system. The goal was to maintain the same hierarchy
            and interaction patterns across both appearances.</p>
          <div className="surface-light-showcase__grid">
            {LIGHT_DESIGNS.map(img => (
              <figure key={img.src}>
                <Zoomable src={img.src} alt={img.alt}>
                  <img src={img.src} alt={img.alt} className="surface-design-image" loading="lazy" />
                </Zoomable>
                <figcaption>{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ARTIFACTS ───────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        <details className="case-artifact-details">
          <summary>Explore the original flows, wireframes, and information architecture</summary>
          <div className="space-y-16">
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
              The original UEFI Configurator and Data Eraser flows used different patterns.
              These canvases document the starting point, not the redesigned experience.
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
              I used these wireframes to discuss the flows with PMs and engineers before
              developing the detailed interface.
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

          </div>
        </details>

        {/* Reflection */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="reflection-heading"
        >
          <SectionEyebrow label="Reflection" light />
          <h2 id="reflection-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
            Designing the whole experience
          </h2>
          <div className="space-y-6 max-w-2xl">
            <blockquote className="border-l-2 border-indigo-500 pl-8">
              <p className="text-stone-600 leading-relaxed text-lg">
                Owning every feature meant looking beyond individual screens. Navigation,
                components, themes, and icons needed to work as one experience.
              </p>
            </blockquote>
            <p className="text-stone-500 leading-relaxed pl-8">
              The toolkit shipped in April 2024. A next step would be to evaluate the workflows
              with admins and connect task-level feedback to further iterations. I would also
              document the rationale alongside components earlier, so future changes preserve
              the reasoning as well as the appearance.
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
