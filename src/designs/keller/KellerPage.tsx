import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import './keller.css'

const phases = [
  { label: '01 Survey', detail: 'Fort Duquesne retrofit, 2023. Corrosion the owner missed.' },
  { label: '02 Model', detail: 'Mon Valley mill truss. Six weeks, no shutdown.' },
  { label: '03 Sign-off', detail: 'Stamped drawings. Your insurer reads them.' },
]

export function KellerPage() {
  const reduced = useReducedMotion()
  const [load, setLoad] = useState(40)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const phaseRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (reduced) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('keller__phase--visible')
        })
      },
      { threshold: 0.4 },
    )
    phaseRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [reduced])

  const rating =
    load < 30 ? 'Light duty' : load < 60 ? 'Standard span' : load < 85 ? 'Heavy freight' : 'Mill grade'

  return (
    <div className="keller keller__grid-bg">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="flex items-center justify-between px-4 py-4 sm:px-8 border-b-2 border-[var(--k-ink)]">
        <p className="keller__display text-2xl sm:text-3xl m-0">KELLER &amp; DRUMM</p>
        <p className="text-xs m-0 text-[var(--k-muted)]">Pittsburgh · est. 1961</p>
      </header>

      <main id="main">
        <section className="relative min-h-[70dvh] flex flex-col justify-end overflow-hidden">
          <img
            src="/assets/keller/hero.jpg"
            alt="Steel bridge with blueprint overlay against Pittsburgh skyline"
            className="keller__hero-img absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 p-4 sm:p-8 bg-gradient-to-t from-[var(--k-bg)] via-[var(--k-bg)]/80 to-transparent">
            <h1 className="keller__display text-6xl sm:text-8xl md:text-9xl m-0 text-[var(--k-ink)]">
              Steel holds.
            </h1>
          </div>
        </section>

        <section className="px-4 sm:px-8 py-12 max-w-3xl">
          <p className="text-sm leading-relaxed m-0 mb-8">
            Keller &amp; Drumm assesses steel structures others walk past. Bridges, mills, trusses.
          </p>

          <div className="space-y-8 mb-12">
            {phases.map((p, i) => (
              <article
                key={p.label}
                ref={(el) => {
                  phaseRefs.current[i] = el
                }}
                className="keller__phase opacity-40 translate-x-4 transition-all duration-500 motion-reduce:opacity-100 motion-reduce:translate-x-0"
              >
                <h2 className="keller__display text-3xl m-0 mb-2">{p.label}</h2>
                <p className="text-sm m-0 text-[var(--k-muted)]">{p.detail}</p>
              </article>
            ))}
          </div>

          <div className="p-6 bg-[var(--k-surface)] border-2 border-[var(--k-ink)] mb-12">
            <label htmlFor="load-slider" className="block text-xs uppercase tracking-widest mb-4">
              Span load estimate (tons)
            </label>
            <input
              id="load-slider"
              type="range"
              min={10}
              max={100}
              value={load}
              onChange={(e) => setLoad(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-2xl keller__display mt-4 m-0">
              {load}t — <span className="text-[var(--k-accent)]">{rating}</span>
            </p>
          </div>

          <figure className="mb-12 -mx-4 sm:mx-0">
            <img
              src="/assets/keller/blueprint.jpg"
              alt="Technical truss engineering drawing on aged blueprint paper"
              className="w-full"
              loading="lazy"
            />
            <figcaption className="text-xs text-[var(--k-muted)] mt-2 px-4 sm:px-0">
              Truss review sheet, Mon Valley
            </figcaption>
          </figure>

          <figure className="mb-12">
            <img
              src="/assets/keller/mill.jpg"
              alt="Interior of vintage steel mill with molten steel glow"
              className="w-full keller__hero-img"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="px-4 sm:px-8 py-12 border-t-2 border-[var(--k-ink)] bg-[var(--k-surface)]">
          <p className="text-sm mb-4 m-0">One line. We reply within a day.</p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-lg"
            onSubmit={(e) => {
              e.preventDefault()
              if (email.includes('@')) setSent(true)
            }}
          >
            <label htmlFor="keller-email" className="sr-only">
              Email
            </label>
            <input
              id="keller-email"
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-sm"
            />
            <button
              type="submit"
              className="keller__btn px-6 py-3 bg-[var(--k-ink)] text-[var(--k-bg)] text-sm uppercase tracking-widest cursor-pointer border-0"
            >
              Send
            </button>
          </form>
          {sent && (
            <p className="text-sm text-[var(--k-accent)] mt-4 m-0" role="status">
              Received. Check your inbox tomorrow.
            </p>
          )}
        </section>
      </main>

      <footer className="px-4 sm:px-8 py-6 text-xs text-[var(--k-muted)] border-t border-[var(--k-grid)]">
        <p className="m-0">412 · structural assessment · stamped drawings</p>
      </footer>
    </div>
  )
}
