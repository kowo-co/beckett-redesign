import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cta, features, fork, hero, links, workflow } from '../../content/site-content'
import './filmstrip.css'

const FRAMES = [
  { id: 'hero', label: '01 / OPENING' },
  { id: 'workflow', label: '02 / PROCESS' },
  { id: 'features', label: '03 / CAPABILITIES' },
  { id: 'fork', label: '04 / FORK' },
  { id: 'cta', label: '05 / FINALE' },
] as const

export function Design4Filmstrip() {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return

    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const onScroll = () => {
      const scrollRange = container.offsetHeight - window.innerHeight
      if (scrollRange <= 0) return

      const scrolled = -container.getBoundingClientRect().top
      const progress = Math.min(1, Math.max(0, scrolled / scrollRange))
      const maxTranslate = track.scrollWidth - window.innerWidth
      track.style.transform = `translateX(-${progress * maxTranslate}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  return (
    <div className="filmstrip" ref={containerRef}>
      <a href="#frames" className="skip-link">
        Skip to frames
      </a>

      <div className="fs-fixed-ui">
        <Link to="/picker" className="fs-back">
          Gallery
        </Link>
        <div className="fs-frame-indicator" aria-live="polite">
          {FRAMES.map((f) => (
            <span key={f.id} className="fs-dot" aria-hidden="true" />
          ))}
        </div>
        <p className="fs-scroll-hint">Scroll ↓ to advance</p>
      </div>

      <div className="fs-scroll-spacer" aria-hidden="true" />

      <div id="frames" className="fs-viewport" aria-label="Filmstrip frames">
        <div className="fs-track" ref={trackRef}>
          <section className="fs-frame fs-frame-hero" aria-labelledby="fs-hero-title">
            <span className="fs-frame-label">{FRAMES[0].label}</span>
            <h1 id="fs-hero-title" className="fs-hero-title">
              {hero.headline[0]}
              <span>{hero.headline[1]}</span>
            </h1>
            <p className="fs-hero-body">{hero.subhead}</p>
            <blockquote className="fs-quote">{hero.thesis}</blockquote>
            <div className="fs-actions">
              <a href={links.github} className="fs-btn">
                Install
              </a>
              <a href={links.discord} className="fs-btn fs-btn-ghost">
                Discord
              </a>
            </div>
          </section>

          <section className="fs-frame fs-frame-workflow" aria-labelledby="fs-workflow-title">
            <span className="fs-frame-label">{FRAMES[1].label}</span>
            <h2 id="fs-workflow-title">{workflow.title}</h2>
            <p className="fs-intro">{workflow.intro}</p>
            <ol className="fs-steps">
              {workflow.steps.map((step, i) => (
                <li key={step.title}>
                  <span className="fs-step-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="fs-frame fs-frame-features" aria-labelledby="fs-features-title">
            <span className="fs-frame-label">{FRAMES[2].label}</span>
            <h2 id="fs-features-title">{features.title}</h2>
            <div className="fs-feature-scroll">
              {features.items.map((item) => (
                <article key={item.title} className="fs-feature-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="fs-frame fs-frame-fork" aria-labelledby="fs-fork-title">
            <span className="fs-frame-label">{FRAMES[3].label}</span>
            <h2 id="fs-fork-title">{fork.title}</h2>
            <p>{fork.body}</p>
            <p className="fs-muted">{fork.sub}</p>
            <pre className="fs-code">
              <code>$ {links.install}</code>
            </pre>
            <ul className="fs-link-list">
              <li>
                <a href={links.githubApp}>GitHub App</a>
              </li>
              <li>
                <a href={links.kowoOrg}>kowo-co</a>
              </li>
              <li>
                <a href={links.github}>Source</a>
              </li>
            </ul>
          </section>

          <section className="fs-frame fs-frame-cta" aria-labelledby="fs-cta-title">
            <span className="fs-frame-label">{FRAMES[4].label}</span>
            <h2 id="fs-cta-title">{cta.title}</h2>
            <p className="fs-cta-body">{cta.body}</p>
            <div className="fs-actions">
              <a href={links.discord} className="fs-btn">
                Join Discord
              </a>
              <a href={links.github} className="fs-btn fs-btn-ghost">
                Install
              </a>
            </div>
            <p className="fs-end-mark">■</p>
          </section>
        </div>
      </div>

      {reduced && (
        <div className="fs-reduced-fallback">
          <p>Reduced motion: scroll vertically through stacked frames below.</p>
          <div className="fs-reduced-stack">
            {FRAMES.map((f) => (
              <p key={f.id}>{f.label}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
