import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { getProjectBySlug, getAdjacentProjects } from '../data/projects'

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

const categoryColors = {
  'UX Design': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900',
  'Visual Design': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900',
  'Product Design': 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const project = getProjectBySlug(slug)
  const { prev, next } = getAdjacentProjects(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Project not found</h1>
        <Link to="/" className="btn-secondary">← Back to Home</Link>
      </div>
    )
  }

  const catColor = categoryColors[project.category] || categoryColors['UX Design']
  const displayCategories = project.categories || [project.category]

  return (
    <article className="min-h-screen bg-stone-50 dark:bg-stone-950 pt-16">
      {/* Hero */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-12 md:py-20">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-10 group"
          >
            <BackIcon />
            <span className="group-hover:underline">Back to Projects</span>
          </button>

          {/* Category + Company */}
          <div className="flex items-center gap-3 mb-6">
            {displayCategories.map(cat => (
              <span key={cat} className={`inline-flex items-center whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[cat] || catColor}`}>
                {cat}
              </span>
            ))}
            {project.company && (
              <span className="text-sm font-medium text-stone-500 dark:text-stone-500">
                {project.company}
              </span>
            )}
            {project.employment && (
              <span className="text-xs font-medium text-stone-400 dark:text-stone-500 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                {project.employment}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-stone-900 dark:text-stone-100 leading-tight mb-4">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl mb-10">
            {project.subtitle}
          </p>

          {/* TL;DR */}
          <div className="inline-flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 flex-shrink-0">TL;DR</span>
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{project.tldr}</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="bg-stone-100 dark:bg-stone-800">
        <div className="max-w-5xl mx-auto">
          <img
            src={project.image}
            alt={project.title}
            className="w-full object-cover max-h-[520px]"
          />
        </div>
      </div>

      {/* Metadata bar */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-1">Role</div>
              <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{project.role}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-1">Timeline</div>
              <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{project.timeline}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-1">Team</div>
              <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{project.team}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-600 dark:text-stone-400 mb-1">Type</div>
              <div className="text-sm font-medium text-stone-800 dark:text-stone-200">{project.type}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Body content */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 space-y-20">

        {/* Overview */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-600 dark:text-stone-400">Overview</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" aria-hidden="true" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-4 leading-snug">
                The Context
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{project.overview}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-4 leading-snug">
                The Problem
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{project.problem}</p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-600 dark:text-stone-400">Process</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-10">
            How I Approached It
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {project.process.map((step, i) => (
              <div key={step.phase} className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    {step.phase}
                  </h3>
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-600 dark:text-stone-400">Challenges</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-8">
            What Made This Hard
          </h2>
          <ul className="space-y-4">
            {project.challenges.map((c, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-600 mt-2 flex-shrink-0" />
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{c}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Outcomes */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-600 dark:text-stone-400">Outcomes</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-8">
            Results & Impact
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {project.outcomes.map((outcome, i) => (
              <div key={i} className="p-5 rounded-2xl bg-stone-900 dark:bg-stone-800 border border-stone-800 dark:border-stone-700">
                <div className="w-6 h-6 rounded-full bg-stone-700 dark:bg-stone-600 flex items-center justify-center mb-3">
                  <span className="text-xs font-bold text-stone-300" aria-label="Achieved">✓</span>
                </div>
                <p className="text-sm text-stone-300 leading-relaxed">{outcome}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Reflection */}
        {project.reflection && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-600 dark:text-stone-400">Reflection</span>
              <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-6">
              What I'd Do Differently
            </h2>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl">{project.reflection}</p>
          </section>
        )}

      </div>

      {/* Next / Prev navigation */}
      <div className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 py-12 grid grid-cols-2 gap-4">
          {prev ? (
            <Link to={`/project/${prev.slug}`} aria-label={`Previous project: ${prev.title}`} className="group flex flex-col gap-2 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-colors">
              <span className="text-xs text-stone-400 dark:text-stone-600 uppercase tracking-wide flex items-center gap-1">
                <BackIcon /> Previous
              </span>
              <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors line-clamp-1">
                {prev.title}
              </span>
            </Link>
          ) : <div />}

          {next ? (
            <Link to={`/project/${next.slug}`} aria-label={`Next project: ${next.title}`} className="group flex flex-col gap-2 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-colors text-right ml-auto w-full">
              <span className="text-xs text-stone-400 dark:text-stone-600 uppercase tracking-wide flex items-center justify-end gap-1">
                Next <ArrowIcon />
              </span>
              <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors line-clamp-1">
                {next.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      </div>
    </article>
  )
}
