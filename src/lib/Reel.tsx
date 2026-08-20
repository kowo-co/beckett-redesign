import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * The only <video> in the build. It autoplays silently when motion is welcome,
 * and when prefers-reduced-motion is set it holds on the poster frame and hands
 * over a real 44px play control instead. Pages style it through the class they
 * pass in; nothing about the look lives here.
 */
export function Reel({
  src,
  poster,
  className,
  label,
  playLabel = 'Play',
  style,
}: {
  src: string
  poster: string
  className?: string
  /** Describes the footage for screen readers. */
  label: string
  playLabel?: string
  style?: React.CSSProperties
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.pause()
      setPlaying(false)
      return
    }
    const go = el.play()
    if (go && typeof go.catch === 'function') go.catch(() => setPlaying(false))
  }, [reduced])

  return (
    <div className={className} style={style} data-reel>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {reduced && (
        <button
          type="button"
          className="reel-play"
          onClick={() => {
            const el = ref.current
            if (!el) return
            if (el.paused) void el.play()
            else el.pause()
          }}
        >
          {playing ? 'Pause' : playLabel}
        </button>
      )}
    </div>
  )
}
