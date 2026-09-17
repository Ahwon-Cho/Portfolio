import ProjectCard from './ProjectCard'
import { featuredProjects } from '../data/projects'

export default function Projects() {
  return (
    <section id="projects" className="portfolio-page work-page" aria-labelledby="work-title">
      <div className="portfolio-container">
        <header className="portfolio-page-heading">
          <h1 id="work-title">Selected work<span>.</span></h1>
          <p>UX + visual design</p>
        </header>
        <div className="work-gallery">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
