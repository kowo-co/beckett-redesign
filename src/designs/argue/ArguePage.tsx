import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import './argue.css'

const beats = [
  { headline: 'Your board is wrong.', body: null },
  { headline: 'Most strategy decks are fiction.', body: 'Pretty slides. No one acts on them.' },
  { headline: 'We pick one fight.', body: 'One argument. One memo. One meeting where someone gets uncomfortable.' },
  { headline: 'You hire us to say what your CFO won\'t.', body: 'Chicago. Four clients per year. We turn down the rest.' },
]

export function ArguePage() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [stamped, setStamped] = useState(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (reduced) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sectionRefs.current.indexOf(e.target as HTMLElement)
            if (idx >= 0) setActive(idx)
          }
        })
      },
      { threshold: 0.55 },
    )
    sectionRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [reduced])

  return (
    <div className="argue">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <div className="fixed top-4 right-4 z-50 argue__body text-xs text-[var(--a-muted)]" aria-live="polite">
        {Math.min(active + 1, beats.length + 1)} / {beats.length + 1}
      </div>

      <main id="main">
        {beats.map((beat, i) => (
          <section
            key={beat.headline}
            ref={(el) => {
              sectionRefs.current[i] = el
            }}
            className="argue__section"
            aria-current={active === i ? 'step' : undefined}
          >
            {i === 0 && (
              <img
                src="/assets/argue/hero.jpg"
                alt="Empty boardroom with spotlight on head chair"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                style={{ position: 'fixed', zIndex: -1 }}
              />
            )}
            <h1 className="argue__headline m-0 mb-6">{beat.headline}</h1>
            {beat.body && <p className="argue__body m-0 text-[var(--a-muted)]">{beat.body}</p>}
          </section>
        ))}

        <section className="argue__section items-center text-center">
          <figure className="m-0 mb-8">
            <img
              src="/assets/argue/stamp.jpg"
              alt="Red rubber stamp impression reading REJECTED"
              className={`argue__stamp w-48 sm:w-64 mx-auto ${stamped ? 'argue__stamp--hit' : ''}`}
              loading="lazy"
            />
          </figure>
          <img
            src="/assets/argue/podium.jpg"
            alt="Empty wooden podium on dark stage with spotlight"
            className="w-full max-w-md mb-10 opacity-80"
            loading="lazy"
          />
          <p className="argue__body m-0 mb-6 max-w-none">Agree? One email. We respond or we don&apos;t.</p>
          <button
            type="button"
            className="argue__agree-btn"
            disabled={stamped}
            onClick={() => setStamped(true)}
          >
            {stamped ? 'Noted. Expect silence or a call.' : 'I agree — contact me'}
          </button>
        </section>
      </main>

      <footer className="px-6 py-4 argue__body text-xs text-[var(--a-muted)] border-t border-[var(--a-ink)]">
        <p className="m-0">Argue LLC · Chicago · est. 2019</p>
      </footer>
    </div>
  )
}
