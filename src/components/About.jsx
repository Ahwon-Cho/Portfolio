const skills = [
  { category: 'Design', items: ['User Research', 'Interaction Design', 'Visual Design', 'Prototyping', 'Design Systems', 'Information Architecture'] },
  { category: 'Tools', items: ['Figma', 'Sketch', 'Adobe XD', 'Illustrator', 'Photoshop', 'After Effects'] },
  { category: 'Methods', items: ['Usability Testing', 'A/B Testing', 'Journey Mapping', 'Card Sorting', 'Heuristic Analysis', 'Design Sprints'] },
]

const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '50+', label: 'Projects Shipped' },
  { value: '4', label: 'Industries' },
  { value: '3', label: 'Countries' },
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white dark:bg-stone-900 border-y border-stone-100 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-400 dark:text-stone-500">02 — About</span>
          <div className="flex-1 h-px bg-stone-200 dark:bg-stone-700" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-stone-900 dark:text-stone-100 leading-tight mb-8">
              Designing with purpose,
              <br />
              <span className="italic font-normal text-stone-500 dark:text-stone-400">shipping with clarity.</span>
            </h2>

            <div className="space-y-5 text-stone-600 dark:text-stone-400 leading-relaxed">
              <p>
                I'm Ahwon Cho, a senior UX and visual designer based in the US. I specialize in
                crafting complex digital products — from enterprise software for Fortune 500
                companies to consumer mobile apps — with an emphasis on clarity, accessibility,
                and visual refinement.
              </p>
              <p>
                My work spans the full design spectrum: deep user research and strategy through
                to high-fidelity visual production. I've shipped products for Microsoft, The Home
                Depot, Blue Cross NC, and Samsung, always working closely with engineering and
                product teams to deliver experiences that actually launch.
              </p>
              <p>
                I'm energized by complex problem spaces where good design can create meaningful
                change — whether that's simplifying a healthcare cost estimator or reimagining
                a mobile insurance experience.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-12 border-t border-stone-100 dark:border-stone-800">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-1">{stat.value}</div>
                  <div className="text-xs text-stone-500 dark:text-stone-500 uppercase tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {skills.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-400 dark:text-stone-500 mb-4">
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span key={skill} className="tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}

            {/* Photo placeholder */}
            <div className="mt-8 rounded-2xl overflow-hidden bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-700 aspect-[4/3] flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 mx-auto mb-3 flex items-center justify-center text-2xl font-display font-semibold text-stone-600 dark:text-stone-300">
                  AC
                </div>
                <p className="text-sm text-stone-500 dark:text-stone-500">Add your photo here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
