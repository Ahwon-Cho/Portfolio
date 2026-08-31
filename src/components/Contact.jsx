/* ART: warm off-white page, narrow single column — reads like a letter, not a pitch */
/* UX: no form, no ask — an open invitation with two direct ways to reach out */
/* MOTION: gentle staggered reveal */
import { motion, useReducedMotion } from 'framer-motion'

function EmailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M7 17L17 7M7 7h10v10"/>
    </svg>
  )
}

const LINKS = [
  {
    Icon: EmailIcon,
    label: 'Email',
    value: 'awony82@gmail.com',
    href: 'mailto:awony82@gmail.com',
    note: 'The most direct way',
  },
  {
    Icon: LinkedInIcon,
    label: 'LinkedIn',
    value: 'linkedin.com/in/ahwon-c',
    href: 'https://www.linkedin.com/in/ahwon-c-3bb41593/',
    note: 'If you prefer to connect first',
  },
]

/* UX: things worth talking about — invites a conversation, not an application */
const TOPICS = [
  'Design and AI',
  'Vibe coding',
  'Enterprise UX',
  'Portfolio feedback',
  'Getting into UX',
  'Whatever you\'re building',
]

export default function Contact() {
  const shouldReduce = useReducedMotion()

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 24 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: shouldReduce ? 0 : 0.09 } },
  }

  return (
    <section
      id="contact"
      aria-label="Say hello to Ahwon Cho"
      className="min-h-[calc(100vh-3.5rem)] pt-32 pb-28 md:pt-40 md:pb-36 bg-ink-50"
    >
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20"
      >

        {/* Two columns, as on the About page: the letter reads on the left, the
            ways to reach me collect on the right. Fills the same shell width as
            every other page while each column keeps its own reading measure. */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left — the letter */}
          <motion.div>

        {/* ART: warm headline — the italic line does the softening */}
        <motion.h2
          variants={fadeUp}
          className="font-bold text-4xl md:text-5xl text-ink-900 leading-[1.15] mb-8"
        >
          I'd genuinely love
          <br />
          to hear from you.
          <span className="block font-display italic font-normal text-stone-400 mt-3 text-3xl md:text-4xl">
            No agenda required.
          </span>
        </motion.h2>

        {/* ART: amber rule — the one warm accent, echoes the About pull-quote */}
        <motion.div variants={fadeUp} className="w-12 h-0.5 bg-amber-400 mb-8" aria-hidden="true" />

        <motion.div
          variants={fadeUp}
          className="space-y-5 text-stone-600 leading-relaxed text-[15px] md:text-base"
        >
          <p>
            Some of my favorite conversations started with a message from someone I'd
            never met — a question about a project, a half-formed idea, or a note that
            just said hi.
          </p>
          <p>
            So if something here stuck with you, or you're chewing on a problem and want
            to think out loud with someone, I'm always happy to listen. I read everything
            that comes in.
          </p>
        </motion.div>

          </motion.div>

          {/* Right — topics and the ways to reach me */}
          <motion.div>

        {/* Topics — warm, low-stakes conversation starters */}
        <motion.div variants={fadeUp}>
          <h3 className="section-label mb-4">Things I never get tired of</h3>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <span key={topic} className="tag">{topic}</span>
            ))}
          </div>
        </motion.div>

        {/* Contact links — warm cards, amber on hover */}
        <motion.div variants={fadeUp} className="mt-12 pt-12 border-t border-stone-200 space-y-3">
          {LINKS.map(({ Icon, label, value, href, note }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label}: ${value}`}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-stone-100 text-stone-500 group-hover:bg-amber-400 group-hover:text-ink-900 transition-all duration-300 flex-shrink-0">
                <Icon />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink-900 truncate">{value}</div>
                <div className="text-xs text-stone-500 mt-0.5">{note}</div>
              </div>
              <span className="text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" aria-hidden="true">
                <ArrowIcon />
              </span>
            </a>
          ))}
        </motion.div>

          </motion.div>
        </div>

        {/* ART: signature closes the letter */}
        <motion.p
          variants={fadeUp}
          className="mt-16 text-stone-500 text-[15px] leading-relaxed"
        >
          Talk soon,
          <span className="block font-display italic text-2xl text-ink-900 mt-1">
            Ahwon
          </span>
        </motion.p>
      </motion.div>
    </section>
  )
}
