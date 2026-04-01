/* ART: redesigned project detail — more breathing room, null image handled */
/* UX: back navigation, accessible landmark regions, outcome cards with amber accent */
/* MOTION: hero content fades in on mount */
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { getProjectBySlug, getAdjacentProjects } from '../data/projects'

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

const CATEGORY_STYLES = {
  'Product Design': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'UX Design':      'bg-blue-50    text-blue-700    border-blue-100',
  'Visual Design':  'bg-violet-50  text-violet-700  border-violet-100',
}

const PLACEHOLDER_GRADIENTS = [
  'from-violet-950 via-indigo-900 to-zinc-900',
  'from-zinc-800 via-stone-800 to-zinc-900',
  'from-emerald-950 via-teal-900 to-zinc-900',
]

export default function ProjectDetail() {
  const { slug }      = useParams()
  const navigate      = useNavigate()
  const project       = getProjectBySlug(slug)
  const { prev, next} = getAdjacentProjects(slug)
  const shouldReduce  = useReducedMotion()

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-950">
        <h1 className="text-2xl font-semibold text-stone-100">Project not found</h1>
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </div>
    )
  }

  const displayCategories = project.categories || [project.category]
  const projectIndex = slug.length % PLACEHOLDER_GRADIENTS.length

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 24 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <article className="min-h-screen bg-ink-50 pt-14" aria-label={`Case study: ${project.title}`}>

      {/* ── Project hero ──────────────────────────────────── */}
      <header className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: shouldReduce ? 0 : 0.1 } } }}
            initial="hidden" animate="show"
          >
            {/* Back button */}
            <motion.div variants={fadeUp}>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm text-stone-400 hover:text-stone-900 transition-colors mb-12 group"
                aria-label="Go back to previous page"
              >
                <BackIcon />
                <span className="group-hover:underline">All Work</span>
              </button>
            </motion.div>

            {/* Category + Company + Employment */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5 mb-6">
              {displayCategories.map(cat => (
                <span key={cat} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${CATEGORY_STYLES[cat] || CATEGORY_STYLES['UX Design']}`}>
                  {cat}
                </span>
              ))}
              {project.company && (
                <span className="text-sm font-medium text-stone-400">{project.company}</span>
              )}
              {project.employment && (
                <span className="text-xs font-medium text-stone-400 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {project.employment}
                </span>
              )}
              {project.wip && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-indigo-50 text-indigo-700 border-indigo-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" aria-hidden="true" />
                  Work in Progress
                </span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="font-bold text-4xl md:text-5xl lg:text-6xl text-ink-900 leading-tight mb-5"
            >
              {project.title}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg text-stone-500 leading-relaxed max-w-2xl mb-10">
              {project.subtitle}
            </motion.p>

            {/* TL;DR */}
            <motion.div
              variants={fadeUp}
              className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-100"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-700 flex-shrink-0">TL;DR</span>
              <p className="text-sm text-indigo-900 leading-relaxed">{project.tldr}</p>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* ── Hero image (or placeholder) ────────────────────── */}
      <div className="bg-stone-100">
        <div className="max-w-5xl mx-auto">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} — design preview`}
              className="w-full object-cover max-h-[520px]"
            />
          ) : (
            /* UX: null image handled — no broken img tag */
            <div className={`w-full h-64 md:h-96 bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[projectIndex]} flex items-center justify-center relative overflow-hidden`}>
              <span
                className="font-display italic text-[80px] md:text-[120px] font-normal text-white/10 select-none leading-none text-center px-8"
                aria-hidden="true"
              >
                {project.title}
              </span>
              <div className="absolute bottom-4 right-4 text-xs text-white/30 font-medium">
                Screenshots coming soon
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Metadata bar ──────────────────────────────────── */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { term: 'Role',     detail: project.role     },
              { term: 'Timeline', detail: project.timeline },
              { term: 'Team',     detail: project.team     },
              { term: 'Type',     detail: project.type     },
            ].map(({ term, detail }) => (
              <div key={term}>
                <dt className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1">{term}</dt>
                <dd className="text-sm font-medium text-ink-800">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-28 space-y-24">

        {/* Overview + Problem */}
        <section aria-labelledby="overview-heading">
          <div className="flex items-center gap-4 mb-10" aria-hidden="true">
            <span className="section-label">Overview</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 id="overview-heading" className="font-semibold text-2xl md:text-3xl text-ink-900 mb-4 leading-snug">
                The Context
              </h2>
              <p className="text-stone-600 leading-relaxed">{project.overview}</p>
            </div>
            <div>
              <h2 className="font-semibold text-2xl md:text-3xl text-ink-900 mb-4 leading-snug">
                The Problem
              </h2>
              <p className="text-stone-600 leading-relaxed">{project.problem}</p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section aria-labelledby="process-heading">
          <div className="flex items-center gap-4 mb-10" aria-hidden="true">
            <span className="section-label">Process</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <h2 id="process-heading" className="font-semibold text-2xl md:text-3xl text-ink-900 mb-10 leading-snug">
            How I Approached It
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {project.process.map((step, i) => (
              <div key={step.phase} className="p-6 rounded-2xl bg-white border border-stone-100">
                <div className="flex items-center gap-3 mb-4">
                  {/* ART: amber number for process steps */}
                  <span className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-700">
                    {step.phase}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section aria-labelledby="challenges-heading">
          <div className="flex items-center gap-4 mb-10" aria-hidden="true">
            <span className="section-label">Challenges</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <h2 id="challenges-heading" className="font-semibold text-2xl md:text-3xl text-ink-900 mb-8 leading-snug">
            What Made This Hard
          </h2>
          <ul className="space-y-4" role="list">
            {project.challenges.map((c, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" aria-hidden="true" />
                <p className="text-stone-600 leading-relaxed">{c}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Outcomes */}
        <section aria-labelledby="outcomes-heading">
          <div className="flex items-center gap-4 mb-10" aria-hidden="true">
            <span className="section-label">Outcomes</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>
          <h2 id="outcomes-heading" className="font-semibold text-2xl md:text-3xl text-ink-900 mb-8 leading-snug">
            Results &amp; Impact
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {project.outcomes.map((outcome, i) => (
              <div key={i} className="p-6 rounded-2xl bg-ink-900 border border-ink-800">
                {/* ART: amber check mark on dark outcome card */}
                <div className="w-6 h-6 rounded-full bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center mb-4">
                  <span className="text-xs font-bold text-indigo-400" aria-label="Achieved">✓</span>
                </div>
                <p className="text-sm text-stone-300 leading-relaxed">{outcome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reflection */}
        {project.reflection && (
          <section aria-labelledby="reflection-heading">
            <div className="flex items-center gap-4 mb-10" aria-hidden="true">
              <span className="section-label">Reflection</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <h2 id="reflection-heading" className="font-semibold text-2xl md:text-3xl text-ink-900 mb-6 leading-snug">
              What I'd Do Differently
            </h2>
            {/* ART: blockquote styling for reflection */}
            <blockquote className="border-l-2 border-indigo-400 pl-6">
              <p className="text-stone-600 leading-relaxed max-w-2xl">{project.reflection}</p>
            </blockquote>
          </section>
        )}
      </div>

      {/* ── Next / Prev ────────────────────────────────────── */}
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
