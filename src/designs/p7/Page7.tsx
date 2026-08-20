import { useEffect, useRef } from 'react'
import { DISCORD } from '../../content/pages'
import { Reel } from '../../lib/Reel'
import { useReducedMotion } from '../../lib/useReducedMotion'
import './p7.css'

/**
 * OVERPRINT. A riso poster that went through the drum twice and never lined the
 * second pass up. Every ink pass that is not the black one is a pseudo element
 * carrying attr(data-ink), so the misregistration is real duplicated artwork
 * without duplicating a single word of copy in the DOM.
 */

const MARQUEE = 'SHIPPED WHILE YOU SLEPT'

/**
  * One repeat of the ticker line. Two of these ride the track, so it loops.
  * Only the very first copy is exposed: a reader hears the line once, not once
  * per printed repeat.
  */
function Strip({ silent }: { silent?: boolean }) {
  return (
    <span className="p7-strip" aria-hidden={silent || undefined}>
      <span className="p7-mword" data-ink={MARQUEE}>{MARQUEE}</span>
      <span className="p7-star" aria-hidden="true">✳</span>
      <span className="p7-mword" data-ink={MARQUEE} aria-hidden="true">{MARQUEE}</span>
      <span className="p7-star" aria-hidden="true">✳</span>
    </span>
  )
}

export function Page7() {
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // Pointer nudges the off-register plates a couple of pixels, the way a sheet
  // shifts under the drum. Off entirely when motion is not welcome.
  useEffect(() => {
    if (reduced) return
    const el = root.current
    if (!el) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const x = (e.clientX / window.innerWidth - 0.5) * 2
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        el.style.setProperty('--sx', `${(x * 3).toFixed(2)}px`)
        el.style.setProperty('--sy', `${(y * 3).toFixed(2)}px`)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduced])

  return (
    <div className="p7" ref={root}>
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="p7-hand" aria-hidden="true">
        <img className="p7-hand-key" src="/a/7/hand.jpg" alt="" width={1024} height={1024} />
        <span className="p7-hand-off">
          <img src="/a/7/hand.jpg" alt="" width={1024} height={1024} />
        </span>
      </div>

      <Ticker ink="pink" />

      <main id="main" className="p7-sheet">
        <div className="p7-hero">
          <h1 className="p7-h1">
            <span className="p7-l p7-l1" data-ink="Ask.">Ask.</span>{' '}
            <span className="p7-l p7-l2" data-ink="Merged.">Merged.</span>{' '}
            <span className="p7-l p7-l3" data-ink="Ask">Ask</span>{' '}
            <span className="p7-vert" data-ink="again.">again.</span>
          </h1>
        </div>

        {/* The scrap keeps its ragged clip on an inner wrapper so the tape that
            overhangs the torn edge is not clipped away with it. */}
        <div className="p7-scrap p7-scrap-riso">
          <span className="p7-scrap-in">
            <img src="/a/7/riso.jpg" alt="" width={1024} height={1536} />
            <span className="p7-scrap-pass">
              <img src="/a/7/riso.jpg" alt="" width={1024} height={1536} />
            </span>
          </span>
        </div>

        <div className="p7-plate">
          <Reel
            src="/a/7/press.mp4"
            poster="/a/7/press-poster.jpg"
            label="A press drum rolling fluorescent pink ink onto a stack of paper."
            className="p7-reel"
            playLabel="Play"
          />
          <p className="p7-sticker">NO TICKET. NO STANDUP.</p>
        </div>

        <div className="p7-scrap p7-scrap-cut">
          <span className="p7-scrap-in">
            <img src="/a/7/cut.jpg" alt="" width={1024} height={1024} />
            <span className="p7-scrap-pass">
              <img src="/a/7/cut.jpg" alt="" width={1024} height={1024} />
            </span>
          </span>
        </div>

        <span className="p7-reg p7-reg-a" aria-hidden="true" />
        <span className="p7-reg p7-reg-b" aria-hidden="true" />
        <span className="p7-inks" aria-hidden="true" />

        <p className="p7-body">
          The loop gets shorter every time. Ask on Monday, get a link. On Tuesday ask for something bigger.
        </p>

        <Ticker ink="blue" reversed />

        <div className="p7-foot">
          <p className="p7-fogg">Fogg: Conditioning. The loop rewards the next ask.</p>
          <a className="p7-cta" href={DISCORD}>Run it again</a>
        </div>
      </main>

      <span className="p7-screen" aria-hidden="true" />
      <span className="p7-grain" aria-hidden="true" />

      <a className="homebar" href="/">Index</a>
    </div>
  )
}

function Ticker({ ink, reversed }: { ink: 'pink' | 'blue'; reversed?: boolean }) {
  const silent = ink === 'blue'
  return (
    <div className={`p7-tick p7-tick-${ink}${reversed ? ' p7-tick-rev' : ''}`}>
      <div className="p7-track">
        <Strip silent={silent} />
        <Strip silent />
      </div>
    </div>
  )
}
