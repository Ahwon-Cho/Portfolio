/* ART: editorial project grid — featured hero card + supporting grid */
/* UX: removed filter tabs (6 projects, no need to fragment), company + metric visible on cards */
/* MOTION: staggered card entrance on scroll */
import { motion, useReducedMotion } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { projects as allData } from '../data/projects'

/* UX: define which projects to feature and in what order */
const FEATURED_SLUGS = [
  'gpuflight',
  'surface-it-toolkit',
  'blue-cross-cost-estimator',
  'home-depot-protection-plan',
  'pantry-note',
  'blue-connect-mobile-app',
]

const featured = FEATURED_SLUGS
  .map(slug => allData.find(p => p.slug === slug))
  .filter(Boolean)
  .map(p => ({
    id:          p.id,
    slug:        p.slug,
    title:       p.title,
    subtitle:    p.subtitle,
    type:        p.type,
    category:    p.category,
    company:     p.company,
    employment:  p.employment,
    role:        p.role,
    timeline:    p.timeline,
    tldr:        p.tldr,
    tags:        p.tags,
    image:       p.thumbnail,
  }))

export default function Projects() {
  const shouldReduce = useReducedMotion()

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 32 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: shouldReduce ? 0 : 0.1 } },
  }

  const [featuredProject, ...rest] = featured

  return (
    <section
      id="projects"
      aria-label="Selected work"
      className="py-28 md:py-36 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Section header */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="flex items-center gap-4 mb-20"
        >
          <span className="section-label text-stone-400">Selected Work</span>
          <div className="flex-1 h-px bg-stone-200" aria-hidden="true" />
        </motion.div>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="mb-16"
        >
          <h2 className="font-bold text-4xl md:text-5xl text-ink-900 leading-tight mb-3">
            Six selected projects.
          </h2>
          <p className="text-stone-500 text-base max-w-md">
            Enterprise software, mobile apps, healthcare, and developer tools —
            always shipped close to engineering.
          </p>
        </motion.div>

        {/* All 6 projects — 2-col grid, each card animates individually */}
        <div className="grid md:grid-cols-2 gap-6">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: shouldReduce ? 0 : 0.6, delay: shouldReduce ? 0 : (i % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={project} variant="default" index={i} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
