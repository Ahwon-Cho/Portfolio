import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlanetScene3D from '../components/InkTheaterScene3D'
import './PlanetLanding.css'
import './InkLanding.css'

const CHAPTERS = [
  {
    title: <>UX designer.<br /><em>Visual thinker.</em></>,
    description: 'I’m Ahwon. I make ideas tangible through visual design and hands-on prototyping.',
    context: 'Currently designing Surface experiences at Microsoft as a contract designer.',
  },
  {
    eyebrow: '01 · Coffee',
    title: <>A pause before the <em>first idea.</em></>,
    description: 'I enjoy a cup of coffee before getting started.',
    bubble: 'Coffee inspires me!',
    keywords: 'Curiosity · Observe',
  },
  {
    eyebrow: '02 · Workspace',
    title: <>Complex systems become <em>clear.</em></>,
    description: 'I sketch and prototype ideas early so I can see what needs to change.',
    bubble: 'I visualize early, fail fast, and make ideas clear.',
    keywords: 'Unify · Prototype · Craft',
  },
  {
    eyebrow: '03 · Open space',
    title: <>Walking makes room to <em>notice.</em></>,
    description: 'Time outside with my husband and our dogs helps me slow down, notice small details, and return with a clearer point of view.',
    bubble: 'Nature helps me solve problems.',
    keywords: 'Observe · Details · Connect',
  },
  {
    eyebrow: '04 · Garden',
    title: <>Small routines create <em>growth.</em></>,
    description: 'I grow tomatoes and zucchini. Watching them grow brings me peace of mind.',
    bubble: 'Watching things grow brings me peace.',
    keywords: 'Curiosity · Patience · Grow',
  },
]

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const THEME_COUNT = CHAPTERS.length - 1
const THEME_DURATIONS = [10000, 12000, 13500, 11000]
const wrapTheme = (step) => ((step % THEME_COUNT) + THEME_COUNT) % THEME_COUNT

export default function InkLandingPage() {
  const storyRef = useRef(null)
  const bubbleRef = useRef(null)
  const copyRef = useRef(null)
  const stepRef = useRef(0)
  const [carouselStep, setCarouselStep] = useState(0)
  const [introComplete, setIntroComplete] = useState(false)
  const finishIntro = useCallback(() => setIntroComplete(true), [])
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [isAutoPlaying, setIsAutoPlaying] = useState(() => (
    typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ))
  const navigate = useNavigate()
  const goToWork = () => {
    // The new gallery lives in the original portfolio's separate local preview.
    // Keep this review-only connection out of a future production build.
    if (import.meta.env.DEV) {
      const previewUrl = new URL('/work2', window.location.href)
      previewUrl.port = '5175'
      window.location.assign(previewUrl.href)
      return
    }
    navigate('/work')
  }
  const activeChapter = wrapTheme(carouselStep) + 1

  useEffect(() => {
    const story = storyRef.current
    if (!story) return undefined

    let locked = false
    let wheelDistance = 0
    let touchStartY = 0
    let touching = false
    let unlockTimer = 0
    let autoTimer = 0
    let lastWheelTime = 0
    let wheelGestureHandled = false

    const scheduleNext = () => {
      window.clearTimeout(autoTimer)
      if (!introComplete || !isAutoPlaying || document.hidden || touching) return
      autoTimer = window.setTimeout(() => advance(1), THEME_DURATIONS[wrapTheme(stepRef.current)])
    }

    const advance = (direction) => {
      if (locked) return
      locked = true
      wheelDistance = 0
      setShowScrollHint(false)
      stepRef.current += direction
      setCarouselStep(stepRef.current)
      window.clearTimeout(unlockTimer)
      unlockTimer = window.setTimeout(() => {
        locked = false
      }, 1280)
      // A manual advance gets a fresh full interval, not a second automatic jump.
      scheduleNext()
    }

    const handleWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      event.preventDefault()
      const now = performance.now()
      if (now - lastWheelTime > 180) {
        wheelGestureHandled = false
        wheelDistance = 0
      }
      lastWheelTime = now
      if (wheelGestureHandled) return
      if (locked) return
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? story.clientHeight : 1
      wheelDistance += event.deltaY * unit
      if (Math.abs(wheelDistance) >= 42) {
        wheelGestureHandled = true
        advance(wheelDistance > 0 ? 1 : -1)
      }
    }

    const handleKeyDown = (event) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey
        || event.target.closest?.('button, a, input, textarea, select')) return
      const forward = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key)
        || (event.key === ' ' && !event.shiftKey)
      const backward = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)
        || (event.key === ' ' && event.shiftKey)
      if (!forward && !backward) return
      event.preventDefault()
      advance(forward ? 1 : -1)
    }

    const handleTouchStart = (event) => {
      touching = true
      window.clearTimeout(autoTimer)
      touchStartY = event.touches[0]?.clientY || 0
    }

    const handleTouchEnd = (event) => {
      touching = false
      const touchEndY = event.changedTouches[0]?.clientY || touchStartY
      const distance = touchStartY - touchEndY
      if (Math.abs(distance) >= 38) advance(distance > 0 ? 1 : -1)
      scheduleNext()
    }

    const handleTouchCancel = () => {
      touching = false
      scheduleNext()
    }

    story.addEventListener('wheel', handleWheel, { passive: false })
    story.addEventListener('keydown', handleKeyDown)
    story.addEventListener('touchstart', handleTouchStart, { passive: true })
    story.addEventListener('touchend', handleTouchEnd, { passive: true })
    story.addEventListener('touchcancel', handleTouchCancel, { passive: true })
    document.addEventListener('visibilitychange', scheduleNext)
    scheduleNext()
    return () => {
      window.clearTimeout(unlockTimer)
      window.clearTimeout(autoTimer)
      story.removeEventListener('wheel', handleWheel)
      story.removeEventListener('keydown', handleKeyDown)
      story.removeEventListener('touchstart', handleTouchStart)
      story.removeEventListener('touchend', handleTouchEnd)
      story.removeEventListener('touchcancel', handleTouchCancel)
      document.removeEventListener('visibilitychange', scheduleNext)
    }
  }, [isAutoPlaying, introComplete])

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionPreference = (event) => {
      if (event.matches) setIsAutoPlaying(false)
    }
    motionPreference.addEventListener('change', handleMotionPreference)
    return () => motionPreference.removeEventListener('change', handleMotionPreference)
  }, [])

  useEffect(() => {
    // Teach the interaction during the mark, before the first act appears.
    const timer = window.setTimeout(() => setShowScrollHint(false), 2800)
    return () => window.clearTimeout(timer)
  }, [])

  const chapter = CHAPTERS[activeChapter]
  const introduction = CHAPTERS[0]

  return (
    <section
      ref={storyRef}
      className="planet-story ink-story"
      data-intro-complete={introComplete}
      aria-label="About Ahwon Cho through a rotating circular stage"
      aria-roledescription="carousel"
      tabIndex="0"
      onFocusCapture={(event) => {
        if (!event.target.closest('.planet-playback')) setIsAutoPlaying(false)
      }}
    >
      <div className="planet-sticky">
        <header className="planet-header">
          <div className="planet-brand" aria-label="Ahwon Cho, senior product designer">
            <span className="planet-brand-name">Ahwon Cho</span>
            <span className="planet-brand-role">UX + Visual Designer</span>
          </div>
          <div className="ink-preview-controls">
          <a className="ink-original-link" href="/">Original 3D</a>
          <button
            type="button"
            className="planet-playback"
            aria-label={isAutoPlaying ? 'Pause automatic scene changes' : 'Play automatic scene changes'}
            onClick={() => setIsAutoPlaying((playing) => !playing)}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              {isAutoPlaying
                ? <path d="M5 4h3v12H5zM12 4h3v12h-3z" />
                : <path d="M6 3.5 16 10 6 16.5z" />}
            </svg>
            <span>{isAutoPlaying ? 'Pause' : 'Play'}</span>
          </button>
          </div>
        </header>

        <div className="planet-frame">
          <div ref={copyRef} className="planet-copy">
            <h1 className="planet-title">{introduction.title}</h1>
            <p className="planet-description">{introduction.description}</p>
            <p className="planet-context">{introduction.context}</p>
          </div>

          <div
            key={activeChapter}
            ref={bubbleRef}
            className="planet-sentence-bubble"
            data-visible="false"
            aria-live={isAutoPlaying ? 'off' : 'polite'}
          >
            <p>{chapter.bubble}</p>
          </div>

          <div className="planet-visual">
            <PlanetScene3D carouselStep={carouselStep} activeIndex={activeChapter} bubbleRef={bubbleRef} copyRef={copyRef} onIntroComplete={finishIntro} />

            {showScrollHint && (
              <div className="planet-scroll-hint" aria-hidden="true">
                <span className="planet-scroll-track"><span className="planet-scroll-dot" /></span>
                <span>Scroll to go faster</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="planet-scene-link"
            aria-label="Skip the introduction and view Ahwon Cho's work"
            onClick={goToWork}
          />

          <button type="button" className="planet-skip" onClick={goToWork}>
            Skip to work <Arrow />
          </button>
        </div>

        <div className="planet-index" aria-hidden="true">
          <span className="planet-index-current">{String(activeChapter).padStart(2, '0')}</span>
          {' / '}{String(THEME_COUNT).padStart(2, '0')}
        </div>
      </div>
    </section>
  )
}
