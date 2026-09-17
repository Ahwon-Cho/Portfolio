import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PORTFOLIO_NAV } from '../components/Header'
import { chapters } from '../components/book/bookChapters'
import './BookStory.css'

export default function BookStoryPage() {
  const mount = useRef(null)
  const controller = useRef(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [state, setState] = useState({ stage: 'cover', playing: true, time: 0 })
  useEffect(() => {
    let disposed = false
    const previousTitle = document.title
    document.title = 'Beyond the Screen | Ahwon Cho'
    import('../components/book/createBookScene').then(({ createBookScene }) => {
      if (disposed) return null
      return createBookScene(mount.current, {
        onState: next => !disposed && setState(next),
      })
    }).then(api => {
      if (!api) return
      if (disposed) return api.dispose()
      controller.current = api
      setReady(true)
    }).catch(error => {
      console.error('Book preview could not start', error)
      if (!disposed) setFailed(true)
    })
    return () => { disposed = true; controller.current?.dispose(); document.title = previousTitle }
  }, [])
  const chapter = chapters[state.chapterIndex || 0]
  return (
    <section className="book-story" aria-label="Beyond the Screen, an interactive book about Ahwon Cho">
      <header className="book-story__header">
        <Link className="book-story__brand" to="/">Ahwon Cho<small>UX + Visual Designer</small></Link>
        <nav aria-label="Primary navigation">
          {PORTFOLIO_NAV.filter(({ to }) => to !== '/').map(({ label, to }) => <Link key={to} to={to}>{label}</Link>)}
          <a href="/resume" target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>
      <div className="book-story__copy">
        <p className="book-story__role">UX &amp; Visual Designer</p>
        <h1>Hi, I’m <span>Ahwon.</span></h1>
        <p className="book-story__intro">I make ideas tangible through visual design<br className="book-story__intro-break" /> and hands-on prototyping.</p>
      </div>
      <div className="book-story__visual" ref={mount}>
        <div className="book-story__bubble" data-visible={ready && state.bubbleVisible ? 'true' : 'false'}
          aria-hidden={!ready || !state.bubbleVisible} aria-live={state.playing ? 'off' : 'polite'}>
          <p>{chapter.sentence}</p>
        </div>
      </div>
      {!ready && <div className="book-story__fallback">
        <img src="/images/book-story/cover-ahwon-v17.png" alt="Beyond the Screen. Ahwon Cho. A small world shaped by curiosity." />
        <p role="status">{failed ? 'The animated preview needs WebGL. You can still explore my work.' : 'Opening a little world…'}</p>
      </div>}
      <h2 className="book-story__sr" aria-live={state.playing ? 'off' : 'polite'}>{state.theme || 'Inspiration'}</h2>
      <p className="book-story__sr" id="book-theme-help">A small world shaped by curiosity. The four themes repeat automatically after the book opens. Choose a theme dot to open a chapter and pause there. Scroll or use arrow keys to turn pages. Press Space away from the controls to pause or resume motion.</p>
      <footer className="book-story__footer">
        {ready && <nav className="book-story__dots" aria-label="Book themes" aria-describedby="book-theme-help"
          onFocusCapture={() => controller.current?.pause()} onPointerEnter={() => controller.current?.pause()}>
          {chapters.map((item, index) => <button key={item.id} type="button"
            aria-label={`Show ${item.title}, theme ${index + 1} of 4`} title={item.title}
            aria-current={state.hasChapter && state.selectedChapter === index ? 'step' : undefined}
            onClick={() => controller.current?.selectChapter(index)}>
            <span aria-hidden="true" />
          </button>)}
        </nav>}
        <Link className="book-story__skip" to="/work">Skip intro <span aria-hidden="true">→</span></Link>
      </footer>
    </section>
  )
}
