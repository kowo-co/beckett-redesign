import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { cta, features, fork, hero, links, workflow } from '../../content/site-content'
import './shell.css'

const SECTIONS = [
  { id: 'beckett', name: 'beckett', desc: 'Coworker as a Service daemon' },
  { id: 'workflow', name: 'workflow', desc: 'Channel to pull request pipeline' },
  { id: 'features', name: 'capabilities', desc: 'Full feature manifest' },
  { id: 'fork', name: 'fork', desc: 'Self-hosting instructions' },
  { id: 'contact', name: 'contact', desc: 'Get in touch' },
] as const

export function Design3Shell() {
  const reduced = useReducedMotion()
  const [cursorVisible, setCursorVisible] = useState(true)
  const [activeSection, setActiveSection] = useState<string>('beckett')

  useEffect(() => {
    if (reduced) return
    const interval = setInterval(() => setCursorVisible((v) => !v), 530)
    return () => clearInterval(interval)
  }, [reduced])

  return (
    <div className="shell">
      <a href="#terminal" className="skip-link">
        Skip to terminal
      </a>

      <div className="sh-chrome">
        <div className="sh-titlebar">
          <span className="sh-dots" aria-hidden="true">
            <span /> <span /> <span />
          </span>
          <span className="sh-window-title">beckett@discord — bash — 80×24</span>
          <Link to="/picker" className="sh-gallery-link">
            gallery
          </Link>
        </div>

        <div id="terminal" className="sh-terminal" role="document">
          <p className="sh-prompt-line">
            <span className="sh-user">beckett@discord</span>
            <span className="sh-sep">:</span>
            <span className="sh-path">~/coworker</span>
            <span className="sh-sep">$</span> man beckett
          </p>

          <header className="sh-man-header">
            <h1 className="sh-man-name">BECKETT</h1>
            <p className="sh-man-section">(7) — Coworker as a Service</p>
          </header>

          <section className="sh-man-section-block" aria-labelledby="sh-name">
            <h2 id="sh-name">NAME</h2>
            <p>
              beckett — {hero.headline.join(' ').toLowerCase()}
            </p>
          </section>

          <section className="sh-man-section-block" aria-labelledby="sh-desc">
            <h2 id="sh-desc">DESCRIPTION</h2>
            <p>{hero.subhead}</p>
            <p className="sh-dim">{hero.thesis}</p>
          </section>

          <nav className="sh-nav" aria-label="Manual sections">
            <p className="sh-nav-label">SECTIONS</p>
            <ul>
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`sh-nav-btn ${activeSection === s.id ? 'sh-nav-btn-active' : ''}`}
                    onClick={() => setActiveSection(s.id)}
                    aria-current={activeSection === s.id ? 'true' : undefined}
                  >
                    {s.name}(1)
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {activeSection === 'beckett' && (
            <section className="sh-man-section-block" aria-labelledby="sh-synopsis">
              <h2 id="sh-synopsis">SYNOPSIS</h2>
              <pre className="sh-code">
                <code>beckett [--discord CHANNEL] [--github REPO] &lt;task&gt;</code>
              </pre>
              <div className="sh-links">
                <a href={links.github}>github.com/kowo-co/beckett</a>
                <a href={links.discord}>discord.gg/beckett</a>
              </div>
            </section>
          )}

          {activeSection === 'workflow' && (
            <section className="sh-man-section-block" aria-labelledby="sh-workflow">
              <h2 id="sh-workflow">WORKFLOW</h2>
              <p>{workflow.title}</p>
              <p className="sh-dim">{workflow.intro}</p>
              {workflow.steps.map((step, i) => (
                <div key={step.title} className="sh-step">
                  <p className="sh-step-cmd">
                    <span className="sh-prompt">$</span> step {i + 1}: {step.title.toLowerCase()}
                  </p>
                  <p className="sh-dim">{step.body}</p>
                </div>
              ))}
            </section>
          )}

          {activeSection === 'features' && (
            <section className="sh-man-section-block" aria-labelledby="sh-features">
              <h2 id="sh-features">CAPABILITIES</h2>
              <p>{features.title}</p>
              {features.items.map((item) => (
                <div key={item.title} className="sh-flag">
                  <p className="sh-flag-name">--{item.title.toLowerCase().replace(/\s+/g, '-')}</p>
                  <p className="sh-dim">{item.body}</p>
                </div>
              ))}
            </section>
          )}

          {activeSection === 'fork' && (
            <section className="sh-man-section-block" aria-labelledby="sh-fork">
              <h2 id="sh-fork">INSTALLATION</h2>
              <p>{fork.title}</p>
              <p className="sh-dim">{fork.body}</p>
              <p className="sh-dim">{fork.sub}</p>
              <pre className="sh-code">
                <code>$ {links.install}</code>
              </pre>
              <div className="sh-links">
                <a href={links.githubApp}>github.com/apps/0x-beck</a>
                <a href={links.kowoOrg}>github.com/kowo-co</a>
              </div>
            </section>
          )}

          {activeSection === 'contact' && (
            <section className="sh-man-section-block" aria-labelledby="sh-contact">
              <h2 id="sh-contact">CONTACT</h2>
              <p>{cta.title}</p>
              <p className="sh-dim">{cta.body}</p>
              <div className="sh-links">
                <a href={links.discord} className="sh-cta">
                  join discord →
                </a>
                <a href={links.github} className="sh-cta">
                  install github app →
                </a>
              </div>
            </section>
          )}

          <p className="sh-prompt-line sh-bottom">
            <span className="sh-user">beckett@discord</span>
            <span className="sh-sep">:</span>
            <span className="sh-path">~/coworker</span>
            <span className="sh-sep">$</span>
            <span className={`sh-cursor ${cursorVisible && !reduced ? 'sh-cursor-visible' : ''}`} aria-hidden="true">
              █
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
