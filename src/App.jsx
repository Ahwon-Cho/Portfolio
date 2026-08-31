import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header'
import About from './components/About'
import Philosophy from './components/Philosophy'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ProjectDetail from './pages/ProjectDetail'
import SurfaceITCaseStudy from './pages/SurfaceITCaseStudy'
import HomeDepotCaseStudy from './pages/HomeDepotCaseStudy'
import PantryNoteCaseStudy from './pages/PantryNoteCaseStudy'
import LandingPage from './pages/LandingPage'

/* MOTION: page-level transition wrapper */
function PageTransition({ children }) {
  const { pathname } = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* The résumé PDF, and the route that hands off to it.
 *
 * Vercel's analytics script only sees client-side route changes, so a link
 * straight to the PDF is invisible in the dashboard. Sending people through a
 * real route logs a pageview first, which is how résumé opens get counted on
 * the free plan — custom events need Pro.
 *
 * The short delay gives that pageview time to leave before the tab navigates
 * away, and the manual link covers the case where the redirect is blocked. */
export const RESUME_FILE = '/Resume/AhwonCho_SeniorUXVisualDesigner.pdf'

function ResumeRedirect() {
  useEffect(() => {
    const t = setTimeout(() => window.location.replace(RESUME_FILE), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-ink-50 px-6 text-center">
      <p className="text-ink-900 text-lg font-medium">Opening résumé…</p>
      <a href={RESUME_FILE} className="text-sm text-stone-500 underline hover:text-ink-900">
        Click here if it doesn&rsquo;t open automatically
      </a>
    </div>
  )
}

/* Each top-level section is now its own route, not one long scroll */
function WorkPage() {
  return <Projects />
}

function AboutPage() {
  return <About />
}

function ContactPage() {
  return <Contact />
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  /* Detect system dark mode preference */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setDarkMode(mq.matches)
    const handler = (e) => setDarkMode(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /* Sync dark class on <html> */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  /* Scroll to top on route change */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    /* ART: zinc-950 base keeps the dark-dominant aesthetic consistent */
    <div className="min-h-screen bg-zinc-950 text-stone-900">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main id="main-content" tabIndex="-1">
        <PageTransition>
          <Routes>
            <Route path="/"                                    element={<LandingPage />} />
            <Route path="/work"                                element={<WorkPage />} />
            <Route path="/about"                               element={<AboutPage />} />
            <Route path="/contact"                             element={<ContactPage />} />
            <Route path="/resume"                              element={<ResumeRedirect />} />
            {/* The walk used to live here. Kept as a redirect so shared or
                bookmarked /landing links still land somewhere. */}
            <Route path="/landing"                             element={<Navigate to="/" replace />} />
            <Route path="/project/surface-it-toolkit"        element={<SurfaceITCaseStudy />} />
            <Route path="/project/home-depot-protection-plan" element={<HomeDepotCaseStudy />} />
            <Route path="/project/pantry-note"               element={<PantryNoteCaseStudy />} />
            <Route path="/project/:slug"                     element={<ProjectDetail />} />
          </Routes>
        </PageTransition>
      </main>
      {/* Pageviews per route — no cookies, so no consent banner needed. */}
      <Analytics />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
