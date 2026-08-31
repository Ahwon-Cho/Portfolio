import { useState, useEffect, useRef } from 'react'
import trackSrc from '../media/Plucked Strings and Vibraphone.mp3'

/* Resting heights keep the 4 bars visible while paused — they only animate
   once the track is actually playing. */
const BARS = [
  { delay: '0s',    pausedHeight: 8  },
  { delay: '0.2s',  pausedHeight: 13 },
  { delay: '0.1s',  pausedHeight: 5  },
  { delay: '0.3s',  pausedHeight: 10 },
]

/* Sized to stack under the bars inside the 44px circle rather than sit
   beside them — smaller than the original pill version for that reason. */
function SoundIcon({ active }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-3 h-3 transition-colors duration-300 ${active ? 'text-ink-700' : 'text-ink-400'}`}
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  )
}

export default function MusicPlayer() {
  const [muted, setMuted] = useState(true)
  const audioRef  = useRef(null)
  const playedRef = useRef(false)

  /* Muted autoplay so the track is buffered and unmuting is instant. */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted  = true
    audio.volume = 0.5
    audio.play()
      .then(() => { playedRef.current = true })
      .catch(() => {})
  }, [])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    /* If autoplay was blocked, the first click doubles as the start gesture. */
    if (!playedRef.current) {
      audio.play()
        .then(() => { playedRef.current = true })
        .catch(() => {})
    }
    audio.muted = !muted
    setMuted(m => !m)
  }

  const playing = !muted

  return (
    /* `group` + `relative` so the label can float above the pill rather than
       stack on top of it — the pill sits in a row with Skip intro, and a
       label that took layout space would push that row out of alignment. */
    <div className="group relative flex items-center">
      <audio ref={audioRef} src={trackSrc} preload="auto" loop />

      {/* Invitation — held back until hover or keyboard focus. Sits to the
          left of the circle, running back into the frame rather than out
          toward the corner. Absolutely positioned, so appearing costs no
          layout. The button carries the same words in its aria-label, so
          this stays hidden from AT. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3
                   whitespace-nowrap text-xs font-medium tracking-[0.04em] text-ink-500 select-none
                   opacity-0 transition-opacity duration-200 motion-reduce:transition-none
                   group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {playing ? 'Click to mute music' : 'Click to play music'}
      </span>

      {/* Pill: sound icon + 4 bars, side by side */}
      <button
        onClick={toggleMute}
        aria-label={playing ? 'Mute music' : 'Play music'}
        aria-pressed={playing}
        className="flex flex-col items-center justify-center gap-0.5 w-11 h-11 rounded-full bg-white/70
                   backdrop-blur-md border border-ink-200 shadow-lg hover:bg-white/90 transition duration-200"
      >
        <span className="flex items-end gap-[3px] h-[14px]" aria-hidden="true">
          {BARS.map(({ delay, pausedHeight }, i) => (
            <span
              key={i}
              className={`w-[3px] rounded-full transition-colors duration-300 ${
                playing ? 'bg-ink-600 animate-bar-bounce' : 'bg-ink-300'
              }`}
              style={playing ? { animationDelay: delay } : { height: `${pausedHeight}px` }}
            />
          ))}
        </span>

        <SoundIcon active={playing} />
      </button>
    </div>
  )
}
