import { Link } from 'react-router-dom'

export default function ProjectCard({ project, index = 0 }) {
  const detail = project.company || (!project.wip ? project.type : null)

  return (
    <Link to={`/project/${project.slug}`} className="work-project" aria-label={`View case study: ${project.title}`}>
      <div className="work-project__image">
        <img src={project.thumbnail || project.image} alt={project.thumbnailAlt || `${project.title}: design preview`}
          width={project.thumbnailWidth || 1600} height={project.thumbnailHeight || 980} loading={index < 2 ? 'eager' : 'lazy'} />
      </div>
      <div className="work-project__caption">
        <h2>
          {project.title}
          {detail && <span className="work-project__company"> / {detail}</span>}
        </h2>
        {project.wip && <span className="work-project__status">In progress</span>}
      </div>
    </Link>
  )
}
