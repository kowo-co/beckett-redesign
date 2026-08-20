import { useState } from 'react'
import './overprint.css'

export function OverprintPage() {
  const [ripped, setRipped] = useState(false)

  return (
    <div className="overprint">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="relative px-4 sm:px-8 pt-8 pb-4 overflow-hidden">
        <p className="overprint__sans m-0 mb-2" style={{ transform: 'rotate(3deg)' }}>
          BERLIN · EST. 2012
        </p>
        <h1 className="overprint__hero-text m-0">RIP IT.</h1>
        <img
          src="/assets/overprint/collage.jpg"
          alt=""
          aria-hidden="true"
          className="overprint__float w-32 sm:w-48 opacity-70"
          style={{ top: '10%', right: '-5%', transform: 'rotate(12deg)' }}
        />
      </header>

      <main id="main" className="px-4 sm:px-8 pb-16">
        <p className="overprint__sans max-w-xs mb-8 leading-relaxed" style={{ transform: 'rotate(-1deg)' }}>
          Overprint Collective breaks brand systems on purpose. Posters, packaging, riots.
        </p>

        <div className="overprint__grid mb-12">
          <div className="overprint__cell">
            <img
              src="/assets/overprint/overprint.jpg"
              alt="Misaligned CMYK overprint with typography fragments"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overprint__cell overprint__cell--offset">
            <p className="overprint__sans m-0 leading-relaxed">
              Kreuzberg beer label, 2025. Three misprints kept.
            </p>
          </div>
          <div className="overprint__cell overprint__cell--overlap">
            <img
              src="/assets/overprint/riso.jpg"
              alt="Risograph print with fluorescent pink and black layers"
              className="w-full h-32 sm:h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <section className="relative mb-12" aria-live="polite">
          <p
            className="overprint__hero-text m-0"
            style={{
              color: ripped ? 'var(--op-red)' : 'var(--op-ink)',
              transform: ripped ? 'rotate(4deg) scale(1.05)' : 'rotate(-3deg)',
              transition: 'transform 200ms',
            }}
          >
            {ripped ? 'GOOD.' : 'TOO CLEAN?'}
          </p>
          <button type="button" className="mt-6 px-6 py-3" onClick={() => setRipped(true)}>
            [ TEAR POSTER ]
          </button>
        </section>

        <img
          src="/assets/overprint/collage.jpg"
          alt="Torn street poster collage with layered fragments"
          className="w-full border-4 border-[var(--op-ink)]"
          style={{ transform: 'rotate(-1.5deg)' }}
          loading="lazy"
        />
      </main>

      <footer className="overprint__sans px-4 sm:px-8 py-6 border-t-4 border-[var(--op-ink)]">
        overprint.co · by chaos
      </footer>
    </div>
  )
}
