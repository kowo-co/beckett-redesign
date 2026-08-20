import { useState } from 'react'
import './halt.css'

export function HaltPage() {
  const [paused, setPaused] = useState(false)

  return (
    <div className="halt">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <main id="main">
        <section className="halt__hero">
          <h1>Stop adding.</h1>
        </section>

        <section className="px-6 sm:px-16 pb-24 max-w-xl">
          <p className="mb-16">
            Halt Bureau removes process from Swiss manufacturers. Zurich since 2004.
          </p>

          <figure className="mb-24">
            <img
              src="/assets/halt/office.jpg"
              alt="Empty Swiss office with single window and white wall"
              className="w-full"
            />
          </figure>

          <p className="mb-16">
            Last engagement: a watchmaker cut twelve approval steps to three.
          </p>

          <button
            type="button"
            className={`halt__pause-btn ${paused ? 'halt__pause-btn--active' : ''}`}
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? 'Paused — we will call' : 'Pause your next hire'}
          </button>

          <figure className="mt-24 mb-24">
            <img
              src="/assets/halt/chair.jpg"
              alt="Single empty chair in white room"
              className="w-full"
              loading="lazy"
            />
          </figure>

          <figure>
            <img
              src="/assets/halt/horizon.jpg"
              alt="Minimal horizon line with fog over lake"
              className="w-full"
              loading="lazy"
            />
          </figure>
        </section>
      </main>

      <footer className="px-6 sm:px-16 py-12 text-xs text-[var(--h-muted)] tracking-widest uppercase">
        halt.ch
      </footer>
    </div>
  )
}
