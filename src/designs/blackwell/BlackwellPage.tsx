import { useEffect, useState } from 'react'
import './blackwell.css'

const cases = [
  { year: '2025', detail: 'Mid-market manufacturer, £40m debt. Completed in eleven weeks.' },
  { year: '2024', detail: 'Retail chain administration. Creditors recovered 62p in the pound.' },
]

export function BlackwellPage() {
  const [viewers, setViewers] = useState(3)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((v) => Math.max(1, v + (Math.random() > 0.5 ? 1 : -1)))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const h = document.documentElement.scrollHeight - window.innerHeight
      setStep(h > 0 ? Math.min(2, Math.floor((y / h) * 3)) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="blackwell">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="blackwell__masthead px-4 sm:px-12 py-8 text-center">
        <p className="text-xs uppercase tracking-[0.4em] m-0 mb-2 text-[var(--b-muted)]">
          Restructuring Advisory
        </p>
        <p className="text-4xl sm:text-5xl font-black m-0 tracking-tight">Blackwell</p>
        <p className="text-sm m-0 mt-2 text-[var(--b-muted)]">London · since 2008</p>
      </header>

      <div className="px-4 sm:px-12 py-3 border-y border-[var(--b-rule)] flex justify-between text-xs">
        <p className="m-0 blackwell__counter">
          <span className="blackwell__pulse inline-block w-2 h-2 rounded-full bg-[var(--b-accent)] mr-2 align-middle" aria-hidden="true" />
          {viewers} reading now
        </p>
        <p className="m-0 text-[var(--b-muted)]">Step {step + 1} of 3</p>
      </div>

      <main id="main">
        <section className="relative">
          <img
            src="/assets/blackwell/hero.jpg"
            alt="Empty London boardroom with harsh window light"
            className="w-full aspect-[16/9] sm:aspect-[21/9] object-cover"
          />
          <div className="px-4 sm:px-12 py-12 max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-black m-0 leading-none tracking-tight">
              Quiet deals.
            </h1>
          </div>
        </section>

        <section className="px-4 sm:px-12 py-8 max-w-2xl">
          <p className="text-lg leading-relaxed m-0 mb-6">
            Blackwell advises companies mid-crisis. We don&apos;t publish client names.
          </p>
          <p className="text-base text-[var(--b-muted)] m-0 mb-12">
            Last quarter: four mandates. Two closed.
          </p>

          {cases.map((c) => (
            <article key={c.year} className="blackwell__case mb-8">
              <h2 className="text-sm uppercase tracking-widest m-0 mb-2 text-[var(--b-muted)]">
                {c.year}
              </h2>
              <p className="text-base m-0 leading-relaxed">{c.detail}</p>
            </article>
          ))}

          <figure className="my-12 -mx-4 sm:mx-0">
            <img
              src="/assets/blackwell/newspaper.jpg"
              alt="Close-up of financial newspaper stock tables"
              className="w-full"
              loading="lazy"
            />
          </figure>

          <figure className="mb-12">
            <img
              src="/assets/blackwell/corridor.jpg"
              alt="Long empty corporate corridor in black and white"
              className="w-full aspect-[16/10] object-cover"
              loading="lazy"
            />
          </figure>
        </section>

        <section className="px-4 sm:px-12 py-12 border-t border-[var(--b-rule)] text-center">
          <p className="text-sm mb-4 m-0">One number. No forms.</p>
          <a
            href="tel:+442071234567"
            className="inline-flex items-center justify-center text-2xl font-bold tracking-tight underline underline-offset-4"
          >
            +44 20 7123 4567
          </a>
        </section>
      </main>

      <footer className="px-4 sm:px-12 py-8 text-xs text-[var(--b-muted)] border-t border-[var(--b-rule)]">
        <p className="m-0">Confidential advisory · FCA registered</p>
      </footer>
    </div>
  )
}
