import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { previewProjects } from '../data/portfolioPreview'
import './PortfolioPreview.css'

function Arrow({ back = false }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={back ? { transform: 'rotate(180deg)' } : undefined}><path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function PreviewHeader({ original = '/work' }) {
  return <header className="p2-header">
    <div className="p2-header-inner">
      <Link to="/work2" className="p2-brand" aria-label="Ahwon Cho — preview work gallery">Ahwon Cho<span>UX designer · Visual thinker</span></Link>
      <nav aria-label="Preview navigation" className="p2-header-nav">
        <Link to="/work2">Work</Link>
        <Link to="/about">About</Link>
        <a href="/resume" target="_blank" rel="noreferrer">Résumé</a>
      </nav>
      <a className="p2-compare" href={original} target="_blank" rel="noreferrer">Current version <span aria-hidden="true">↗</span></a>
    </div>
  </header>
}

function Asset({ asset, eager = false }) {
  if (!asset.crop) return <img className="p2-full-image" src={asset.src} alt={asset.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  const { width, x, y, w, h } = asset.crop
  return <div className="p2-crop" style={{ aspectRatio: `${w} / ${h}` }}>
    <img src={asset.src} alt={asset.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ width: `${width / w * 100}%`, left: `${-x / w * 100}%`, top: `${-y / h * 100}%` }} />
  </div>
}

function Artwork({ project, eager = false }) {
  return <div className={`p2-art p2-art--${project.theme}`}>
    <div className="p2-art-main"><Asset asset={project.cover} eager={eager} /></div>
    {project.detail && <div className="p2-art-detail"><Asset asset={project.detail} eager={eager} /></div>}
  </div>
}

function Footer() {
  return <footer className="p2-footer p2-container">
    <div><strong>Have something in mind?</strong><Link to="/contact">Let’s talk <Arrow /></Link></div>
    <p>Ahwon Cho · UX & visual designer</p>
  </footer>
}

export function WorkPreview() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Selected work — Ahwon Cho · Preview'
    return () => { document.title = previous }
  }, [])
  return <div className="p2-page">
    <PreviewHeader />
    <div className="p2-container">
      <section className="p2-work-intro" aria-labelledby="p2-work-title">
        <h1 id="p2-work-title">Selected work</h1>
        <span className="p2-preview-label">Preview 02</span>
      </section>
      <div className="p2-work-grid">
        {previewProjects.map((project, index) => <article key={project.slug} className={`p2-project-card${index === 0 ? ' p2-project-card--featured' : index === previewProjects.length - 1 ? ' p2-project-card--wide' : ''}`}>
          <Link to={`/project2/${project.slug}`} aria-label={`Explore ${project.title}`}>
            <div className="p2-card-art"><Artwork project={project} eager={index < 2} /><span className="p2-card-arrow"><Arrow /></span></div>
            <div className="p2-card-copy">
              <div className="p2-card-meta"><span>{project.client}</span><span>{project.status}</span></div>
              <h2>{project.title}</h2>
              <p className="p2-card-summary">{project.summary}</p>
              <p className="p2-card-role"><span>My role</span>{project.role}</p>
            </div>
          </Link>
        </article>)}
      </div>
    </div>
    <Footer />
  </div>
}

function Figure({ asset, onZoom }) {
  return <figure className="p2-figure">
    <button type="button" className="p2-zoom" onClick={() => onZoom(asset)} aria-label={`Enlarge: ${asset.alt}`}>
      <Asset asset={asset} /><span className="p2-enlarge" aria-hidden="true">+</span>
    </button>
    {asset.caption && <figcaption>{asset.caption}</figcaption>}
  </figure>
}

function ImageDialog({ asset, onClose }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!asset || !dialog) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [asset])
  return <dialog ref={dialogRef} className="p2-image-dialog" aria-label={asset ? `Full-size image: ${asset.alt}` : 'Full-size image'} onCancel={onClose} onClick={event => { if (event.target === dialogRef.current) onClose() }}>
    {asset && <><button type="button" className="p2-dialog-close" onClick={onClose} autoFocus>Close <span aria-hidden="true">×</span></button><img src={asset.src} alt={asset.alt} /></>}
  </dialog>
}

function Chapter({ chapter, onZoom, craft = false }) {
  return <section className={`p2-chapter ${craft ? 'p2-craft' : ''}`}>
    <div className="p2-chapter-copy"><p className="p2-eyebrow">{craft ? '03 / Visual craft' : chapter.label}</p><h3>{chapter.title}</h3><p>{chapter.text}</p></div>
    <div className={`p2-figures p2-figures--${chapter.layout || 'single'}`}>
      {chapter.images.map((asset, index) => <Figure key={`${asset.src}-${index}`} asset={asset} onZoom={onZoom} />)}
    </div>
  </section>
}

export function CaseStudyPreview() {
  const { slug } = useParams()
  const index = previewProjects.findIndex(project => project.slug === slug)
  const project = previewProjects[index]
  const next = previewProjects[(index + 1) % previewProjects.length]
  const [zoomed, setZoomed] = useState(null)
  useEffect(() => {
    const previous = document.title
    document.title = `${project?.title || 'Project not found'} — Ahwon Cho · Preview`
    setZoomed(null)
    return () => { document.title = previous }
  }, [project])
  if (!project) return <div className="p2-page"><PreviewHeader /><div className="p2-container p2-not-found"><h1>That project isn’t in this preview.</h1><Link to="/work2">Back to selected work</Link></div></div>
  return <div className={`p2-page p2-case p2-theme--${project.theme}`}>
    <PreviewHeader original={`/project/${project.slug}`} />
    <article>
      <div className="p2-container">
        <div className="p2-case-breadcrumb"><Link to="/work2"><Arrow back /> Selected work</Link><span className="p2-preview-label">Preview 02</span></div>
        <section className="p2-case-hero" aria-labelledby="p2-case-title">
          <div className="p2-case-intro"><p className="p2-eyebrow">{project.client} / {project.title}</p><h1 id="p2-case-title">{project.hook}</h1><p className="p2-case-summary">{project.summary}</p>
            <dl className="p2-facts"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>Timeline</dt><dd>{project.time}</dd></div><div><dt>Project status</dt><dd>{project.status}</dd></div></dl>
          </div>
          <div className="p2-case-cover"><Artwork project={project} eager /></div>
        </section>
      </div>
      <nav className="p2-chapter-nav" aria-label="Case-study chapters"><div className="p2-container"><a href="#overview">Overview</a><a href="#decisions">Design decisions</a><a href="#craft">Visual craft</a><a href="#reflection">Reflection</a></div></nav>
      <div className="p2-container">
        <section id="overview" className="p2-overview"><div><p className="p2-eyebrow">The challenge</p><h2>What needed to change.</h2><p>{project.context}</p></div><div><p className="p2-eyebrow">My contribution</p><h2>Where I made a difference.</h2><p>{project.contribution}</p></div></section>
        <div id="decisions" className="p2-decisions"><h2 className="p2-section-label">The design decisions</h2>{project.decisions.map(chapter => <Chapter key={chapter.label} chapter={chapter} onZoom={setZoomed} />)}</div>
        <div id="craft"><h2 className="p2-section-label">A closer look</h2><Chapter chapter={project.craft} onZoom={setZoomed} craft /></div>
        <section id="reflection" className="p2-reflection"><div><p className="p2-eyebrow">Outcome & reflection</p><h2>{project.lesson}</h2></div><p>{project.result}</p></section>
        <Link className="p2-next-project" to={`/project2/${next.slug}`}><div><p className="p2-eyebrow">Next case study</p><h2>{next.title}</h2><p>{next.discipline}</p></div><Arrow /></Link>
      </div>
    </article>
    <Footer />
    <ImageDialog asset={zoomed} onClose={() => setZoomed(null)} />
  </div>
}
