/* Shared image lightbox — used by every case study page and by ProjectDetail.
   UX: Escape closes, body scroll locked while open, backdrop click dismisses. */
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/95 backdrop-blur-md p-4 md:p-10 cursor-zoom-out"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Full-size view: ${alt}`}
      >
        <motion.img
          src={src}
          alt={alt}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          aria-label="Close image"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

/* Clickable image wrapper — shows zoom cursor, opens lightbox on click */
export function Zoomable({ src, alt, className, children }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`block w-full text-left cursor-zoom-in focus-visible:outline-2 focus-visible:outline-amber-400 rounded-xl ${className ?? ''}`}
        aria-label={`View full size: ${alt}`}
      >
        {children}
      </button>
      {open && <Lightbox src={src} alt={alt} onClose={close} />}
    </>
  )
}

/* Convenience: a zoomable <img> with sensible defaults */
export function ZoomImg({ src, alt, className }) {
  return (
    <Zoomable src={src} alt={alt}>
      <img src={src} alt={alt} className={className ?? 'w-full object-cover'} loading="lazy" />
    </Zoomable>
  )
}
