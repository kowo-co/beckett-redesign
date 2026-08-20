import { Link } from 'react-router-dom'
import { cta, features, fork, hero, links, workflow } from '../../content/site-content'
import './broadsheet.css'

export function Design1Broadsheet() {
  return (
    <div className="broadsheet">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="bs-masthead">
        <div className="bs-masthead-top">
          <span className="bs-edition">Vol. VII · Coworker as a Service</span>
          <Link to="/picker" className="bs-back">
            ← Gallery
          </Link>
        </div>
        <h1 className="bs-nameplate">The Beckett</h1>
        <p className="bs-tagline">Hire a coworker. Not a tool.</p>
        <div className="bs-rule" aria-hidden="true" />
      </header>

      <main id="main" className="bs-main">
        <section className="bs-hero" aria-labelledby="bs-hero-head">
          <h2 id="bs-hero-head" className="bs-hero-head">
            {hero.headline[0]}
            <em>{hero.headline[1]}</em>
          </h2>
          <div className="bs-hero-grid">
            <p className="bs-lead bs-dropcap">{hero.subhead}</p>
            <aside className="bs-hero-aside">
              <p className="bs-pullquote">{hero.thesis}</p>
              <div className="bs-cta-row">
                <a href={links.github} className="bs-btn">
                  Install on GitHub
                </a>
                <a href={links.discord} className="bs-btn bs-btn-outline">
                  Join the Discord
                </a>
              </div>
            </aside>
          </div>
        </section>

        <div className="bs-rule bs-rule-thick" aria-hidden="true" />

        <section className="bs-section" aria-labelledby="bs-workflow">
          <h2 id="bs-workflow" className="bs-section-title">
            {workflow.title}
          </h2>
          <p className="bs-section-intro">{workflow.intro}</p>
          <div className="bs-columns-3">
            {workflow.steps.map((step, i) => (
              <article key={step.title} className="bs-column-item">
                <span className="bs-step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="bs-rule" aria-hidden="true" />

        <section className="bs-section" aria-labelledby="bs-features">
          <h2 id="bs-features" className="bs-section-title">
            {features.title}
          </h2>
          <div className="bs-features-grid">
            {features.items.map((item) => (
              <article key={item.title} className="bs-feature">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="bs-rule bs-rule-thick" aria-hidden="true" />

        <section className="bs-section bs-fork" aria-labelledby="bs-fork">
          <div className="bs-fork-grid">
            <div>
              <h2 id="bs-fork" className="bs-section-title">
                {fork.title}
              </h2>
              <p>{fork.body}</p>
              <p className="bs-muted">{fork.sub}</p>
            </div>
            <pre className="bs-install" aria-label="Install command">
              <code>$ {links.install}</code>
            </pre>
          </div>
          <ul className="bs-links">
            <li>
              <a href={links.githubApp}>Install the GitHub App</a>
            </li>
            <li>
              <a href={links.kowoOrg}>The kowo-co org</a>
            </li>
            <li>
              <a href={links.github}>Read the source</a>
            </li>
          </ul>
        </section>

        <footer className="bs-footer">
          <h2>{cta.title}</h2>
          <p>{cta.body}</p>
          <div className="bs-cta-row">
            <a href={links.discord} className="bs-btn">
              Join the Discord
            </a>
            <a href={links.github} className="bs-btn bs-btn-outline">
              Install on GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}
