import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { workGallery } from '../data/workGallery'
import './WorksGallery.css'

function ProjectCard({ project, index }) {
  const content = <>
    <div className="wg-artwork">
      <img src={project.image} alt="" width={project.width} height={project.height}
        loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
    </div>
    <div className="wg-caption">
      <h2>{project.title}<span className="wg-link-arrow" aria-hidden="true">{project.external ? '↗' : '→'}</span></h2>
      <p>{project.type}<span aria-hidden="true"> · </span>{project.discipline}
        {project.status && <span className="wg-status">{project.status}</span>}
      </p>
    </div>
  </>
  return <article className="wg-project">
    {project.external
      ? <a href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} — original case study, opens in a new tab`}>{content}</a>
      : <Link to={project.href} aria-label={`View ${project.title} case study`}>{content}</Link>}
  </article>
}

export default function WorksGallery() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Work — Ahwon Cho · UX & Visual Designer'
    return () => { document.title = previous }
  }, [])
  return <div className="wg-page">
    <a className="wg-skip-link" href="#wg-projects">Skip to projects</a>
    <header className="wg-header">
      <div className="wg-header-inner">
        <Link to="/landing2" className="wg-brand" aria-label="Ahwon Cho — introduction">
          <img src="/ahwon-mark.svg" width="44" height="44" alt="" />
          <span>Ahwon Cho<small>UX + Visual Designer</small></span>
        </Link>
        <nav className="wg-navigation" aria-label="Main navigation">
          <Link to="/work2" aria-current="page">Work</Link>
          <Link to="/about">About</Link>
          <a href="/resume" target="_blank" rel="noreferrer">Résumé<span className="wg-sr-only"> (opens in a new tab)</span></a>
        </nav>
      </div>
    </header>
    <main className="wg-main">
      <div className="wg-intro">
        <h1>Work</h1>
        {import.meta.env.DEV && <a className="wg-compare" href="/work" target="_blank" rel="noreferrer">Compare current page <span aria-hidden="true">↗</span></a>}
      </div>
      <section id="wg-projects" className="wg-grid" aria-label="Portfolio projects" tabIndex="-1">
        {workGallery.map((project, index) => <ProjectCard key={project.href} project={project} index={index} />)}
      </section>
    </main>
    <footer className="wg-footer">
      <div><p>Have something in mind?</p><Link to="/contact">Let’s talk <span aria-hidden="true">→</span></Link></div>
      <small>Ahwon Cho · UX & visual designer</small>
    </footer>
  </div>
}
