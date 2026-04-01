/* UX: skip link, focus trap, active section tracking, keyboard nav */
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV = [
  { label: 'Work',    href: '#projects' },
  { label: 'About',   href: '#about'    },
  { label: 'Contact', href: '#contact'  },
]

function SunIcon()  {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
      <line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

export default function Header({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [activeSection, setActive]    = useState('')
  const [scrollProgress, setProgress] = useState(0)
  const drawerRef = useRef(null)
  const navigate  = useNavigate()
  const location  = useLocation()
  const isHome    = location.pathname === '/'

  /* ── Scroll progress + active section ───────────────── */
  useEffect(() => {
    const onScroll = () => {
      const el   = document.documentElement
      const prog = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setProgress(Math.min(1, prog))

      const sections = ['projects', 'about', 'contact']
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(id); return
        }
      }
      setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Focus trap for mobile drawer ────────────────────── */
  useEffect(() => {
    if (!mobileOpen) return
    const drawer = drawerRef.current
    if (!drawer) return
    const focusable = drawer.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])')
    const first = focusable[0], last = focusable[focusable.length - 1]
    first?.focus()
    const trap = (e) => {
      if (e.key === 'Escape') { setMobileOpen(false); return }
      if (e.key !== 'Tab') return
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last?.focus() } }
      else            { if (document.activeElement === last)  { e.preventDefault(); first?.focus() } }
    }
    drawer.addEventListener('keydown', trap)
    return () => drawer.removeEventListener('keydown', trap)
  }, [mobileOpen])

  const scrollTo = (href) => {
    setMobileOpen(false)
    if (isHome) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/' + href)
    }
  }

  return (
    <>
      {/* UX: skip to main content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-zinc-950 focus:rounded-full focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>

      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => isHome ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}
            aria-label="Go to home"
            className="flex flex-col items-start leading-none group"
          >
            <span className="font-display italic text-base font-normal text-stone-100 group-hover:text-white transition-colors">
              Ahwon Cho
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-stone-500 group-hover:text-stone-400 transition-colors mt-0.5">
              UX / Visual Designer
            </span>
          </button>

          {/* Desktop nav */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
            {NAV.map(({ label, href }) => {
              const id = href.replace('#', '')
              const isActive = activeSection === id
              return (
                <button
                  key={label}
                  onClick={() => scrollTo(href)}
                  className={`nav-link ${isActive ? 'text-white after:w-full' : ''}`}
                >
                  {label}
                </button>
              )
            })}
            <a
              href="/Resume/AhwonCho_SeniorProductDesigner.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              Résumé
            </a>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="md:hidden w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-100 hover:bg-white/10 rounded-full transition-all duration-200"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
        <div
          id="mobile-nav"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`absolute top-0 right-0 h-full w-72 bg-zinc-950 border-l border-white/5 shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="pt-20 px-8 flex flex-col gap-2">
            {NAV.map(({ label, href }) => (
              <button
                key={label}
                onClick={() => scrollTo(href)}
                className="text-left py-3 text-lg font-medium text-stone-300 hover:text-white transition-colors border-b border-white/5"
              >
                {label}
              </button>
            ))}
            <a
              href="/Resume/AhwonCho_SeniorProductDesigner.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 text-lg font-medium text-stone-300 hover:text-white transition-colors"
            >
              Résumé
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
