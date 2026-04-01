/* ART: warm off-white section, editorial split, pull-quote in Playfair Display */
/* UX: replaced "Add photo here" placeholder with a proper monogram; refined stats */
/* MOTION: scroll-triggered reveal, staggered children */
import { motion, useReducedMotion } from 'framer-motion'
import greetingVideo from '../Firefly A sunny afternoon scene where a woman waves slowly in the foreground while sitting. The back.mp4'

const STATS = [
  { value: '10+',  label: 'Years of end-to-end product design experience' },
  { value: '6',    label: 'Active products as sole designer at Microsoft' },
  { value: 'MICA', label: "Master's in UX Design" },
]

const SKILLS = [
  { category: 'Design',     items: ['Visual Design', 'Interaction Design', 'Design Systems', 'Information Architecture', 'High-fidelity UI', 'Prototyping', 'Accessibility'] },
  { category: 'AI & Tools', items: ['Vibe Coding', 'Claude Code', 'VS Code', 'Figma', 'Pencil'] },
  { category: 'Research',   items: ['User Research', 'Usability Testing', 'Journey Mapping', 'Wireframing', 'User Flows'] },
]

const fadeUp = (reduce) => ({
  hidden: { opacity: 0, y: reduce ? 0 : 32 },
  show:   { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } },
})

export default function About() {
  const shouldReduce = useReducedMotion()
  const f = fadeUp(shouldReduce)

  return (
    <section
      id="about"
      aria-label="About Ahwon Cho"
      className="py-28 md:py-36 bg-ink-50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Section eyebrow */}
        <motion.div
          variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="flex items-center gap-4 mb-20"
        >
          <span className="section-label">About</span>
          <div className="flex-1 h-px bg-stone-200" aria-hidden="true" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: pull-quote + bio */}
          <div>
            {/* ART: Playfair Display pull-quote — the editorial centrepiece of this section */}
            <motion.blockquote
              variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="text-3xl md:text-4xl font-semibold leading-[1.2] text-ink-900 mb-10 border-l-2 border-amber-400 pl-6"
            >
              "Design is not what it looks like.
              <br />
              <span className="font-light text-ink-600">It's how it works — and whether it ships."</span>
            </motion.blockquote>

            <motion.div
              variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="space-y-5 text-stone-600 leading-relaxed text-[15px]"
            >
              <p>
                I'm Ahwon Cho, a senior UX and visual designer with 10+ years of end-to-end product
                design experience across enterprise, B2B, e-commerce, and cloud platforms. Currently
                the sole designer across 6 active products and initiatives on Microsoft's Surface
                Commercial team — building tools for IT admins and enterprise customers,
                including device management portals.
              </p>
              <p>
                My work spans the full design spectrum — and AI has changed how I move through
                all of it, from research to shipping. I've shipped for Fortune 500 companies and
                startups alike — mentoring designers, guiding engineers on implementation, and
                presenting solutions to VP-level stakeholders.
              </p>
              <p>
                I stay at the edge of what designers can own — using vibe coding
                (Claude Code, VS Code, Figma, Pencil) to prototype and ship faster than a
                traditional handoff allows.
              </p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="grid grid-cols-2 gap-6 mt-12 pt-12 border-t border-stone-200"
            >
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  {/* ART: amber accent on stat value */}
                  <div className="font-bold text-3xl text-ink-900 mb-1">{value}</div>
                  <div className="text-xs text-stone-500 leading-snug">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: photo + skills */}
          <div className="space-y-10">
            {/* UX: intentional photo placeholder — monogram, not "Add your photo here" */}
            <motion.div
              variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="rounded-2xl overflow-hidden aspect-[4/3] bg-ink-900 relative"
            >
              <video
                src={greetingVideo}
                autoPlay
                loop
                muted
                playsInline
                aria-label="Greeting from Ahwon Cho"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Skills */}
            <motion.div
              variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="space-y-6"
            >
              {SKILLS.map(({ category, items }) => (
                <div key={category}>
                  <h3 className="section-label mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <span key={skill} className="tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
