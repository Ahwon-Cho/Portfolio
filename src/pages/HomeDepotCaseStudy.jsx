/* Rich case study — Home Depot Protection Plan */
/* ART: editorial layout, honest narrative arc including the failure moment */
/* MOTION: scroll reveals, staggered sections */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { getAdjacentProjects } from '../data/projects'
import hdDesignComp1  from '../img/hd_design_comp1.png'
import hdDesignComp2  from '../img/hd_design_comp2.png'
import hdDesignComp3  from '../img/hd_design_comp3.png'
import hdDesignComp4  from '../img/hd_design_comp4.png'
import hdChallenge1   from '../img/hd_challenge1.png'
import hdChallenge2   from '../img/hd_challenge2.png'
import hdSolution     from '../img/hd_solution.png'
import hdProcess      from '../img/hd_process.png'
import hdPostmortem   from '../img/hd_postmortem.png'
import hdFlowchart    from '../img/hd_flowchart.png'
import hdCollaboration from '../img/hd_collaboration.png'
import hdPrototype    from '../img/hd_prototype.png'
import hdUsertest1    from '../img/hd_usertest1.png'
import hdUsertest2    from '../img/hd_usertest2.png'
import hdDevhandoff1  from '../img/hd_devhandoff1.png'
import hdDevhandoff2  from '../img/hd_devhandoff2.png'
import hdDevhandoff3  from '../img/hd_devhandoff3.png'
import hdReflection   from '../img/hd_reflection.png'

const SLUG = 'home-depot-protection-plan'

const DESIGN_COMPS = [
  { src: hdDesignComp1, alt: 'GM item design — option 1' },
  { src: hdDesignComp2, alt: 'GM item design — option 2' },
  { src: hdDesignComp3, alt: 'GM item design — option 3' },
  { src: hdDesignComp4, alt: 'GM item design — final selected' },
]

const IMG = {
  challenge1:    hdChallenge1,
  challenge2:    hdChallenge2,
  solution:      hdSolution,
  process:       hdProcess,
  postmortem:    hdPostmortem,
  flowchart:     hdFlowchart,
  collaboration: hdCollaboration,
  prototype:     hdPrototype,
  usertest1:     hdUsertest1,
  usertest2:     hdUsertest2,
  devhandoff1:   hdDevhandoff1,
  devhandoff2:   hdDevhandoff2,
  devhandoff3:   hdDevhandoff3,
  reflection:    hdReflection,
}

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
        <motion.img
          src={src} alt={alt}
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
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
export default function HomeDepotCaseStudy() {
  const navigate = useNavigate()
  const { prev, next } = getAdjacentProjects(SLUG)
  const shouldReduce = useReducedMotion()

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 28 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] } },
  }
  const stagger = { hidden: {}, show: { transition: { staggerChildren: shouldReduce ? 0 : 0.08 } } }

  return (
    <article className="min-h-screen bg-ink-50 pt-14" aria-label="Case study: Home Depot Protection Plan">

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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-100">UX Design</span>
              <span className="text-sm font-medium text-stone-400">The Home Depot</span>
              <span className="text-xs font-medium text-stone-400 px-2.5 py-0.5 rounded-full border border-stone-200">Contract</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-bold text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-tight mb-5">
              Home Depot<br /><span className="text-stone-400 font-light">Protection Plan</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-stone-500 leading-relaxed max-w-2xl mb-10">
              Designing the post-purchase protection plan experience from zero — enabling customers
              to add coverage after checkout across a complex web of flows, item types, and two design systems in parallel.
            </motion.p>

            <motion.div variants={fadeUp}
              className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 flex-shrink-0">TL;DR</span>
              <p className="text-sm text-indigo-900 leading-relaxed">
                Sole designer on a zero-to-one post-purchase experience at The Home Depot. Shipped GM items in week one,
                hit edge cases, ran a 5-whys post-mortem, rebuilt flowchart-first — and earned the company design award.
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
              { term: 'Role',     detail: 'UX Designer (Sole)'            },
              { term: 'PM',       detail: 'Carrie Samples'                },
              { term: 'Platform', detail: 'Web — homedepot.com'           },
              { term: 'Outcome',  detail: '"CAUGHT ORANGE HANDED" Award'  },
            ].map(({ term, detail }) => (
              <div key={term}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{term}</dt>
                <dd className="text-sm font-medium text-ink-800">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Background */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="bg-heading">
          <Eyebrow label="Background" />
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
            <div>
              <h2 id="bg-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
                You declined the protection plan.
                <span className="font-light text-ink-500"> Then changed your mind.</span>
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>Imagine you're buying a new freezer. At checkout, a popup offers you a protection plan. You skip it — over budget. But while waiting for delivery, you start to worry. You have a bit extra. Now you want the plan.</p>
                <p>Until this project, The Home Depot had no way to do that. Protection plans were only available at point of purchase. Once you declined, that was it — even in unforeseen circumstances.</p>
                <p>User research confirmed this was a real pain point: customers wanted post-purchase protection but couldn't get it. The business opportunity was clear: add a protection plan button to Order History and open a new revenue stream. No one had built the UX for it yet.</p>
                <p className="text-stone-500 italic">When I joined, the team had been working without UX support for months and had already started building parts of the post-purchase experience.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { value: '1 wk',   label: 'To deliver the first GM design' },
                { value: '3',      label: 'Options presented, 1 selected'  },
                { value: '2',      label: 'Design systems navigated'        },
                { value: '5 whys', label: 'Post-mortem method used'        },
              ].map(({ value, label }) => (
                <div key={label} className="p-5 rounded-2xl border border-stone-200 bg-white">
                  <div className="font-bold text-2xl text-ink-900 mb-1">{value}</div>
                  <div className="text-xs text-stone-500 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Problem Statement */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}>
          <Eyebrow label="Problem Statement" />
          <blockquote className="border-l-2 border-indigo-500 pl-8 max-w-3xl">
            <p className="text-xl md:text-2xl text-ink-800 leading-relaxed font-medium">
              "How might we create a post-purchase protection plan experience with intuitive UI and
              streamlined flow — so customers can add coverage without confusion between the
              purchase and post-purchase experience?"
            </p>
          </blockquote>
        </motion.section>

        {/* Challenges */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="challenges-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Challenges" />
            <h2 id="challenges-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">Four layers of complexity</h2>
            <p className="text-stone-500 mb-10 max-w-xl">This wasn't a simple add-a-button project. The flows were deeply branched — and the edge cases multiplied fast.</p>
          </motion.div>

          {/* Challenge images */}
          <motion.div variants={stagger} className="grid md:grid-cols-2 gap-4 mb-10">
            {[
              { src: IMG.challenge1, alt: 'During-purchase vs post-purchase flow comparison' },
              { src: IMG.challenge2, alt: 'General Merchandise vs Major Appliances item types' },
            ].map((img, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-white">
                <ZoomImg src={img.src} alt={img.alt} className="w-full object-contain max-h-80" />
              </motion.figure>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              { n: '01', title: 'Same goal, two different flows', body: "Buying a plan during checkout vs. after checkout puts the system in completely different states. During purchase, HDPP is attached to the anchor item. Post-purchase, it becomes its own individual item — different logic, different flow." },
              { n: '02', title: 'Two entry points, two interactions', body: "The post-purchase experience could start from the Thank You page or the Order Details page. Each has a different purpose — and therefore a different interaction model, even though they're reaching the same end state." },
              { n: '03', title: 'GM vs. Major Appliances', body: 'The protection plan experience splits into GM and MA item categories. The system treats them differently, and the user flows for each were entirely distinct — each with its own edge cases.' },
              { n: '04', title: 'Mid-project design system transition', body: "The Home Depot was adopting Stencil, its new design system, mid-project. Required components weren't fully built yet — and there were no existing examples of drawers in the new system." },
            ].map(({ n, title, body }) => (
              <motion.div key={n} variants={fadeUp} className="p-6 rounded-2xl bg-white border border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700">{title}</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>

      {/* ── FIRST SOLUTION — dark section ───────────────────── */}
      <section className="bg-zinc-950 py-24" aria-labelledby="first-solution-heading">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mb-12">
            <DarkEyebrow label="The First Win" />
            <h2 id="first-solution-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight mb-4">One week. Three options. One decision.</h2>
            <p className="text-stone-400 max-w-2xl">
              My first task: review and redesign the GM item UI the dev team was about to ship.
              The PM and design manager wanted a layout that clearly showed the relationship between
              the protection plan and the anchor item. I delivered three options in a week — everyone liked the direction.
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DESIGN_COMPS.map((img, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-xl overflow-hidden bg-zinc-900">
                <Zoomable src={img.src} alt={img.alt}>
                  <img src={img.src} alt={img.alt} className="w-full object-contain" loading={i < 2 ? 'eager' : 'lazy'} />
                </Zoomable>
              </motion.figure>
            ))}
          </motion.div>

          {/* Process overview */}
          <motion.figure variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="mt-6 rounded-2xl overflow-hidden">
            <ZoomImg src={IMG.process} alt="Design process overview" className="w-full object-cover" />
          </motion.figure>
        </div>
      </section>

      {/* ── FAILURE + RECOVERY ──────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* The failure */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="failure-heading">
          <Eyebrow label="The Hard Part" />
          <div className="grid md:grid-cols-[3fr_2fr] gap-12 items-start">
            <div>
              <h2 id="failure-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
                The GM design worked perfectly.
                <span className="font-light text-ink-500"> For GM items only.</span>
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>The design solved the problem — but only for the scenario I had designed it for. When applied to MA single items, MA multi items, and mixed GM/MA drawers, it broke down. The flows were different enough that my solution didn't generalize.</p>
                <p>Instead of patching it, I ran a <strong className="text-ink-800">5-whys post-mortem</strong> on my own process. The root cause: I had designed for one scenario without mapping all five first. I was solving from inside the problem instead of stepping back to see the full system.</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-700 text-stone-300">
              <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-4">5-Whys Root Cause</div>
              <div className="space-y-3">
                {[
                  "Why did the design fail for MA? → It assumed GM item behavior.",
                  "Why? → I designed for one scenario without mapping all five.",
                  "Why? → I didn't have a bird's-eye view of the full flow.",
                  "Why? → No flowchart existed to make the system visible.",
                  "Why? → No one had created one yet.",
                ].map((q, i) => (
                  <div key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="text-indigo-400 font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-stone-700 text-sm text-indigo-300 font-medium">Fix: build the flowchart first.</div>
            </div>
          </div>
          {/* Post mortem image */}
          <motion.figure className="mt-10 rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
            <ZoomImg src={IMG.postmortem} alt="5-whys post-mortem activity" className="w-full object-contain max-h-[480px]" />
            <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Post-mortem — 5 whys activity</figcaption>
          </motion.figure>
        </motion.section>

        {/* Solution — flowchart + component system */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="solution-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Solution" />
            <h2 id="solution-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-10">How I rebuilt the approach</h2>
          </motion.div>
          <div className="space-y-5">
            {[
              { n: '1', title: 'Flowchart-first, from start to finish', body: "Created a detailed flowchart covering the entire experience — during-purchase and post-purchase, all five item type scenarios, both entry points. Starting from the post-purchase section and working outward until every path was mapped. This became the team's shared reference and single source of truth for all collaboration." },
              { n: '2', title: 'Multi-component system for rapid iteration', body: "Built a Figma component system with variants for every state and scenario. This dramatically sped up prototyping and ensured every screen stayed aligned with The Home Depot's design system — no one-off decisions that would cause drift." },
              { n: '3', title: 'CTA over checkbox — interaction consistency', body: 'MA items originally used a checkbox for adding plans, while the rest of the site used CTA buttons for adding products. After discussion, the team agreed on CTA buttons across the board — consistent with interaction patterns users already understood.' },
              { n: '4', title: 'Intuitive naming convention for handoff', body: 'Created a shared naming system for components and layers so engineers and other designers could navigate the Figma files without a guided tour. Reduced implementation back-and-forth significantly.' },
            ].map(({ n, title, body }) => (
              <motion.div key={n} variants={fadeUp}
                className="flex gap-6 p-6 rounded-2xl border border-stone-100 bg-white hover:border-stone-300 transition-colors duration-200">
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

          {/* Solution + Flowchart images */}
          <motion.div variants={stagger} className="mt-10 space-y-5">
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200">
              <ZoomImg src={IMG.solution} alt="Multi-component system with variants" className="w-full object-cover" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Component system with variants for rapid prototyping</figcaption>
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200">
              <ZoomImg src={IMG.flowchart} alt="Full post-purchase flowchart — bird's-eye view" className="w-full object-cover" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Full flowchart — bird's-eye view of the entire HDPP experience</figcaption>
            </motion.figure>
          </motion.div>
        </motion.section>

        {/* Collaboration */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="collab-heading">
          <Eyebrow label="Collaboration" />
          <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <h2 id="collab-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">Aligning across teams on interaction consistency</h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>GM multi-item interactions felt intuitive — checkboxes worked fine there, and the "Protection Plan Added" green label was clear. But Major Appliance items with two options were a different story.</p>
                <p>The checkbox in the top-left looked cluttered next to two radio buttons. There was extensive debate about whether to add a "reject" radio button. Meanwhile, the product listing and detail pages already used CTA buttons for adding items — so using a checkbox for protection plans was an inconsistency that would confuse users.</p>
                <p>After cross-team discussion, we landed on CTA buttons across the entire HDPP experience — aligning with how the rest of homedepot.com handles product additions.</p>
              </div>
            </div>
            <figure className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <ZoomImg src={IMG.collaboration} alt="GM multi-item vs MA interaction comparison" className="w-full object-contain max-h-[480px]" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Checkbox vs. CTA button — collaboration and consistency discussion</figcaption>
            </figure>
          </div>
        </motion.section>

      </div>

      {/* ── PROTOTYPE — dark section ─────────────────────────── */}
      <section className="bg-zinc-950 py-24" aria-labelledby="prototype-heading">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} className="mb-10">
            <DarkEyebrow label="Prototype" />
            <h2 id="prototype-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight mb-4">High-fidelity prototype</h2>
            <p className="text-stone-400 max-w-xl">After countless iterations and coordination across Home Depot teams, the design reached prototype stage — built to reflect both the legacy and Stencil design systems.</p>
          </motion.div>
          <motion.figure variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="rounded-2xl overflow-hidden">
            <ZoomImg src={IMG.prototype} alt="High-fidelity HDPP post-purchase prototype" className="w-full object-cover" />
          </motion.figure>
        </div>
      </section>

      {/* ── USER TESTING + DEV HANDOFF ───────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* User Testing */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="testing-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="User Testing" />
            <h2 id="testing-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">"Easier than expected."</h2>
            <p className="text-stone-500 mb-10 max-w-xl">The simplified HDPP post-purchase drawer was user-tested before launch. The result validated the interaction redesign.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { src: IMG.usertest1, caption: 'User testing — session 1' },
              { src: IMG.usertest2, caption: 'User testing — session 2' },
            ].map((img, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                <ZoomImg src={img.src} alt={img.caption} className="w-full object-contain max-h-80" />
                <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">{img.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
          <motion.div variants={fadeUp} className="mt-8 p-6 rounded-2xl bg-white border border-stone-100">
            <div className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Test Finding</div>
            <p className="text-lg font-medium text-ink-800">
              Users described the interaction as <span className="text-indigo-600">"easier than expected"</span> — a direct signal that the redesign successfully reduced the confusion between purchase and post-purchase flows.
            </p>
          </motion.div>
        </motion.section>

        {/* Dev Handoff */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="handoff-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Dev Handoff & Reviews" />
            <h2 id="handoff-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">Closing the implementation gap</h2>
            <p className="text-stone-500 mb-10 max-w-xl">
              During the Stencil transition, some design assets weren't being implemented correctly.
              I took initiative to redline every screen with detailed annotations — and created two final comp sets
              (legacy + Stencil) so engineering had what they needed regardless of where implementation stood.
            </p>
          </motion.div>
          <div className="space-y-5">
            {[
              { src: IMG.devhandoff1, caption: 'Dev handoff — annotated spec' },
              { src: IMG.devhandoff2, caption: 'Dev handoff — redlines with spacing and typography' },
              { src: IMG.devhandoff3, caption: 'Dev handoff — dual design system comps (legacy + Stencil)' },
            ].map((img, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                <ZoomImg src={img.src} alt={img.caption} className="w-full object-contain max-h-[520px]" />
                <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">{img.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.section>

        {/* Reflection */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="reflection-heading">
          <Eyebrow label="Reflection" />
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
            <div>
              <h2 id="reflection-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">The failure was the turning point</h2>
              <div className="space-y-6">
                <blockquote className="border-l-2 border-indigo-500 pl-8">
                  <p className="text-stone-600 leading-relaxed text-lg">
                    "The GM design working felt like a win. But it was failing at the edges that taught me the most.
                    Running the 5-whys on my own process — not as a blame exercise, but as a diagnostic —
                    changed how I approach complex, multi-state design problems."
                  </p>
                </blockquote>
                <p className="text-stone-500 leading-relaxed">
                  Our team completed Stencil Ops reviews faster than peer teams at Home Depot — among the first to do so.
                  Although I left before the final product launched, user testing confirmed the design worked.
                  I'm proud of what the team shipped together.
                </p>
              </div>
              <motion.figure className="mt-8 rounded-2xl overflow-hidden border border-stone-200">
                <ZoomImg src={IMG.reflection} alt="Reflection — project closing" className="w-full object-cover" />
              </motion.figure>
            </div>
            {/* Award card */}
            <div className="p-7 rounded-2xl bg-zinc-950 border border-white/8 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                <span className="text-2xl" role="img" aria-label="Award">🏅</span>
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">Recognition</div>
              <div className="font-bold text-stone-100 text-lg mb-2 leading-snug">"CAUGHT ORANGE HANDED"</div>
              <div className="text-xs text-stone-400 leading-relaxed">
                Home Depot Design Team award<br />from Senior Manager Maggie Bruns<br />and Director Kristina Bosland
              </div>
              <div className="mt-5 pt-4 border-t border-white/8 text-xs text-stone-500">
                Awarded for adopting Stencil faster than peer teams and driving design consistency across a complex, multi-team project.
              </div>
            </div>
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
