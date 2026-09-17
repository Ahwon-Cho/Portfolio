import { useEffect, useState } from 'react'
import './PaintedBackdrop.css'

// Structural scenery only; the foreground owns all people and hobby objects.
const SOURCES = {
  coffee: '/images/painted-motion/green-scenes-v1/coffee.webp',
  work: '/images/painted-motion/green-scenes-v1/work.webp',
  nature: '/images/painted-motion/transparent-backdrops-v1/nature.webp',
  garden: '/images/painted-motion/green-scenes-v1/garden.webp',
}

export default function PaintedBackdrop({ theme, visible, reducedMotion }) {
  const [loaded, setLoaded] = useState({})
  const [displayed, setDisplayed] = useState(theme)

  useEffect(() => {
    let active = true
    const images = Object.entries(SOURCES).map(([id, source]) => {
      const image = new Image()
      image.onload = () => { if (active) setLoaded(previous => ({ ...previous, [id]: true })) }
      image.src = source
      return image
    })
    return () => { active = false; images.forEach(image => { image.onload = null }) }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setDisplayed(theme), reducedMotion || !visible ? 0 : 300)
    return () => window.clearTimeout(timer)
  }, [theme, visible, reducedMotion])

  if (!loaded[displayed]) return null
  return <div className="painted-backdrop" data-backdrop-theme={displayed} data-backdrop-style="quiet-ink-setting" data-visible={visible} aria-hidden="true">
    <img className="painted-backdrop-image" src={SOURCES[displayed]} alt="" draggable="false" decoding="async" />
  </div>
}
