import { RESUME_FILE } from '../data/resume'

export default function ResumePage() {
  return (
    <section className="portfolio-page resume-page" aria-labelledby="resume-title">
      <div className="portfolio-container">
        <header className="portfolio-page-heading">
          <h1 id="resume-title">Résumé<span>.</span></h1>
          <a className="portfolio-text-link" href={RESUME_FILE} target="_blank" rel="noopener noreferrer">Open PDF <span aria-hidden="true">↗</span></a>
        </header>
        <object className="resume-document" data={RESUME_FILE} type="application/pdf" aria-label="Ahwon Cho: UX and visual design résumé">
          <p>Your browser cannot display this PDF. <a className="portfolio-text-link" href={RESUME_FILE}>View résumé</a></p>
        </object>
      </div>
    </section>
  )
}
