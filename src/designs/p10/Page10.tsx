import { useEffect, useRef, useState } from 'react'
import { DISCORD } from '../../content/pages'
import { Reel } from '../../lib/Reel'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { useDither } from './dither'
import './p10.css'

/** ASCII rules, long enough to run past any viewport and clipped by CSS. */
const DASH = '-'.repeat(240)
const DOTS = ':'.repeat(240)

/** Narrow screens get a sparser, flatter field: the type has to own them. */
function useNarrow() {
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    setNarrow(mq.matches)
    const on = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
}

export function Page10() {
  const reduced = useReducedMotion()
  const narrow = useNarrow()
  const host = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLCanvasElement>(null)
  const inset = useRef<HTMLCanvasElement>(null)
  const head = useRef<HTMLHeadingElement>(null)

  useDither({
    canvasRef: field,
    hostRef: host,
    fallbackSrc: '/a/10/plume.jpg',
    cell: narrow ? 4 : 5,
    reduced,
    bias: (narrow ? 34 : 26) + (reduced ? 26 : 0),
    gradient: narrow ? 14 : 92,
    quietRef: head,
    quiet: narrow ? 74 : 62,
    pointer: true,
  })

  useDither({
    canvasRef: inset,
    hostRef: host,
    fallbackSrc: '/a/10/plume.jpg',
    cell: narrow ? 6 : 7,
    reduced,
    bias: 26,
    amplitude: 62,
    pointer: false,
  })

  return (
    <div className="p10" ref={host}>
      <a className="skip-link" href="#main">Skip to content</a>

      <canvas className="p10-field" ref={field} aria-hidden="true" />
      <img className="p10-lattice" src="/a/10/lattice.jpg" alt="" width={1024} height={1024} />
      <div className="p10-scan" aria-hidden="true" />
      <div className="p10-scrim" aria-hidden="true" />
      <div className="p10-crop" aria-hidden="true">
        <i /><i /><i /><i />
      </div>

      <main id="main" className="p10-main">
        <p className="p10-rule p10-rule-top" aria-hidden="true">{DASH}</p>

        <div className="p10-head">
          <h1 className="p10-h1" ref={head}>
            <span className="p10-w1">It watched</span>{' '}
            <span className="p10-w2">the whole</span>{' '}
            <span className="p10-w3">build.</span>
          </h1>
          <p className="p10-rule p10-rule-under" aria-hidden="true">{DASH}</p>
        </div>

        <div className="p10-col">
          <p className="p10-rule" aria-hidden="true">{DOTS}</p>
          <p className="p10-body">
            Every run leaves a trail. The branch, the diff, the notes the reviewer left, the
            deploy. Read it later or never read it.
          </p>
          <p className="p10-fogg">Fogg: Surveillance. It logs itself, not you.</p>
          <a className="p10-cta" href={DISCORD} target="_blank" rel="noreferrer">
            Watch it work
          </a>
        </div>

        <div className="p10-rack">
          <canvas className="p10-inset" ref={inset} aria-hidden="true" />
          <Reel
            src="/a/10/plume.mp4"
            poster="/a/10/plume-poster.jpg"
            label="Ink plume turning over in water, the footage the dither is reading."
            className="p10-reel"
          />
        </div>
      </main>

      <p className="p10-vert" aria-hidden="true">Surveillance</p>
      <a className="homebar" href="/">Index</a>
    </div>
  )
}
