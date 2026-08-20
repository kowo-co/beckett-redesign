import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { SplitFlap } from './SplitFlap'
import { VideoWall } from './VideoWall'
import './p9.css'

const HEAD = 'It messages you when it is done.'
/** Blank tiles along the deck's top seam, same grammar as the board's sub row. */
const SLOTS = 34

export function Page9() {
  const reduced = useReducedMotion()
  const head = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = head.current
    if (!el) return
    if (reduced) {
      el.style.setProperty('--p9-slide', '0px')
      return
    }
    let raf = 0
    const apply = () => {
      raf = 0
      el.style.setProperty('--p9-slide', `${(window.scrollY * -0.55).toFixed(1)}px`)
    }
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div className="p9">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <main id="main" className="p9-main">
        <div className="p9-rail p9-rail--top" aria-hidden="true" />

        <div className="p9-marquee">
          <h1 className="p9-h1" ref={head} data-line={HEAD}>
            {HEAD}
          </h1>
        </div>

        <div className="p9-hair" aria-hidden="true" />

        <section className="p9-stage">
          <VideoWall />
          <div className="p9-chassis">
            <SplitFlap />
          </div>
        </section>

        <div className="p9-plate">
          <img src="/a/9/board.jpg" alt="" width={1536} height={1024} />
        </div>

        {/* The lower deck of the same rig: one more sheet of black plastic,
            kicked off the left edge of the page so the stack stops being an
            axis. The CTA is a flap cell that landed on yellow and hangs over
            the deck's right edge. */}
        <section className="p9-foot">
          <div className="p9-deck">
            <div className="p9-strip" aria-hidden="true">
              {Array.from({ length: SLOTS }, (_, i) => (
                <span key={i} className="p9-slot" />
              ))}
            </div>

            <p className="p9-say">
              Not when you ask for a status. When the thing is actually finished.
            </p>

            <a className="p9-cta" href="https://discord.com">
              <span className="p9-cta-face">
                Get the ping
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
                  <path
                    d="M3 12h16M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
              <span className="p9-cta-seam" aria-hidden="true" />
            </a>

            <p className="p9-fogg">Fogg: Prompt. The nudge comes from its side.</p>
          </div>
        </section>

        <div className="p9-hair p9-hair--bot" aria-hidden="true" />
        <div className="p9-rail p9-rail--bot" aria-hidden="true" />
      </main>

      <a className="homebar" href="/">
        Index
      </a>
    </div>
  )
}
