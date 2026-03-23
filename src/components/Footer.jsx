export default function Footer() {
  return (
    <footer className="bg-stone-50 dark:bg-stone-950 border-t border-stone-100 dark:border-stone-800 py-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-sm font-medium text-stone-900 dark:text-stone-100">Ahwon Cho</span>
          <span className="text-xs text-stone-400 dark:text-stone-600">UX / Visual Designer</span>
        </div>

        <p className="text-xs text-stone-400 dark:text-stone-600 text-center">
          © {new Date().getFullYear()} Ahwon Cho. Designed & built with React + Tailwind.
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xs text-stone-500 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 flex items-center gap-1 transition-colors"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
