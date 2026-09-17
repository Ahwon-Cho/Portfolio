import { lazy, Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import Header from './components/Header'
import './Portfolio.css'
const InkLandingPage = lazy(() => import('./pages/InkLandingPage'))
const PaintedMotionPage = lazy(() => import('./pages/PaintedMotionPage'))
const BookStoryPage = lazy(() => import('./pages/BookStoryPage'))

const About = lazy(() => import('./components/About'))
const Projects = lazy(() => import('./components/Projects'))
const Contact = lazy(() => import('./components/Contact'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const SurfaceITCaseStudy = lazy(() => import('./pages/SurfaceITCaseStudy'))
const HomeDepotCaseStudy = lazy(() => import('./pages/HomeDepotCaseStudy'))
const PantryNoteCaseStudy = lazy(() => import('./pages/PantryNoteCaseStudy'))

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
  const immersiveLanding = ['/', '/ink', '/ink-motion', '/book'].includes(location.pathname)

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
    <div className={immersiveLanding ? 'min-h-screen' : 'portfolio-shell'}>
      {!immersiveLanding && <Header darkMode={darkMode} setDarkMode={setDarkMode} />}
      <main id="main-content" tabIndex="-1">
        <Suspense fallback={<div className="min-h-screen bg-ink-50" aria-label="Loading portfolio destination" />}>
          <PageTransition>
            <Routes>
              <Route path="/"                                    element={<BookStoryPage />} />
              <Route path="/ink"                                 element={<InkLandingPage />} />
              <Route path="/ink-motion"                          element={<PaintedMotionPage />} />
              <Route path="/book"                                element={<BookStoryPage />} />
              <Route path="/work"                                element={<WorkPage />} />
              <Route path="/about"                               element={<AboutPage />} />
              <Route path="/contact"                             element={<ContactPage />} />
              <Route path="/resume"                              element={<ResumePage />} />
              <Route path="/landing"                             element={<Navigate to="/" replace />} />
              <Route path="/project/surface-it-toolkit"        element={<SurfaceITCaseStudy />} />
              <Route path="/project/home-depot-protection-plan" element={<HomeDepotCaseStudy />} />
              <Route path="/project/pantry-note"               element={<PantryNoteCaseStudy />} />
              <Route path="/project/:slug"                     element={<ProjectDetail />} />
            </Routes>
          </PageTransition>
        </Suspense>
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
