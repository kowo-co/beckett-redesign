import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { firms, poleLabels } from '../content/firms'
import type { FirmPole } from '../content/firms'
import './picker.css'

const poleOrder: FirmPole[] = ['receipt', 'minimal', 'chaotic']

export function PickerPage() {
  return (
    <div className="picker">
      <a href="#main" className="skip-link" style={{ '--skip-bg': '#111110', '--skip-fg': '#f5f3ef' } as CSSProperties}>
        Skip to content
      </a>

      <header className="px-4 sm:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--p-muted)] m-0 mb-4">
          Ten consulting firms
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight m-0 mb-4 leading-tight">
          Pick a world.
        </h1>
        <p className="text-base text-[var(--p-muted)] m-0 max-w-xl leading-relaxed">
          Receipt terminal, severe minimal, chaotic experimental — nothing in the safe middle.
        </p>
      </header>

      <main id="main" className="px-4 sm:px-8 pb-16 max-w-7xl mx-auto">
        {poleOrder.map((pole) => {
          const group = firms.filter((f) => f.pole === pole)
          if (group.length === 0) return null
          return (
            <section key={pole} className="mb-12">
              <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--p-accent)] mb-6 font-medium">
                {poleLabels[pole]}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
                {group.map((firm) => (
                  <li key={firm.id}>
                    <Link to={firm.route} className="picker__card rounded-sm">
                      <img src={firm.thumbnail} alt={`Preview of ${firm.name}`} loading="lazy" />
                      <div className="p-5">
                        <p className="text-xs text-[var(--p-muted)] uppercase tracking-widest m-0 mb-2">
                          {firm.sector} · {firm.city}
                        </p>
                        <h3 className="text-xl font-semibold m-0 mb-2 tracking-tight">{firm.name}</h3>
                        <p className="text-sm text-[var(--p-muted)] m-0 leading-relaxed">{firm.tagline}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </main>

      <footer className="px-4 sm:px-8 py-8 border-t border-[var(--p-surface)] text-xs text-[var(--p-muted)]">
        <p className="m-0 max-w-7xl mx-auto">Ten distinct design worlds · static prototypes</p>
      </footer>
    </div>
  )
}
