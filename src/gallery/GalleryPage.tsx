import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PAGES } from '../content/pages'
import './gallery.css'

/**
 * The index. Ten rows, one client, ten imagined authors. Deliberately the
 * quietest surface in the build so nothing here competes with the work.
 */
export function GalleryPage() {
  const [active, setActive] = useState(1)

  return (
    <div className="gal">
      <a className="skip-link" href="#index">Skip to the index</a>

      <header className="gal-head">
        <h1 className="gal-title">Beckett, ten ways</h1>
        <p className="gal-sub">
          Ten studios, one client. Every page below is a homepage for the same
          agent. Numbers are routes.
        </p>
      </header>

      <main id="index" className="gal-body">
        <ol className="gal-list">
          {PAGES.map((p) => (
            <li key={p.n}>
              <Link
                to={`/${p.n}`}
                className="gal-row"
                onMouseEnter={() => setActive(p.n)}
                onFocus={() => setActive(p.n)}
              >
                <span className="gal-n">{String(p.n).padStart(2, '0')}</span>
                <span className="gal-name">
                  {p.codename}
                  <em className="gal-take">{p.take}</em>
                </span>
                <span className="gal-meta">
                  <span className={`gal-pole gal-pole--${p.pole}`}>{p.pole}</span>
                  <span className="gal-fogg">{p.fogg}</span>
                </span>
                <img
                  className="gal-thumb"
                  src={`/thumbs/${p.n}.jpg`}
                  alt=""
                  loading="lazy"
                  width={375}
                  height={250}
                />
              </Link>
            </li>
          ))}
        </ol>

        <aside className="gal-stage" aria-hidden="true">
          {PAGES.map((p) => (
            <img
              key={p.n}
              src={`/thumbs/${p.n}.jpg`}
              alt=""
              className={active === p.n ? 'gal-shot is-on' : 'gal-shot'}
              loading={p.n === 1 ? 'eager' : 'lazy'}
              width={1280}
              height={853}
            />
          ))}
        </aside>
      </main>

      <footer className="gal-foot">
        <p>
          Four severe, five loud, one printed on a till roll. Each page names the
          Fogg lever it pulls.
        </p>
      </footer>
    </div>
  )
}
