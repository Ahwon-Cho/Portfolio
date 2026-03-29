import { useState } from 'react'
import ProjectCard from './ProjectCard'
import { projects as allProjectsData } from '../data/projects'

// Map data file projects to card-compatible shape
const allProjects = allProjectsData.map((p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  type: p.type,
  category: p.category,
  description: p.overview,
  tags: p.tags,
  image: p.thumbnail,
}))


const filters = ['All', 'UX Design', 'Visual Design', 'Product Design']

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter)

  return (
    <section id="projects" className="py-24 md:py-32 bg-stone-50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500">03 — Work</span>
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-stone-900 dark:text-stone-100 leading-tight">
              Selected Projects
            </h2>
            <p className="mt-3 text-stone-500 dark:text-stone-500 max-w-lg">
              {filtered.length} projects across enterprise, consumer, and brand design.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === filter
                  ? 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 shadow-sm'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  )
}
