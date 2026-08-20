import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Reel } from '../../lib/Reel'
import { DISCORD } from '../../content/pages'
import './p5.css'

const STEPS = [
  'You type a sentence.',
  'A branch appears.',
  'Code lands on it.',
  'A second agent grinds the diff.',
  'The pull request opens itself.',
  'It merges.',
  'Production updates.',
  'A message arrives. Not a progress bar.',
]

const TOTAL = STEPS.length

const themeVars = {
  '--hb-bg': '#141414',
  '--hb-fg': '#f5f5f4',
  '--hb-line': 'rgba(245, 245, 244, 0.4)',
  '--focus': '#f5f5f4',
} as CSSProperties

export function Page5() {
  const [step, setStep] = useState(0)
  const isLast = step === TOTAL - 1

  const nextRef = useRef<HTMLButtonElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const restartedRef = useRef(false)

  const advance = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL - 1))
  }, [])
  const back = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
  }, [])
  const restart = useCallback(() => {
    restartedRef.current = true
    setStep(0)
  }, [])

  // The Next/Again button unmounts the instant `isLast` flips (replaced by
  // Again + the Discord link), and restart() swaps Again back out for Next.
  // Move focus onto whichever primary control just took its place instead
  // of letting it fall through to <body>.
  useEffect(() => {
    if (isLast) {
      ctaRef.current?.focus()
    } else if (restartedRef.current && step === 0) {
      nextRef.current?.focus()
      restartedRef.current = false
    }
  }, [step, isLast])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        advance()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        back()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance, back])

  const progress = ((step + 1) / TOTAL) * 100

  return (
    <div className="p5" style={themeVars}>
      <a className="skip-link" href="#main">Skip to content</a>

      <main id="main" className="p5-stage">
        <img
          className={`p5-streak${isLast ? ' is-on' : ''}`}
          src="/a/5/streak.jpg"
          alt=""
          width={1024}
          height={1536}
          aria-hidden="true"
        />

        <div className="p5-frame">
          <p className="p5-readout">
            {String(step + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </p>
          <div className="p5-herowrap">
            <div className="p5-band">
              <Reel
                src="/a/5/relay.mp4"
                poster="/a/5/relay-poster.jpg"
                label="Relay machinery, looping"
                className="p5-reel"
              />
            </div>
            <h1 className="p5-line" aria-live="polite">{STEPS[step]}</h1>
          </div>
          <p className="p5-fogg">Fogg: Tunneling. One step, then the next.</p>
        </div>

        <div className="p5-controls">
          <button
            type="button"
            className={`p5-back${step === 0 ? ' is-hidden' : ''}`}
            onClick={back}
            disabled={step === 0}
            tabIndex={step === 0 ? -1 : 0}
          >
            Back
          </button>

          <div className="p5-primary">
            {!isLast && (
              <button type="button" className="p5-next" onClick={advance} ref={nextRef}>
                Next
                <svg className="p5-arrow" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h15M13 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {isLast && (
              <>
                <button type="button" className="p5-again" onClick={restart}>
                  Again
                </button>
                <a className="p5-cta" href={DISCORD} target="_blank" rel="noreferrer" ref={ctaRef}>
                  Start it in Discord
                </a>
              </>
            )}
          </div>
        </div>

        <div className="p5-hairline" aria-hidden="true">
          <div className="p5-hairline-fill" style={{ width: `${progress}%` }} />
        </div>
      </main>

      <a className="homebar" href="/">Index</a>
    </div>
  )
}
