/* ART: two variants — featured (horizontal hero) and default (vertical) */
/* UX: company, role, and metric visible without clicking; null image handled gracefully */
/* MOTION: hover lift, arrow reveal, image zoom */
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M7 17L17 7M7 7h10v10"/>
    </svg>
  )
}

const CATEGORY_STYLES = {
  'Product Design': 'bg-emerald-50  text-emerald-700  border-emerald-100',
  'UX Design':      'bg-blue-50     text-blue-700     border-blue-100',
  'Visual Design':  'bg-violet-50   text-violet-700   border-violet-100',
}

/* ART: gradient placeholders for null images — each feels intentional */
const PLACEHOLDER_GRADIENTS = [
  'from-violet-950 via-indigo-900 to-zinc-900',
  'from-zinc-800   via-stone-800  to-zinc-900',
  'from-emerald-950 via-teal-900  to-zinc-900',
  'from-rose-950    via-pink-900  to-zinc-900',
  'from-amber-950   via-orange-900 to-zinc-900',
]

/* Short metric extracted from tldr — first clause only */
function metricFromTldr(tldr) {
  if (!tldr) return null
  const match = tldr.match(/^([^.—–]+[.—–])/)
  return match ? match[1].replace(/\.$/, '') : tldr.split('.')[0]
}

/* ── Featured variant — full-width horizontal card ───────────── */
function FeaturedCard({ project }) {
  const catStyle = CATEGORY_STYLES[project.category] || CATEGORY_STYLES['UX Design']
  const metric   = metricFromTldr(project.tldr)

  return (
    <Link
      to={`/project/${project.slug}`}
      aria-label={`View case study: ${project.title}`}
      className="group block rounded-2xl overflow-hidden border border-stone-100 bg-white hover:border-stone-300 transition-all duration-300 hover:shadow-2xl"
    >
      <div className="grid md:grid-cols-2 min-h-[360px]">

        {/* Left: content */}
        <div className="flex flex-col justify-between p-8 md:p-10 lg:p-12">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${catStyle}`}>
                {project.category}
              </span>
              {project.company && (
                <span className="text-xs font-medium text-stone-400 px-2.5 py-0.5 rounded-full border border-stone-200">
                  {project.company}
                </span>
              )}
              {project.wip && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
                  Work in Progress
                </span>
              )}
            </div>

            {/* ART: Playfair Display for featured title — editorial weight */}
            <h3 className="font-bold text-3xl md:text-4xl text-ink-900 leading-tight mb-3 group-hover:text-ink-700 transition-colors">
              {project.title}
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-6 max-w-sm">
              {project.subtitle}
            </p>

            {/* UX: metric badge — the number that proves the work */}
            {metric && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100">
                <span className="w-1 h-1 rounded-full bg-amber-400" aria-hidden="true" />
                <span className="text-xs font-medium text-amber-800">{metric}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-100">
            <div>
              <div className="text-xs text-stone-400 mb-0.5">Role</div>
              <div className="text-sm font-medium text-stone-700">{project.role}</div>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-medium text-stone-400 group-hover:text-ink-900 group-hover:gap-2.5 transition-all duration-200">
              View Case Study <ArrowIcon />
            </span>
          </div>
        </div>

        {/* Right: image or styled placeholder */}
        <div className="relative overflow-hidden min-h-[240px] md:min-h-0">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} design preview`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            /* ART: placeholder as design feature — dark gradient with title watermark */
            <div className={`w-full h-full bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[0]} flex items-center justify-center relative`}>
              <span
                className="font-display italic text-[72px] md:text-[96px] font-normal text-white/8 select-none leading-none text-center px-6 group-hover:text-white/12 transition-colors duration-500"
                aria-hidden="true"
              >
                {project.title}
              </span>
              <div className="absolute bottom-4 right-4 text-xs text-white/30 font-medium">
                Screenshots coming soon
              </div>
            </div>
          )}
          {/* Overlay arrow */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-ink-900 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-lg">
            <ArrowIcon />
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ── Default variant — vertical card ─────────────────────────── */
function DefaultCard({ project, index = 0 }) {
  const catStyle   = CATEGORY_STYLES[project.category] || CATEGORY_STYLES['UX Design']
  const gradient   = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length]
  const metric     = metricFromTldr(project.tldr)

  return (
    <Link
      to={`/project/${project.slug}`}
      aria-label={`View case study: ${project.title}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-stone-300 card-hover cursor-pointer h-full"
    >
      {/* Image / placeholder */}
      <div className="relative overflow-hidden h-80 flex-shrink-0">
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} design preview`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span
              className="font-display italic text-5xl font-normal text-white/10 select-none"
              aria-hidden="true"
            >
              {project.title.split(' ')[0]}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
        {/* Arrow reveal */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-ink-900 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-md">
          <ArrowIcon />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${catStyle}`}>
            {project.category}
          </span>
          {project.company && (
            <span className="text-xs text-stone-400 font-medium">{project.company}</span>
          )}
          {project.wip && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
              WIP
            </span>
          )}
        </div>

        <h3 className="text-base font-semibold text-ink-900 mb-1 leading-snug group-hover:text-ink-700 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-stone-400 mb-3">{project.role}</p>
        <p className="text-sm text-stone-500 leading-relaxed line-clamp-2 flex-1">
          {project.subtitle}
        </p>

        {/* UX: metric — visible without clicking */}
        {metric && (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <p className="text-xs text-amber-700 font-medium line-clamp-1">{metric}</p>
          </div>
        )}
      </div>
    </Link>
  )
}

/* ── Export ──────────────────────────────────────────────────── */
export default function ProjectCard({ project, variant = 'default', index = 0 }) {
  if (variant === 'featured') return <FeaturedCard project={project} />
  return <DefaultCard project={project} index={index} />
}
