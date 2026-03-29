import { Link } from 'react-router-dom'

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M7 17L17 7M7 7h10v10"/>
    </svg>
  )
}

const categoryColors = {
  'UX Design': 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900',
  'Visual Design': 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900',
  'Product Design': 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
}

const gradients = [
  'from-slate-100 to-blue-100 dark:from-slate-800 dark:to-blue-900/40',
  'from-stone-100 to-purple-100 dark:from-stone-800 dark:to-purple-900/40',
  'from-zinc-100 to-emerald-100 dark:from-zinc-800 dark:to-emerald-900/40',
  'from-neutral-100 to-orange-100 dark:from-neutral-800 dark:to-orange-900/40',
  'from-gray-100 to-teal-100 dark:from-gray-800 dark:to-teal-900/40',
  'from-slate-100 to-rose-100 dark:from-slate-800 dark:to-rose-900/40',
]

export default function ProjectCard({ project, index }) {
  const gradient = gradients[index % gradients.length]
  const primaryCategory = project.category
  const catColor = categoryColors[primaryCategory] || categoryColors['UX Design']

  return (
    <Link to={`/project/${project.slug}`} className="group relative flex flex-col bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 card-hover cursor-pointer">
      {/* Image area */}
      <div className={`relative overflow-hidden h-52 ${!project.image ? `bg-gradient-to-br ${gradient}` : 'bg-stone-100 dark:bg-stone-800'}`}>
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm border border-white/40 dark:border-stone-700/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl select-none">{project.emoji || '✦'}</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-300" />
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <ArrowIcon />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${catColor}`}>
            {project.category}
          </span>
        </div>

        <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100 mb-1 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-xs text-stone-400 dark:text-stone-600 mb-2">{project.type}</p>
        <p className="text-sm text-stone-500 dark:text-stone-500 leading-relaxed line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <div className="flex gap-2">
            {project.tags?.map((tag) => (
              <span key={tag} className="text-xs text-stone-400 dark:text-stone-600">#{tag}</span>
            ))}
          </div>
          <span className="text-stone-400 dark:text-stone-600 group-hover:text-stone-600 dark:group-hover:text-stone-400 transition-colors">
            <ArrowIcon />
          </span>
        </div>
      </div>
    </Link>
  )
}
