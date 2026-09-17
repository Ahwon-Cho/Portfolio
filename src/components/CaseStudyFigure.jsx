import { Zoomable } from './Lightbox'

// Show a readable excerpt without editing or replacing the original artifact.
// crop coordinates are pixels in the source image; zoom always opens that source.
export default function CaseStudyFigure({ src, alt, caption, note, crop, sourceWidth, className = '' }) {
  return (
    <figure className={`case-evidence ${className}`}>
      <Zoomable src={src} alt={alt}>
        {crop ? (
          <div className="case-evidence__crop" style={{ aspectRatio: `${crop.width} / ${crop.height}` }}>
            <img src={src} alt={alt} loading="lazy" style={{
              width: `${sourceWidth / crop.width * 100}%`,
              left: `${-crop.x / crop.width * 100}%`,
              top: `${-crop.y / crop.height * 100}%`,
            }} />
          </div>
        ) : <img src={src} alt={alt} loading="lazy" className="case-evidence__image" />}
      </Zoomable>
      <figcaption>
        <span>{caption}</span>
        {note && <p>{note}</p>}
      </figcaption>
    </figure>
  )
}
