import { Link } from 'react-router-dom'
import { getProjectBySlug, getAdjacentProjects } from '../data/projects'
import CaseStudyFigure from '../components/CaseStudyFigure'
import './GPUFlightCaseStudy.css'

export default function GPUFlightCaseStudy() {
  const project = getProjectBySlug('gpuflight')
  const { prev, next } = getAdjacentProjects(project.slug)

  return (
    <article className="case-study gpu-case" aria-label="Case study: GPU Flight">
      <header className="gpu-case__container gpu-case__header">
        <Link className="portfolio-text-link" to="/work">← All work</Link>
        <div className="gpu-case__identity">
          <p>{project.company} <span aria-hidden="true">/</span> Product design</p>
          <span className="gpu-case__status">Work in progress</span>
        </div>
        <h1>{project.title}</h1>
        <p className="gpu-case__subtitle">{project.subtitle}</p>
        <p className="gpu-case__lead">{project.tldr}</p>
        <dl className="gpu-case__facts">
          <div><dt>My contribution</dt><dd>Product design, Verdant 2, design review, and AI-assisted frontend development</dd></div>
          <div><dt>Collaboration</dt><dd>Andy Shin, software engineer</dd></div>
          <div><dt>Year</dt><dd>{project.timeline}</dd></div>
        </dl>
        <nav className="gpu-case__contents" aria-label="Case study sections">
          <a href="#gpu-system">The design system <span aria-hidden="true">↓</span></a>
          <a href="#gpu-interface">Product application <span aria-hidden="true">↓</span></a>
          <a href="#gpu-process">Review and revision <span aria-hidden="true">↓</span></a>
          <a href="#gpu-progress">Progress & next steps <span aria-hidden="true">↓</span></a>
        </nav>
      </header>

      <div className="gpu-case__container gpu-case__hero">
        <CaseStudyFigure src={project.image} alt={project.imageAlt}
          caption={project.imageCaption}
          note="Select any image to inspect the original artifact at full size." />
      </div>

      <section className="gpu-case__container gpu-case__context" aria-labelledby="gpu-context">
        <div><span className="portfolio-eyebrow">Context</span><h2 id="gpu-context">{project.contextHeading}</h2><p>{project.overview}</p></div>
        <div><span className="portfolio-eyebrow">Design challenge</span><h2>{project.problemHeading}</h2><p>{project.problem}</p></div>
      </section>

      <section id="gpu-system" className="gpu-case__system" aria-labelledby="gpu-system-heading">
        <div className="gpu-case__container">
          <span className="portfolio-eyebrow">01 / The design system</span>
          <h2 id="gpu-system-heading">{project.systemHeading}</h2>
          <p className="gpu-case__section-intro">{project.systemIntro}</p>
          {project.featureSections.map((section, index) => (
            <section className="gpu-case__system-chapter" key={section.label} aria-labelledby={`gpu-system-${index}`}>
              <div className="gpu-case__chapter-copy">
                <div><span className="portfolio-eyebrow">{section.label}</span><h3 id={`gpu-system-${index}`}>{section.heading}</h3></div>
                <p>{section.intro}</p>
              </div>
              {section.images.map(img => <CaseStudyFigure key={img.src} {...img} />)}
            </section>
          ))}
        </div>
      </section>

      <section id="gpu-interface" className="gpu-case__container gpu-case__chapter" aria-labelledby="gpu-interface-heading">
        <span className="portfolio-eyebrow">02 / Product application</span>
        <h2 id="gpu-interface-heading">{project.interfaceHeading}</h2>
        <p className="gpu-case__section-intro">{project.interfaceIntro}</p>
        <ol className="gpu-case__decisions">
          {project.interfaceDecisions.map(({ title, text }, index) => (
            <li key={title}><span className="gpu-case__number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>
          ))}
        </ol>
        <div className="gpu-case__interface-images">
          {project.interfaceImages.map(img => <CaseStudyFigure key={img.src} {...img} />)}
        </div>
      </section>

      <section id="gpu-process" className="gpu-case__container gpu-case__chapter" aria-labelledby="gpu-process-heading">
        <span className="portfolio-eyebrow">03 / Review and revision</span>
        <h2 id="gpu-process-heading">{project.processHeading}</h2>
        <div className="gpu-case__process">
          {project.process.map(step => <div key={step.phase}><h3>{step.phase}</h3><p>{step.description}</p></div>)}
        </div>
      </section>

      <section id="gpu-progress" className="gpu-case__container gpu-case__chapter gpu-case__progress" aria-labelledby="gpu-progress-heading">
        <span className="portfolio-eyebrow">04 / Current status</span>
        <h2 id="gpu-progress-heading">What’s in place, and what comes next</h2>
        <div className="gpu-case__progress-grid">
          <div><h3>Work produced so far</h3><ul>{project.outcomes.map(item => <li key={item}>{item}</li>)}</ul></div>
          <div><h3>Next to validate</h3><ul>{project.validationPlan.map(item => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <p className="gpu-case__status-note">{project.reflection}</p>
      </section>

      <nav className="gpu-case__container gpu-case__project-nav" aria-label="Project navigation">
        {prev && <Link to={`/project/${prev.slug}`} aria-label={`Previous project: ${prev.title}`}><span>← Previous project</span><strong>{prev.title}</strong></Link>}
        {next && <Link to={`/project/${next.slug}`} aria-label={`Next project: ${next.title}`}><span>Next project →</span><strong>{next.title}</strong></Link>}
      </nav>
    </article>
  )
}
