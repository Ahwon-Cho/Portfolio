/* Shared image lightbox — used by every case study page and by ProjectDetail.
   UX: Escape closes, body scroll locked while open, backdrop click dismisses. */
import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function Lightbox({ src, alt, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const [zoomed, setZoomed] = useState(false)
  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const controls = [...dialogRef.current.querySelectorAll('button')]
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus({ preventScroll: true })
    }
  }, [onClose])

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="case-image-dialog fixed inset-0 z-[200] bg-zinc-950/95 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Full-size view: ${alt}`}
      >
        <div className={`case-image-dialog__viewport ${zoomed ? 'is-zoomed' : ''}`}>
          <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
        </div>
        <button type="button" className="case-image-dialog__zoom" aria-pressed={zoomed}
          onClick={(e) => { e.stopPropagation(); setZoomed(value => !value) }}>
          {zoomed ? 'Fit image' : 'Zoom in'}
        </button>
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          aria-label="Close image"
          className="case-image-dialog__close absolute top-5 right-5 w-10 h-10 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>, document.body
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
