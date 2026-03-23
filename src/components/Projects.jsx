import { useState } from 'react'
import ProjectCard from './ProjectCard'

const allProjects = [
  {
    id: 1,
    title: 'Surface IT Toolkit',
    type: 'Windows application',
    category: 'UX Design',
    description: 'Enterprise-grade IT management toolkit for Microsoft Surface devices. Streamlined complex device provisioning workflows for IT administrators across large organizations.',
    tags: ['enterprise', 'b2b'],
    company: 'Microsoft',
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/b77dca39-b57c-4d1f-9f44-989469654142_rwc_0x7x1599x959x32.png?h=4d98f6dd514651208d98a20198c5c95a',
  },
  {
    id: 2,
    title: 'Blue Cross NC Cost Estimator',
    type: 'Cost estimator feature',
    category: 'Product Design',
    description: 'Designed an intuitive healthcare cost estimator that helps Blue Cross NC members understand their out-of-pocket expenses before receiving care — reducing billing surprise.',
    tags: ['healthcare', 'fintech'],
    company: 'Blue Cross NC',
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/2d8012a4-2264-45a7-815c-dca173412dfc_carw_20x12x32.png?h=4fc915bb2ab5ac2e9e61d91bed8f2c01',
  },
  {
    id: 3,
    title: 'Home Depot Protection Plan',
    type: 'Post-Purchase Experience',
    category: 'UX Design',
    description: 'Redesigned the post-purchase protection plan experience for Home Depot, dramatically improving plan activation rates and reducing customer support load.',
    tags: ['e-commerce', 'conversion'],
    company: 'Home Depot',
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/b9f52d37-8475-46b2-bb54-76cf78b0aba0_carw_20x12x32.png?h=ea02d52ecbc9bbb0ac1b3f07fb663af0',
  },
  {
    id: 4,
    title: 'Microsoft Teams Anywhere',
    type: 'Storyboards',
    category: 'UX Design',
    description: 'Conceptual storyboard series illustrating the future of hybrid work through Microsoft Teams — envisioning seamless transitions between home, office, and on-the-go contexts.',
    tags: ['future-of-work', 'narrative'],
    company: 'Microsoft',
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/600e1b8c-9dea-4445-8c92-75c12fd33b40_carw_20x12x32.png?h=0252f83dd67c6abdcea6e358af3603d0',
  },
  {
    id: 5,
    title: 'Blue Connect Mobile App Redesign',
    type: 'Mobile application',
    category: 'Visual Design',
    description: 'Full visual interface redesign of the Blue Connect mobile app — modernizing the design language, improving accessibility compliance, and unifying the component library.',
    tags: ['healthcare', 'rebrand'],
    company: 'Blue Cross NC',
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/d7688bf5-a862-4d36-aa13-b52a34f55273_carw_20x12x32.png?h=6c5f58d2687ed08722beba0de3dc6a84',
  },
  {
    id: 6,
    title: 'Pantry Note',
    type: 'Mobile application',
    category: 'UX Design',
    description: 'Smart pantry management app that reduces food waste through intelligent inventory tracking, expiration alerts, and AI-powered recipe suggestions.',
    tags: ['mobile', 'consumer'],
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/47c530c3-bb0c-4890-884e-bc8f4cba8cb4_carw_20x12x32.png?h=9c042ba8c9f42381b50000d2aa69398d',
  },
  {
    id: 7,
    title: 'Samsung Sports Website',
    type: 'Website',
    category: 'Visual Design',
    description: 'High-impact sports marketing website for Samsung, leveraging dynamic visual design, motion principles, and bold typography to connect the brand with athletic culture.',
    tags: ['sports', 'brand'],
    company: 'Samsung',
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/c005d1d0-851d-4d46-8597-f61aa702ee27_carw_20x12x32.png?h=2325c6bbaf4a0c1efb5b406781df6587',
  },
  {
    id: 8,
    title: 'Samsung Crazy',
    type: 'Micro website',
    category: 'Visual Design',
    description: 'Award-worthy micro-website campaign featuring immersive motion design and bold interactive moments to launch a Samsung product line with viral energy.',
    tags: ['motion', 'campaign'],
    company: 'Samsung',
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/602196c4-24b9-4c54-90f9-73cb15ff7b44_carw_20x12x32.png?h=13d1f30b03ea3d46d2df803a5f68b799',
  },
  {
    id: 9,
    title: 'Ergo Daum Insurance',
    type: 'Micro website',
    category: 'Visual Design',
    description: 'Visually refined micro-website for Ergo Daum Insurance — balancing trust, clarity, and modern Korean visual design to communicate complex insurance products simply.',
    tags: ['insurance', 'brand'],
    image: 'https://cdn.myportfolio.com/f779c1db-0e78-4f40-83ba-b55379ff9d5c/0136f9ff-2e22-4507-ad1e-6a1aafe32c8f_carw_20x12x32.png?h=e8f7e09b9c37b146dfea35b672b2c99e',
  },
]

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

        {/* AI/ML Section */}
        <div className="mt-24">
          <div className="flex items-center gap-4 mb-12">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500">04 — AI / ML Projects</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-900 border border-stone-700 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Currently Exploring
                </div>
                <h3 className="font-display text-3xl font-semibold text-stone-100 mb-4">
                  AI/ML Design Projects
                </h3>
                <p className="text-stone-400 leading-relaxed max-w-xl">
                  Exploring the intersection of human-centered design and artificial intelligence.
                  Working on projects that make ML systems more interpretable, trustworthy,
                  and accessible for everyday users — including explainability UX, responsible
                  AI patterns, and LLM interface design.
                </p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {['AI/UX', 'Explainability', 'Responsible AI', 'LLM Interfaces', 'Data Visualization'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-stone-700/50 text-stone-400 border border-stone-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-full md:w-64 flex-shrink-0">
                <div className="rounded-xl bg-stone-800/80 border border-stone-700 p-6 flex flex-col gap-4">
                  <div className="text-xs text-stone-500 uppercase tracking-wide font-medium">Coming Soon</div>
                  {['AI Onboarding UX', 'LLM Chat Interface Design', 'Bias Visualization Tool'].map((project) => (
                    <div key={project} className="flex items-center gap-3 p-3 rounded-lg bg-stone-700/40 border border-stone-700">
                      <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                      <span className="text-sm text-stone-300">{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
