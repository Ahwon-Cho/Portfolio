/* Rich case study — Home Depot Protection Plan */
/* ART: editorial layout, honest narrative arc including the failure moment */
/* MOTION: scroll reveals, staggered sections */
import { Zoomable } from '../components/Lightbox'
import CaseStudyFigure from '../components/CaseStudyFigure'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
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
import hdUsertest2    from '../img/hd_usertest2.png'
import hdDevhandoff1  from '../img/hd_devhandoff1.png'
import hdDevhandoff2  from '../img/hd_devhandoff2.png'
import hdDevhandoff3  from '../img/hd_devhandoff3.png'
import hdReflection   from '../img/hd_reflection.png'

const SLUG = 'home-depot-protection-plan'

const DESIGN_COMPS = [
  { src: hdDesignComp1, alt: 'GM item design: option 1' },
  { src: hdDesignComp2, alt: 'GM item design: option 2' },
  { src: hdDesignComp3, alt: 'GM item design: option 3' },
  { src: hdDesignComp4, alt: 'GM item design: final selected' },
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
  usertest2:     hdUsertest2,
  devhandoff1:   hdDevhandoff1,
  devhandoff2:   hdDevhandoff2,
  devhandoff3:   hdDevhandoff3,
  reflection:    hdReflection,
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
    <article className="case-study" aria-label="Case study: Home Depot Protection Plan">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <motion.div variants={stagger} initial="hidden" animate="show">

            <motion.div variants={fadeUp}>
              <button onClick={() => navigate('/work')}
                className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-12 group"
                aria-label="Go back to all work">
                <BackIcon /><span className="group-hover:underline">All Work</span>
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-100">UX Design</span>
              <span className="text-sm font-medium text-stone-400">The Home Depot</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-bold text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-tight mb-5">
              Home Depot<br /><span className="text-stone-400 font-light">Protection Plan</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-stone-500 leading-relaxed max-w-2xl mb-10">
              Helping customers add a protection plan after checkout, from the Thank You
              or Order Details page.
            </motion.p>

            <motion.div variants={fadeUp}
              className="case-study-summary">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 flex-shrink-0">At a glance</span>
              <p className="text-sm text-indigo-900 leading-relaxed">
                Sole UX designer for the post-purchase experience. I expanded an initial
                General Merchandise design into flows for multiple product types, then
                supported prototype testing and engineering handoff.
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
              { term: 'Platform', detail: 'Web: homedepot.com'           },
              { term: 'Scope',    detail: 'Design, prototype & handoff'  },
            ].map(({ term, detail }) => (
              <div key={term}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{term}</dt>
                <dd className="text-sm font-medium text-ink-800">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="case-early-showcase" aria-label="Protection plan interface preview">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="case-evidence-grid case-evidence-grid--comparison">
            <CaseStudyFigure src={hdCollaboration} sourceWidth={3840}
              crop={{ x: 118, y: 359, width: 316, height: 655 }}
              alt="Protection plan drawer with plan options and add-to-cart actions"
              caption="Choose coverage for each purchased item" />
            <CaseStudyFigure src={hdCollaboration} sourceWidth={3840}
              crop={{ x: 505, y: 359, width: 316, height: 655 }}
              alt="Protection plan drawer with one plan added and another available to add"
              caption="Keep added and available plans distinguishable" />
          </div>
        </div>
      </section>

      {/* ── BODY ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Background */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="bg-heading">
          <Eyebrow label="Background" />
          <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
            <div>
              <h2 id="bg-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">
                Adding coverage after checkout
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>A customer who declined coverage at checkout may still want to add it later.
                  This project created a post-purchase path from the Thank You and Order Details pages.</p>
                <p>After checkout, a protection plan becomes
                  a separate item, and different product categories require different choices.
                  I needed to account for those choices within the same drawer.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
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
              Customers need to know which product a plan covers, what it costs,
              and whether they have added it to their cart.
            </p>
          </blockquote>
        </motion.section>

        {/* Challenges */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="challenges-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Challenges" />
            <h2 id="challenges-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">Different products needed different choices</h2>
            <p className="text-stone-500 mb-10 max-w-xl">The drawer had to account for product types, entry points, and the transition to a new design system.</p>
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
              { n: '01', title: 'Before and after checkout', body: 'During checkout, a protection plan is attached to the purchased product. After checkout, the plan is a separate item. The flows needed to reflect that difference.' },
              { n: '02', title: 'Two entry points', body: 'Customers could start from the Thank You page or return later through Order Details. Both paths needed to lead to the relevant products and plans.' },
              { n: '03', title: 'General Merchandise and Major Appliances', body: 'General Merchandise (GM) and Major Appliances (MA) have different plan options. I needed to cover single items, multiple items, and orders containing both categories.' },
              { n: '04', title: 'A design system in transition', body: 'Home Depot was adopting Stencil during the project. Some components were still being built, and there was no existing drawer example to follow.' },
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
            <DarkEyebrow label="First exploration" />
            <h2 id="first-solution-heading" className="font-bold text-3xl md:text-4xl text-stone-100 leading-tight mb-4">Three options for the first scenario</h2>
            <p className="text-stone-400 max-w-2xl">
              The first exploration focused on General Merchandise. The PM and design manager
              wanted a clearer relationship between the plan and the purchased item.
              I developed three options, then refined the selected direction.
            </p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                The first design missed other product scenarios
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>My initial GM design did not account for the choices needed for appliances or mixed orders. I had developed one scenario in detail before mapping the others.</p>
                <p>I used a <strong className="text-ink-800">5-whys review</strong> to examine where my approach had gone wrong. I then mapped all five scenarios before revising the drawer.</p>
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
            <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Post-mortem: 5 whys activity</figcaption>
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
              { n: '1', title: 'Map the complete flow', body: 'I mapped the five product scenarios and both entry points, including how protection plans behave before and after checkout. The team used this flowchart when reviewing changes.' },
              { n: '2', title: 'Component variants for the different states', body: "Built Figma component variants to represent item categories and selection states within the same design system." },
              { n: '3', title: 'Use a button to add coverage', body: 'The team agreed to replace the add-plan checkbox with a button, matching how customers add products elsewhere on the site.' },
              { n: '4', title: 'Shared naming for handoff', body: 'Created a naming system for components and layers so engineers and designers had a consistent reference when discussing the files.' },
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
          <table className="case-scenario-table">
            <caption className="sr-only">How product categories affected the post-purchase design</caption>
            <thead><tr><th scope="col">Scenario</th><th scope="col">What the design needed to account for</th></tr></thead>
            <tbody>
              <tr><th scope="row">General Merchandise</th><td>Single- and multi-item states; keep each plan associated with its purchased item.</td></tr>
              <tr><th scope="row">Major Appliances</th><td>Single- and multi-item states; distinguish choosing a coverage option from adding it.</td></tr>
              <tr><th scope="row">Mixed items</th><td>Show different plan choices together without losing the relationship to each product.</td></tr>
            </tbody>
          </table>
          <motion.div variants={stagger} className="mt-10 space-y-5">
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200">
              <ZoomImg src={IMG.solution} alt="Multi-component system with variants" className="w-full object-cover" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Component system with variants for rapid prototyping</figcaption>
            </motion.figure>
            <motion.figure variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200">
              <ZoomImg src={IMG.flowchart} alt="Full post-purchase flowchart: bird's-eye view" className="w-full object-cover" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Full flowchart: bird's-eye view of the entire HDPP experience</figcaption>
            </motion.figure>
          </motion.div>
        </motion.section>

        {/* Collaboration */}
        <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="collab-heading">
          <Eyebrow label="Collaboration" />
          <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <h2 id="collab-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">Separating plan selection from adding to cart</h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>The GM design used a checkbox to add a plan. For appliances, that checkbox sat beside two radio buttons for choosing coverage. It mixed two different actions in a small space.</p>
                <p>We discussed adding a “reject” option, but the site already used buttons to add products. A separate add-to-cart button gave selecting coverage and buying it distinct controls.</p>
                <p>I worked with the other teams to use that button pattern throughout the protection plan flow.</p>
              </div>
            </div>
            <figure className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
              <ZoomImg src={IMG.collaboration} alt="GM multi-item vs MA interaction comparison" className="w-full object-contain max-h-[480px]" />
              <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">Checkbox vs. CTA button: collaboration and consistency discussion</figcaption>
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
            <p className="text-stone-400 max-w-xl">I built the prototype with versions for both the legacy design system and Stencil.</p>
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
            <h2 id="testing-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">Testing raised questions about pricing</h2>
            <p className="text-stone-500 mb-10 max-w-xl">Some participants responded positively, while others had questions about the price and plan choices. The session notes below show that mixed feedback.</p>
          </motion.div>
          <div className="grid md:grid-cols-1 gap-5">
            {[
              { src: IMG.usertest2, caption: 'User testing: session 2' },
            ].map((img, i) => (
              <motion.figure key={i} variants={fadeUp} className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                <ZoomImg src={img.src} alt={img.caption} className="w-full object-contain max-h-80" />
                <figcaption className="text-xs text-stone-400 px-5 py-3 border-t border-stone-100">{img.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
          <motion.div variants={fadeUp} className="mt-8 p-6 rounded-2xl bg-white border border-stone-100">
            <div className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">What I would test next</div>
            <p className="text-lg font-medium text-ink-800">
              Check whether customers understand
              which item is covered, the plan price, and the difference between selecting and adding coverage.
            </p>
          </motion.div>
        </motion.section>

        {/* Dev Handoff */}
        <motion.section variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} aria-labelledby="handoff-heading">
          <motion.div variants={fadeUp}>
            <Eyebrow label="Dev Handoff & Reviews" />
            <h2 id="handoff-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-4">Specs for both design systems</h2>
            <p className="text-stone-500 mb-10 max-w-xl">
              During the Stencil transition, some design assets weren't being implemented correctly.
              I added spacing and typography annotations and supplied designs for both systems,
              so engineers could use the version they were implementing.
            </p>
          </motion.div>
          <div className="space-y-5">
            {[
              { src: IMG.devhandoff1, caption: 'Dev handoff: annotated spec' },
              { src: IMG.devhandoff2, caption: 'Dev handoff: redlines with spacing and typography' },
              { src: IMG.devhandoff3, caption: 'Dev handoff: dual design system comps (legacy + Stencil)' },
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
              <h2 id="reflection-heading" className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-6">What I would do differently</h2>
              <div className="space-y-6">
                <blockquote className="border-l-2 border-indigo-500 pl-8">
                  <p className="text-stone-600 leading-relaxed text-lg">
                    I would map all product scenarios before refining the first screen.
                    The initial GM design looked ready, but it did not cover appliance and mixed orders.
                  </p>
                </blockquote>
                <p className="text-stone-500 leading-relaxed">
                  My contribution covered the designs, prototype, review feedback, and handoff.
                  Reviewing those flows together earlier would have helped me spot the missing
                  states before developing the detailed UI.
                </p>
              </div>
              <motion.figure className="mt-8 rounded-2xl overflow-hidden border border-stone-200">
                <ZoomImg src={IMG.reflection} alt="Reflection: project closing" className="w-full object-cover" />
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
                Recognition from the Home Depot design team
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
