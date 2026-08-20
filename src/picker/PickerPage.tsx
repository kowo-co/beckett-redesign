import { Link } from 'react-router-dom'
import { designs } from '../content/site-content'
import './picker.css'

export function PickerPage() {
  return (
    <div className="picker">
      <a href="#gallery" className="skip-link">
        Skip to gallery
      </a>

      <header className="picker-header">
        <p className="picker-kicker">Beckett redesign gallery</p>
        <h1 className="picker-title">
          Five radical directions.
          <br />
          Pick your poison.
        </h1>
        <p className="picker-lede">
          Ro asked for wowzas, not AI slop. Each design below is a complete landing page using the
          real copy from 0xbeckett.me — same message, wildly different structure.
        </p>
      </header>

      <nav id="gallery" className="picker-grid" aria-label="Design gallery">
        {designs.map((design) => (
          <article key={design.id} className="picker-card">
            <div className="picker-preview-wrap">
              <iframe
                title={`Preview of design ${design.id}: ${design.name}`}
                src={`/${design.slug}`}
                className="picker-preview"
                loading="lazy"
                tabIndex={-1}
              />
              <div className="picker-preview-overlay" aria-hidden="true" />
            </div>
            <div className="picker-card-body">
              <div className="picker-card-meta">
                <span className="picker-number">{String(design.id).padStart(2, '0')}</span>
                <span className="picker-mood">{design.mood}</span>
              </div>
              <h2 className="picker-card-title">{design.name}</h2>
              <p className="picker-card-idea">{design.idea}</p>
              <Link to={`/${design.slug}`} className="picker-enter">
                Enter design {design.id}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </nav>

      <footer className="picker-footer">
        <p>
          Content sourced from{' '}
          <a href="https://0xbeckett.me" className="picker-footer-link">
            0xbeckett.me
          </a>
          . These are mockups for judgment, not production.
        </p>
      </footer>
    </div>
  )
}
