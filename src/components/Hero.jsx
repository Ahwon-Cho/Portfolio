import ParticleCanvas from './ParticleCanvas'

function ArrowDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
  )
}

export default function Hero({ darkMode = false }) {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-50 dark:bg-stone-950">
      {/* Particle background */}
      <ParticleCanvas darkMode={darkMode} />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-gradient-to-br from-purple-200/30 to-pink-200/20 dark:from-purple-900/20 dark:to-pink-900/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-gradient-to-br from-teal-200/30 to-blue-200/20 dark:from-teal-900/20 dark:to-blue-900/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
        {/* Available badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm text-xs font-medium text-stone-500 dark:text-stone-400 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Available for new opportunities
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight text-stone-900 dark:text-stone-100 mb-6">
          Crafting experiences
          <br />
          <span className="italic font-normal text-stone-500 dark:text-stone-400">
            that feel effortless.
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base md:text-lg text-stone-500 dark:text-stone-400 leading-relaxed mb-12">
          Senior designer with deep expertise spanning enterprise software, mobile applications,
          and e-commerce. I bridge user research, systems thinking, and visual craft to build
          products people love.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
            View My Work
            <ArrowDownIcon />
          </button>
          <button onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary">
            Get in Touch
          </button>
        </div>

        {/* Worked with */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6">
          <span className="text-xs text-stone-400 dark:text-stone-600 font-medium uppercase tracking-wide">Worked with</span>
          {['Microsoft', 'Home Depot', 'Blue Cross NC', 'Samsung'].map((co) => (
            <span key={co} className="text-xs font-semibold text-stone-500 dark:text-stone-500">{co}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
