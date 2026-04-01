/* ART: dark editorial hero, left-aligned asymmetric layout, Playfair Display italic headline */
/* UX: semantic section, accessible CTAs, meaningful heading hierarchy */
/* MOTION: staggered text reveal, subtle badge pulse */
import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ParticleCanvas from './ParticleCanvas'

const COMPANIES = ['Microsoft', 'Home Depot', 'Blue Cross NC', 'Samsung', 'LG']

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M7 17L17 7M7 7h10v10"/>
    </svg>
  )
}

function DownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
  )
}

export default function Hero({ darkMode = false }) {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduce ? 0 : 0.12, delayChildren: shouldReduce ? 0 : 0.3 } },
  }

  const item = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 28 },
    show:   { opacity: 1, y: 0, transition: { duration: shouldReduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-zinc-950"
    >
      {/* Particle background — unchanged */}
      <ParticleCanvas darkMode={darkMode} />

      {/* ART: gradient orbs for depth */}
      <div className="absolute top-1/3 -left-64 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-900/20 to-transparent blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-amber-900/10 to-transparent blur-3xl pointer-events-none" aria-hidden="true" />

      {/* ART: left-aligned layout — breaks convention, signals editorial confidence */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full pt-24 pb-16 -translate-y-[50px]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          {/* UX: available status badge */}
          <motion.div variants={item} className="mb-10">
            <span className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-medium text-stone-400">
              <span className="accent-dot" aria-hidden="true" />
              Available for new opportunities
            </span>
          </motion.div>

          {/* ART: headline — Inter black + Playfair Display italic contrast */}
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal leading-[1.02] tracking-tight text-stone-100 mb-6"
          >
            I design complex
            <br />
            software —
            <br />
            {/* ART: lighter weight + stone-300 for the final line — elegant contrast within PJS */}
            <span className="font-bold text-stone-400">simple, </span><span className="font-bold text-stone-300">crafted, </span><span className="font-bold text-white">human.</span>
          </motion.h1>

          {/* UX: concise, specific value prop — not generic */}
          <motion.p variants={item} className="text-base md:text-lg text-stone-400 leading-relaxed max-w-xl mb-12">
            Senior UX &amp; visual designer. 10+ years building enterprise software, mobile apps,
            and developer tools — from discovery to shipped product.
          </motion.p>

          {/* UX: two clear CTAs, primary action first */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-start gap-4 mb-16">
            <button
              onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              View My Work
              <DownIcon />
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Download Résumé
              <ArrowIcon />
            </a>
          </motion.div>

          {/* ART: "Worked with" — company names as proof points, not just decoration */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="section-label text-stone-600">Worked with</span>
            {COMPANIES.map((co) => (
              <span key={co} className="text-xs font-semibold text-stone-500 tracking-wide">
                {co}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ART: bottom scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduce ? 0 : 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-stone-600"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-stone-600" />
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        </div>
      </motion.div>
    </section>
  )
}
