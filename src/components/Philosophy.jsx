/* ART: editorial dark interstitial between About and Projects — breaks the light-section rhythm */
/* MOTION: text reveal on scroll */
import { motion, useReducedMotion } from 'framer-motion'

export default function Philosophy() {
  const shouldReduce = useReducedMotion()

  return (
    <section
      aria-label="Design philosophy"
      className="py-24 md:py-32 bg-zinc-900 relative overflow-hidden"
    >
      {/* ART: subtle texture — large faint type in background */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-display italic text-[200px] md:text-[320px] font-normal text-white/[0.025] leading-none whitespace-nowrap">
          Design
        </span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: shouldReduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ART: amber accent line above quote */}
          <div className="w-8 h-px bg-amber-400 mx-auto mb-10" aria-hidden="true" />

          <blockquote className="text-3xl md:text-4xl lg:text-5xl font-semibold text-stone-100 leading-[1.2] mb-8">
            Complexity is the problem.
            <br />
            <span className="font-light text-stone-400">Clarity is the work.</span>
          </blockquote>

        </motion.div>
      </div>
    </section>
  )
}
