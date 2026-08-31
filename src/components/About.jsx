/* ART: warm off-white section, editorial split, pull-quote in Playfair Display */
/* UX: replaced "Add photo here" placeholder with a proper monogram; refined stats */
/* MOTION: scroll-triggered reveal, staggered children */
import { motion, useReducedMotion } from 'framer-motion'
import greetingVideo from '../Firefly A sunny afternoon scene where a woman waves slowly in the foreground while sitting. The back.mp4'
import { Zoomable } from './Lightbox'
import art01 from '../img/art01.png'
import art02 from '../img/art02.png'
import art03 from '../img/art03.png'
import art04 from '../img/art04.png'
import art05 from '../img/art05.png'
import art06 from '../img/art06.png'
import art07 from '../img/art07.png'

const ART_WORKS = [
  { src: art01, alt: 'Art class study, 2019 — 1' },
  { src: art02, alt: 'Art class study, 2019 — 2' },
  { src: art03, alt: 'Art class study, 2019 — 3' },
  { src: art04, alt: 'Art class study, 2019 — 4' },
  { src: art05, alt: 'Art class study, 2019 — 5' },
  { src: art06, alt: 'Art class study, 2019 — 6' },
  { src: art07, alt: 'Art class study, 2019 — 7' },
]

const STATS = [
  { value: '10+', label: 'Years of end-to-end product design experience' },
  { value: '6', label: 'Active products as sole designer at Microsoft' },
  { value: 'MICA', label: "Master's in UX Design" },
]

const SKILLS = [
  { category: 'Design', items: ['Visual Design', 'Interaction Design', 'Design Systems', 'Information Architecture', 'High-fidelity UI', 'Prototyping', 'Accessibility'] },
  { category: 'AI & Tools', items: ['Vibe Coding', 'Claude Code', 'VS Code', 'Figma'] },
  { category: 'Research', items: ['User Research', 'Usability Testing', 'Journey Mapping', 'Wireframing', 'User Flows'] },
]

const fadeUp = (reduce) => ({
  hidden: { opacity: 0, y: reduce ? 0 : 32 },
  show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } },
})

export default function About() {
  const shouldReduce = useReducedMotion()
  const f = fadeUp(shouldReduce)

  return (
    <section
      id="about"
      aria-label="About Ahwon Cho"
      className="min-h-[calc(100vh-3.5rem)] pt-32 pb-28 md:pt-40 md:pb-36 bg-ink-50"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

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
                (Claude Code, VS Code, Figma) to prototype and ship faster than a
                traditional handoff allows.
              </p>
              <p>
                Craft matters to me, but so does how the work gets made. I listen — to
                users describing a problem in their own words, and to colleagues who see
                something I've missed. Great solutions can come from anyone, which is why
                I work closely with cross-functional teams and other designers. Taking the
                time to understand where someone is coming from produces better designs,
                and a better team to build them with.
              </p>
              <p>
                Design shapes how people feel, what they do, and what they decide. I'm
                drawn to motivators and behavior change — how design can move someone
                toward a better outcome, and make a meaningful difference. It's the
                question behind my ongoing machine learning studies: understanding these
                systems well enough to build products that genuinely serve the people
                using them.
              </p>
            </motion.div>

            {/* Featured Writing */}
            <motion.a
              href="https://medium.com/@acho_24144/my-team-used-ai-to-skip-design-for-mvp-heres-what-i-learned-98d13787fb91"
              target="_blank"
              rel="noopener noreferrer"
              variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="group flex items-center gap-4 mt-10 px-5 py-4 rounded-lg bg-stone-100/80 hover:bg-amber-50 transition-colors duration-300"
            >
              <span className="section-label shrink-0" style={{ marginBottom: 0 }}>Writing</span>
              <span className="text-ink-900 text-[15px] font-medium leading-snug group-hover:text-amber-700 transition-colors">
                My Team Used AI to Skip Design for MVP — Here's What I Learned
                <svg className="inline-block ml-1.5 w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
              </span>
            </motion.a>

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

        {/* Art class, 2019 — masonry columns so each piece keeps its own
            proportions rather than being cropped to a uniform tile. */}
        <motion.div
          variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="mt-24 pt-16 border-t border-stone-200"
        >
          <h3 className="section-label mb-3">Art class, 2019</h3>
          <p className="text-stone-500 text-[15px] leading-relaxed max-w-xl mb-8">
            Work from a drawing and painting course I took in 2019. Time away from
            the screen that still shows up in how I think about form and light.
          </p>

          <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
            {ART_WORKS.map(({ src, alt }) => (
              <div key={src} className="mb-4 break-inside-avoid">
                <Zoomable src={src} alt={alt}>
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    className="w-full rounded-xl border border-stone-200 hover:opacity-95 transition-opacity duration-300"
                  />
                </Zoomable>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sign-off — closes the page in the same voice as the letter on Contact */}
        <motion.p
          variants={f} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="mt-20 max-w-xl text-stone-600 leading-relaxed text-[15px]"
        >
          I hope you enjoy the work here, and the possibilities it points to. I'm
          excited about what comes next — and I'd love to build something with you.
          Thanks for visiting.
        </motion.p>
      </div>
    </section>
  )
}
