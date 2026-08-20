import { useEffect, useRef } from 'react'
import { Reel } from '../../lib/Reel'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * Nine copies of the same five second loop, each nudged to a different
 * currentTime so the wall never falls into step with itself. Under reduced
 * motion eight of them collapse to the poster frame and one honest <Reel>
 * stays, paused, with its own play control.
 */

const SRC = '/a/9/flap.mp4'
const POSTER = '/a/9/flap-poster.jpg'
/** The tile that keeps a real <Reel> even under reduced motion. Top left, so
 *  its play control is never buried behind the board. */
const LIVE = 0
const OFFSETS = [0.2, 1.15, 2.35, 3.4, 0.75, 4.1, 1.7, 2.9, 3.85]

export function VideoWall() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const cleanups: Array<() => void> = []

    root.querySelectorAll<HTMLElement>('.p9-tile').forEach((tile, i) => {
      const video = tile.querySelector('video')
      if (!video) return
      const seek = () => {
        const d = video.duration
        if (Number.isFinite(d) && d > 0) {
          try {
            video.currentTime = OFFSETS[i] % d
          } catch {
            /* seeking can throw while the media is still opening */
          }
        }
      }
      if (video.readyState >= 1) seek()
      else {
        video.addEventListener('loadedmetadata', seek, { once: true })
        cleanups.push(() => video.removeEventListener('loadedmetadata', seek))
      }
    })

    return () => cleanups.forEach((c) => c())
  }, [reduced])

  return (
    <div className="p9-wall" ref={ref}>
      {OFFSETS.map((_, i) => (
        <div className="p9-tile" key={i}>
          {reduced && i !== LIVE ? (
            <img src={POSTER} alt="" width={960} height={542} />
          ) : (
            <Reel
              src={SRC}
              poster={POSTER}
              label="A wall of filament bulbs burning in the dark"
              className="p9-reel"
            />
          )}
        </div>
      ))}
    </div>
  )
}
