/* ART: dark contact section matching hero — creates bookend rhythm with hero */
/* UX: personal opening hook, accessible form with required fields, aria-live for status */
/* MOTION: scroll reveal, form input micro-interactions */
import { useState } from 'react'
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

function GitHubIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>
  )
}

const LINKS = [
  { Icon: EmailIcon,    label: 'Email',    href: 'mailto:august.dreams23@gmail.com',              value: 'august.dreams23@gmail.com'        },
  { Icon: LinkedInIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/ahwon-c-3bb41593/', value: 'linkedin.com/in/ahwon-c-3bb41593' },
  { Icon: GitHubIcon,   label: 'GitHub',   href: 'https://github.com/Ahwon-Cho',                  value: 'github.com/Ahwon-Cho'             },
]

const INPUT_BASE = `
  w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
  text-stone-200 placeholder:text-stone-600
  focus:outline-none focus:ring-1 focus:ring-amber-400/60 focus:border-amber-400/40
  text-sm transition-all duration-200
`

export default function Contact() {
  const [status, setStatus]   = useState('idle') // idle | sending | sent
  const shouldReduce          = useReducedMotion()

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 32 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1200)
  }

  return (
    <section
      id="contact"
      aria-label="Contact Ahwon Cho"
      className="py-28 md:py-36 bg-zinc-950 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

        {/* Section header */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          className="flex items-center gap-4 mb-20"
        >
          <span className="section-label text-stone-600">Contact</span>
          <div className="flex-1 h-px bg-white/5" aria-hidden="true" />
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">

          {/* Left: heading + description */}
          <div className="max-w-xl">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="font-bold text-4xl md:text-5xl text-stone-100 leading-tight mb-6"
            >
              Building something complex?
              <br />
              <span className="text-stone-400 font-normal">
                Let's make it feel simple.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="text-stone-400 leading-relaxed"
            >
              Open to senior IC and lead design roles at companies where design has a real
              seat at the table — especially in enterprise software, e-commerce, and
              AI/developer tools.
            </motion.p>
          </div>

          {/* Right: contact links */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="space-y-4 flex-shrink-0 mt-[50px]"
          >
            {LINKS.map(({ Icon, label, href, value }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contact via ${label}: ${value}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/8 text-stone-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-200">
                  <Icon />
                </div>
                <div>
                  <div className="text-xs text-stone-600 uppercase tracking-wide mb-0.5">{label}</div>
                  <div className="text-sm font-medium text-stone-300 group-hover:text-white transition-colors">{value}</div>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
