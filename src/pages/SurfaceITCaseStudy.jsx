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
import sitKakaduDark from '../img/sit_project_kakadu_dark.png'
import sitKakaduLight from '../img/sit_project_kakadu_light.png'
import sitUefi       from '../img/sit_uefi.png'
import sitFinal2     from '../img/sit_final2.png'
import sitFinal3     from '../img/sit_final3.png'
import sitFinal5     from '../img/sit_final5.png'
import sitFinal6     from '../img/sit_final6.png'
import sitFinal7     from '../img/sit_final7.png'
import sitFinal8     from '../img/sit_final8.png'
import sitFinal9     from '../img/sit_final9.png'
import sitLegacy1    from '../img/sit_legacy1.png'
import sitLegacy2    from '../img/sit_legacy2.png'
import sitLegacyCertificatesIncomplete from '../img/sit_legacy_uefi_certificates_incomplete.png'
import sitLegacyCertificatesComplete from '../img/sit_legacy_uefi_certificates_complete.png'
import sitLegacyDockIds from '../img/sit_legacy_uefi_dock_ids_csv.png'
import sitWireframe1 from '../img/sit_wireframe1.png'
import sitWireframe2 from '../img/sit_wireframe2.png'
import sitFlowchart  from '../img/sit_flowchart.png'
import sitIconset    from '../img/sit_iconset.png'

const HERO_IMAGES = [
  { src: sitKakaduDark, alt: 'Dark-mode Project Kakadu home screen with managed devices and quick tasks' },
  { src: sitKakaduLight, alt: 'Light-mode Project Kakadu home screen with managed devices and quick tasks' },
]

const UEFI_SCREENSHOT = sitUefi

const FINAL_DESIGNS = [
  { src: sitFinal3, alt: 'Dark mode: Data Eraser USB Builder final review' },
  { src: sitFinal5, alt: 'Dark mode: UEFI dock setup and certificate validation' },
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

const LEGACY_UEFI_STATES = [
  {
    src: sitLegacyCertificatesIncomplete,
    alt: 'Legacy UEFI Configurator certificate-import screen before all required files are provided, with Next disabled',
    caption: 'Legacy certificate setup: required files not yet complete',
  },
  {
    src: sitLegacyCertificatesComplete,
    alt: 'Legacy UEFI Configurator certificate-import screen after all required files are provided, with Next available',
    caption: 'Legacy certificate setup: all required files imported',
  },
]

const LEGACY_DOCK_IDS = {
  src: sitLegacyDockIds,
  alt: 'Legacy UEFI Configurator screen for targeting Surface Docks by importing a CSV list of dock IDs',
  caption: 'Legacy dock targeting: import Surface Dock IDs from a CSV',
}

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
                to custom icons, hero imagery, and product visuals. The examples below show some
                of that work.
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

      {/* Lead with the new home-screen designs: dark mode first, then light mode. */}
      <section className="surface-dark-showcase" aria-label="Project Kakadu light and dark design showcase">
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          className="surface-dark-showcase__grid"
        >
          {HERO_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="surface-dark-showcase__lead"
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

      {/* ── STORY ───────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="product-heading"
        >
          <SectionEyebrow label="Product & users" light />
          <div className="grid md:grid-cols-[1.35fr_1fr] gap-12 items-start">
            <div>
              <h2 id="product-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
                One home for essential Surface tools
              </h2>
              <p className="text-stone-600 leading-relaxed text-lg max-w-2xl">
                Surface IT Toolkit is a Windows desktop application that brings Microsoft’s
                essential commercial Surface tools into one place. It helps IT administrators
                configure, secure, recover, and support Surface devices across their organization.
              </p>
              <a
                href="https://learn.microsoft.com/en-us/surface/surface-it-toolkit"
                target="_blank"
                rel="noreferrer"
                className="inline-flex mt-6 text-sm font-semibold text-indigo-700 hover:text-indigo-900 hover:underline"
              >
                View Surface IT Toolkit on Microsoft Learn ↗
              </a>
            </div>
            <aside className="p-6 rounded-2xl border border-stone-200 bg-stone-50">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">Primary users</p>
              <p className="font-semibold text-ink-900 mb-5">IT administrators managing organizational Surface devices</p>
              <ul className="space-y-3 text-sm text-stone-600">
                {['Data Eraser', 'UEFI Configurator', 'Recovery Tool', 'Tool Library'].map((tool) => (
                  <li key={tool} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                    {tool}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </motion.section>

        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="challenge-heading"
        >
          <SectionEyebrow label="Challenge" light />
          <h2 id="challenge-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-5">
            Unify the tools without flattening their complexity
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg max-w-3xl mb-10">
            The tools had different workflows, interaction patterns, and visual styles. The challenge
            was to create a valuable unified product while preserving the technical depth IT admins
            need—and raising both UX clarity and visual quality.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Product value', text: 'Bring high-use Surface utilities into one dependable application.' },
              { title: 'UX clarity', text: 'Make long technical flows easier to understand and complete.' },
              { title: 'Visual quality', text: 'Create a coherent, polished experience across every tool.' },
            ].map(({ title, text }) => (
              <div key={title} className="p-5 rounded-2xl border border-stone-200 bg-white">
                <h3 className="font-semibold text-ink-900 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <details className="case-artifact-details mt-10">
            <summary>See the fragmented legacy experience</summary>
            <div className="space-y-8">
              <p className="text-stone-500 max-w-2xl">
                The original UEFI Configurator and Data Eraser used different structures and
                interaction patterns. These screens show the starting point before consolidation.
              </p>
              <figure className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                <Zoomable src={LEGACY_DESIGNS[0].src} alt={LEGACY_DESIGNS[0].caption}>
                  <img src={LEGACY_DESIGNS[0].src} alt={LEGACY_DESIGNS[0].caption} className="w-full object-contain max-h-[480px]" loading="lazy" />
                </Zoomable>
                <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">{LEGACY_DESIGNS[0].caption}</figcaption>
              </figure>
              <div>
                <h3 className="font-semibold text-xl text-ink-900 mb-4">Original UEFI workflow details</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  {LEGACY_UEFI_STATES.map((img) => (
                    <figure key={img.src} className="rounded-2xl overflow-hidden border border-stone-200 bg-white">
                      <Zoomable src={img.src} alt={img.alt}>
                        <img src={img.src} alt={img.alt} className="w-full aspect-[1.72/1] object-contain bg-white" loading="lazy" />
                      </Zoomable>
                      <figcaption className="text-xs text-stone-500 px-5 py-3 border-t border-stone-100">{img.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <figure className="rounded-2xl overflow-hidden border border-stone-200 bg-white">
                <Zoomable src={LEGACY_DOCK_IDS.src} alt={LEGACY_DOCK_IDS.alt}>
                  <img src={LEGACY_DOCK_IDS.src} alt={LEGACY_DOCK_IDS.alt} className="w-full object-contain bg-white" loading="lazy" />
                </Zoomable>
                <figcaption className="text-xs text-stone-500 px-5 py-3 border-t border-stone-100">{LEGACY_DOCK_IDS.caption}</figcaption>
              </figure>
              <figure className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                <Zoomable src={LEGACY_DESIGNS[1].src} alt={LEGACY_DESIGNS[1].caption}>
                  <img src={LEGACY_DESIGNS[1].src} alt={LEGACY_DESIGNS[1].caption} className="w-full object-contain max-h-[480px]" loading="lazy" />
                </Zoomable>
                <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">{LEGACY_DESIGNS[1].caption}</figcaption>
              </figure>
            </div>
          </details>
        </motion.section>

        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="approach-heading"
        >
          <SectionEyebrow label="Approach" light />
          <h2 id="approach-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-5">
            From rough ideas to a shared direction
          </h2>
          <p className="text-stone-600 leading-relaxed max-w-3xl mb-10">
            We brainstormed the product structure and translated the strongest ideas into wireframes.
            I then revised the end-to-end UX flows, resolved interaction gaps with PMs and engineers,
            and created the high-fidelity experience in light and dark themes.
          </p>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { n: '01', title: 'Brainstorm', text: 'Align on product structure and opportunities.' },
              { n: '02', title: 'Wireframe', text: 'Compare workflow ideas quickly.' },
              { n: '03', title: 'Revise flows', text: 'Resolve gaps with PMs and engineers.' },
              { n: '04', title: 'Design hi-fi', text: 'Build the final light and dark experience.' },
            ].map(({ n, title, text }) => (
              <li key={n} className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-xs font-bold text-indigo-600 tracking-widest">{n}</span>
                <h3 className="font-semibold text-ink-900 mt-4 mb-2">{title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>

          <details className="case-artifact-details mt-10">
            <summary>Explore the wireframes and revised flows</summary>
            <div className="space-y-12">
              <div className="grid md:grid-cols-2 gap-5">
                {WIREFRAMES.map((img) => (
                  <figure key={img.src} className="rounded-2xl overflow-hidden border border-stone-200">
                    <Zoomable src={img.src} alt={img.caption}>
                      <img src={img.src} alt={img.caption} className="w-full object-cover" loading="lazy" />
                    </Zoomable>
                    <figcaption className="text-xs text-stone-400 px-5 py-3">{img.caption}</figcaption>
                  </figure>
                ))}
              </div>
              <figure className="rounded-2xl overflow-hidden border border-stone-200">
                <Zoomable src={FLOWCHART_IMG} alt="Revised user flow diagram for Surface IT Toolkit workflows">
                  <img src={FLOWCHART_IMG} alt="Revised user flow diagram for Surface IT Toolkit workflows" className="w-full object-cover" loading="lazy" />
                </Zoomable>
                <figcaption className="text-xs text-stone-400 px-5 py-3">Revised workflow map</figcaption>
              </figure>
            </div>
          </details>
        </motion.section>

        <section aria-labelledby="decisions-heading">
          <SectionEyebrow label="Key decisions" light />
          <h2 id="decisions-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-5">
            Two decisions that made complex work feel lighter
          </h2>
          <p className="text-stone-600 max-w-2xl mb-16">
            I focused on the moments that most affected comprehension and pace instead of documenting every design step.
          </p>

          <div className="space-y-24">
            <section aria-labelledby="device-decision-heading">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">Decision 01 · Data Eraser</p>
              <h3 id="device-decision-heading" className="font-bold text-2xl md:text-3xl text-ink-900">Start with the device, not its architecture</h3>
              <p className="text-stone-600 max-w-2xl mt-5">
                The legacy flow asked admins to choose x64 or ARM. The redesign starts with
                recognizable Surface families and models, then provides compatibility guidance.
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
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">Decision 02 · UEFI configuration</p>
              <h3 id="review-decision-heading" className="font-bold text-2xl md:text-3xl text-ink-900">Use a dynamic form to reduce unnecessary steps</h3>
              <p className="text-stone-600 max-w-2xl mt-5">
                I replaced a rigid sequence of setup screens with a dynamic form. It responds to
                each selection and reveals only the relevant fields, helping admins complete the
                configuration in fewer steps before reviewing and creating the package.
              </p>
              <div className="case-evidence-grid case-evidence-grid--pair">
                <CaseStudyFigure src={sitFinal6} alt="Dynamic UEFI dock configuration form showing only relevant component policies" caption="Dynamic form: relevant settings remain together in context" />
                <CaseStudyFigure src={sitFinal7} alt="UEFI dock configuration package review after the required selections are complete" caption="Review: verify the completed configuration before creating the package" />
              </div>
              <details className="case-artifact-details">
                <summary>Explore the full UEFI workflow canvas</summary>
                <CaseStudyFigure src={UEFI_SCREENSHOT} alt="UEFI Configurator workflow canvas" caption="Full UEFI workflow" />
              </details>
            </section>
          </div>
        </section>

        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="tradeoffs-heading"
        >
          <SectionEyebrow label="Constraints & tradeoffs" light />
          <h2 id="tradeoffs-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-10">
            Simplify the experience, not the expertise
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            <article className="p-6 md:p-8 rounded-2xl border border-stone-200 bg-stone-50">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">Terminology</p>
              <h3 className="font-semibold text-xl text-ink-900 mb-3">Designed for specialists</h3>
              <p className="text-stone-600 leading-relaxed">
                I wanted to simplify more of the language, but the audience was experienced IT
                administrators. Terms such as UEFI, certificates, and device architecture needed
                to remain precise, so I simplified the flow and hierarchy around them instead.
              </p>
            </article>
            <article className="p-6 md:p-8 rounded-2xl border border-stone-200 bg-stone-50">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">Research constraint</p>
              <h3 className="font-semibold text-xl text-ink-900 mb-3">What I could not validate before launch</h3>
              <p className="text-stone-600 leading-relaxed">
                I did not conduct usability testing before launch. With the limited timeline, we ran
                a quick persona workshop to align the team around IT admins’ goals, technical knowledge,
                and common tasks. It reduced conflicting assumptions, but it did not replace validation
                with users.
              </p>
            </article>
          </div>
        </motion.section>

        <motion.section
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="system-heading"
        >
          <motion.div variants={fadeUp}>
            <SectionEyebrow label="System & craft" light />
            <h2 id="system-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-5">
              Fluent foundations, with local patterns where needed
            </h2>
            <p className="text-stone-600 leading-relaxed max-w-3xl mb-10">
              I used Microsoft’s design system for typography, spacing, standard controls, and
              interaction behavior. When the available patterns did not support the toolkit’s
              conditional setup flows, I created a local dynamic form interaction that updates
              relevant fields and next steps based on an admin’s selections. I also created the
              custom icons, hero imagery, and supporting product visuals that carry the visual
              language across the toolkit.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 items-start mb-12">
            <CaseStudyFigure src={sitFinal2}
              alt="Dynamic Surface device setup form that updates family, model, and selected-device options"
              caption="Local pattern: a dynamic form for device family and model setup" />
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200">
              <Zoomable src={ICON_SET_IMG} alt="Customized icon set for Surface IT Toolkit">
                <img src={ICON_SET_IMG} alt="Customized icon set for Surface IT Toolkit" className="w-full object-cover" loading="lazy" />
              </Zoomable>
              <figcaption className="text-xs text-stone-400 px-5 py-3">Custom icons designed around toolkit operations</figcaption>
            </motion.figure>
          </div>
        </motion.section>
      </div>

      <section aria-labelledby="final-designs-heading" className="bg-zinc-950 py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mb-12">
            <div className="flex items-center gap-4 mb-10" aria-hidden="true">
              <span className="text-xs font-semibold tracking-[0.22em] uppercase text-stone-500">Final designs</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <h2 id="final-designs-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight">
              One visual system across the workflows
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FINAL_DESIGNS.map((img) => (
              <motion.figure key={img.src} variants={fadeUp} className="overflow-hidden">
                <Zoomable src={img.src} alt={img.alt}>
                  <img src={img.src} alt={img.alt} className="surface-design-image" loading="lazy" />
                </Zoomable>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="surface-light-showcase" aria-labelledby="light-designs-heading">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <h2 id="light-designs-heading">One component system, two themes</h2>
          <p className="text-stone-600 max-w-2xl mb-10">
            Figma variables connected the light and dark designs within a shared component system,
            preserving the same hierarchy and interaction patterns across both appearances.
          </p>
          <div className="surface-light-showcase__grid">
            {LIGHT_DESIGNS.map((img) => (
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

      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          aria-labelledby="outcome-heading"
        >
          <SectionEyebrow label="Outcome" light />
          <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <div>
              <h2 id="outcome-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-5">
                Shipped—and noticed
              </h2>
              <p className="text-stone-600 leading-relaxed text-lg">
                The toolkit shipped in April 2024 as a cohesive experience across its core tools,
                with shared navigation, interaction patterns, visual language, and light and dark themes.
                The redesign made a strong first impression with the product team and senior stakeholders.
              </p>
            </div>
            <blockquote className="case-outcome-quote p-8 md:p-10" aria-label="Stakeholder feedback">
              <p className="font-semibold text-2xl md:text-3xl leading-tight">
                &ldquo;Who&rsquo;s the designer?&rdquo;
              </p>
              <footer className="mt-5 text-sm leading-relaxed">
                <cite className="not-italic">A VP-level stakeholder’s first reaction when my PM presented the design.</cite>
              </footer>
            </blockquote>
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
