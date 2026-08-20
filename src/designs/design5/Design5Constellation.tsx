import { Link } from 'react-router-dom'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cta, features, fork, hero, links, workflow } from '../../content/site-content'
import { ConstellationCanvas } from './ConstellationCanvas'
import './constellation.css'

export function Design5Constellation() {
  const reduced = useReducedMotion()

  return (
    <div className="constellation">
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <ConstellationCanvas reducedMotion={reduced} />

      <Link to="/picker" className="cnv-back">
        Gallery
      </Link>

      <main id="content" className="cnv-content">
        <section className="cnv-zone cnv-zone-hero" aria-labelledby="cnv-hero">
          <h1 id="cnv-hero" className="cnv-title">
            {hero.headline[0]}
            <span>{hero.headline[1]}</span>
          </h1>
          <p className="cnv-lead">{hero.subhead}</p>
          <div className="cnv-actions">
            <a href={links.github} className="cnv-btn">
              Install on GitHub
            </a>
            <a href={links.discord} className="cnv-btn cnv-btn-outline">
              Join Discord
            </a>
          </div>
        </section>

        <section className="cnv-zone cnv-zone-thesis" aria-label="Thesis">
          <p>{hero.thesis}</p>
        </section>

        <section className="cnv-zone cnv-zone-workflow" aria-labelledby="cnv-workflow">
          <h2 id="cnv-workflow">{workflow.title}</h2>
          <p className="cnv-intro">{workflow.intro}</p>
          <div className="cnv-steps">
            {workflow.steps.map((step, i) => (
              <article key={step.title} className="cnv-step">
                <span className="cnv-step-index">{i + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cnv-zone cnv-zone-features" aria-labelledby="cnv-features">
          <h2 id="cnv-features">{features.title}</h2>
          <div className="cnv-feature-grid">
            {features.items.map((item) => (
              <article key={item.title} className="cnv-feature">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cnv-zone cnv-zone-fork" aria-labelledby="cnv-fork">
          <h2 id="cnv-fork">{fork.title}</h2>
          <p>{fork.body}</p>
          <p className="cnv-muted">{fork.sub}</p>
          <pre className="cnv-code">
            <code>$ {links.install}</code>
          </pre>
          <div className="cnv-links">
            <a href={links.githubApp}>GitHub App</a>
            <a href={links.kowoOrg}>kowo-co</a>
            <a href={links.github}>Source</a>
          </div>
        </section>

        <footer className="cnv-zone cnv-zone-cta">
          <h2>{cta.title}</h2>
          <p>{cta.body}</p>
          <div className="cnv-actions">
            <a href={links.discord} className="cnv-btn">
              Join Discord
            </a>
            <a href={links.github} className="cnv-btn cnv-btn-outline">
              Install
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
