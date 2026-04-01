import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Philosophy from './components/Philosophy'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectDetail from './pages/ProjectDetail'
import SurfaceITCaseStudy from './pages/SurfaceITCaseStudy'
import HomeDepotCaseStudy from './pages/HomeDepotCaseStudy'
import PantryNoteCaseStudy from './pages/PantryNoteCaseStudy'

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

function HomePage({ darkMode }) {
  return (
    <>
      <Hero darkMode={darkMode} />
      <Projects />
      <About />
      <Contact />
    </>
  )
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
            <Route path="/"                                    element={<HomePage darkMode={darkMode} />} />
            <Route path="/project/surface-it-toolkit"        element={<SurfaceITCaseStudy />} />
            <Route path="/project/home-depot-protection-plan" element={<HomeDepotCaseStudy />} />
            <Route path="/project/pantry-note"               element={<PantryNoteCaseStudy />} />
            <Route path="/project/:slug"                     element={<ProjectDetail />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
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
