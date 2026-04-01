/* ART: dark footer continues zinc-950 — seamless with contact section */
/* UX: back-to-top is accessible button, not purely decorative */
export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start">
          {/* ART: Playfair Display italic for the name — consistent with header brand mark */}
          <span className="font-display italic text-sm font-normal text-stone-400">Ahwon Cho</span>
          <span className="text-xs text-stone-600 mt-0.5">UX &amp; Visual Designer</span>
        </div>

        <p className="text-xs text-stone-600 text-center">
          © {new Date().getFullYear()} Ahwon Cho · Designed &amp; built with React + Tailwind
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          className="text-xs text-stone-600 hover:text-stone-300 flex items-center gap-1.5 transition-colors group"
        >
          <span className="group-hover:-translate-y-0.5 transition-transform duration-200" aria-hidden="true">↑</span>
          Back to top
        </button>
      </div>
    </footer>
  )
}
