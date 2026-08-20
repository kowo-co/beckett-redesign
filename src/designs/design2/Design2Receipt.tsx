import { Link } from 'react-router-dom'
import { cta, features, fork, hero, links, workflow } from '../../content/site-content'
import './receipt.css'

export function Design2Receipt() {
  return (
    <div className="receipt">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="rc-header">
        <div className="rc-header-row">
          <span className="rc-form-id">FORM B-7 · REV 2026.08</span>
          <Link to="/picker" className="rc-back">
            [GALLERY]
          </Link>
        </div>
        <h1 className="rc-title">BECKETT</h1>
        <p className="rc-subtitle">COWORKER AS A SERVICE — OFFICIAL NOTICE</p>
      </header>

      <main id="main" className="rc-main">
        <section className="rc-block" aria-labelledby="rc-hero">
          <div className="rc-block-header">
            <span className="rc-block-id">§001</span>
            <h2 id="rc-hero">PRIMARY STATEMENT</h2>
          </div>
          <div className="rc-block-body">
            <p className="rc-headline">{hero.headline.join(' ').toUpperCase()}</p>
            <p className="rc-field">{hero.subhead}</p>
            <p className="rc-field rc-field-muted">{hero.thesis}</p>
            <div className="rc-actions">
              <a href={links.github} className="rc-action">
                [INSTALL ON GITHUB]
              </a>
              <a href={links.discord} className="rc-action">
                [JOIN DISCORD]
              </a>
            </div>
          </div>
        </section>

        <section className="rc-block" aria-labelledby="rc-workflow">
          <div className="rc-block-header">
            <span className="rc-block-id">§002</span>
            <h2 id="rc-workflow">PROCEDURE: CHANNEL → PULL REQUEST</h2>
          </div>
          <div className="rc-block-body">
            <p className="rc-field">{workflow.intro}</p>
            <table className="rc-table">
              <caption className="sr-only">Workflow steps</caption>
              <thead>
                <tr>
                  <th scope="col">STEP</th>
                  <th scope="col">ACTION</th>
                  <th scope="col">RESULT</th>
                </tr>
              </thead>
              <tbody>
                {workflow.steps.map((step, i) => (
                  <tr key={step.title}>
                    <td>{String(i + 1).padStart(2, '0')}</td>
                    <td>{step.title.toUpperCase()}</td>
                    <td>{step.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rc-block" aria-labelledby="rc-features">
          <div className="rc-block-header">
            <span className="rc-block-id">§003</span>
            <h2 id="rc-features">CAPABILITIES MANIFEST</h2>
          </div>
          <div className="rc-block-body">
            <p className="rc-field rc-field-label">{features.title.toUpperCase()}</p>
            <dl className="rc-dl">
              {features.items.map((item) => (
                <div key={item.title} className="rc-dl-row">
                  <dt>{item.title.toUpperCase()}</dt>
                  <dd>{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="rc-block" aria-labelledby="rc-fork">
          <div className="rc-block-header">
            <span className="rc-block-id">§004</span>
            <h2 id="rc-fork">FORK AUTHORIZATION</h2>
          </div>
          <div className="rc-block-body">
            <p className="rc-field">{fork.body}</p>
            <p className="rc-field rc-field-muted">{fork.sub}</p>
            <pre className="rc-code" aria-label="Install command">
              <code>$ {links.install}</code>
            </pre>
            <ul className="rc-list">
              <li>
                <a href={links.githubApp}>[GITHUB APP]</a>
              </li>
              <li>
                <a href={links.kowoOrg}>[KOWO-CO ORG]</a>
              </li>
              <li>
                <a href={links.github}>[SOURCE CODE]</a>
              </li>
            </ul>
          </div>
        </section>

        <footer className="rc-block rc-footer">
          <div className="rc-block-header">
            <span className="rc-block-id">§005</span>
            <h2>{cta.title.toUpperCase()}</h2>
          </div>
          <div className="rc-block-body">
            <p className="rc-field">{cta.body}</p>
            <div className="rc-actions">
              <a href={links.discord} className="rc-action">
                [JOIN DISCORD]
              </a>
              <a href={links.github} className="rc-action">
                [INSTALL]
              </a>
            </div>
            <p className="rc-stamp" aria-hidden="true">
              ★ APPROVED ★
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
