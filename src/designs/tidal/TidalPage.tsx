import { useMemo, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import './tidal.css'

const regions = {
  atlantic: {
    label: 'Atlantic coast',
    factor: 1.2,
    project: 'Bay of Fundy tidal assessment, 2025.',
  },
  prairie: {
    label: 'Prairie',
    factor: 0.9,
    project: 'Saskatchewan solar siting study.',
  },
  arctic: {
    label: 'Arctic',
    factor: 0.7,
    project: 'Nunavut micro-grid feasibility.',
  },
} as const

type RegionKey = keyof typeof regions

export function TidalPage() {
  const reduced = useReducedMotion()
  const [region, setRegion] = useState<RegionKey>('atlantic')
  const [acres, setAcres] = useState(50)
  const active = regions[region]

  const mw = useMemo(() => ((acres * 0.8 * active.factor) / 10).toFixed(1), [acres, active.factor])

  return (
    <div className="tidal">
      <a href="#main" className="skip-link" style={{ '--skip-bg': '#0a1628', '--skip-fg': '#e8f0f0' } as CSSProperties}>
        Skip to content
      </a>

      <header className="flex items-center justify-between px-4 py-4 sm:px-8 border-b border-[var(--t-surface)]">
        <p className="text-sm font-medium tracking-wide m-0">Tidal Energy Advisory</p>
        <p className="text-xs text-[var(--t-muted)] m-0">Halifax · 2014</p>
      </header>

      <main id="main">
        <section className="tidal__video-wrap relative min-h-[60dvh] sm:min-h-[70dvh]">
          {!reduced && (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full"
              poster="/assets/tidal/hero.jpg"
              aria-label="Offshore wind turbines in morning fog"
            >
              <source src="/assets/tidal/wind.mp4" type="video/mp4" />
            </video>
          )}
          <img
            src="/assets/tidal/hero.jpg"
            alt="Offshore wind turbines at dawn over calm ocean"
            className="tidal__video-fallback absolute inset-0 w-full h-full object-cover"
            style={reduced ? undefined : { display: 'none' }}
          />
          <div className="relative z-10 flex items-end min-h-[60dvh] sm:min-h-[70dvh] p-4 sm:p-8 bg-gradient-to-t from-[var(--t-bg)] via-transparent to-transparent">
            <h1 className="text-5xl sm:text-7xl font-bold m-0 tracking-tight">Place first.</h1>
          </div>
        </section>

        <section className="px-4 sm:px-8 py-12 max-w-2xl">
          <p className="text-base leading-relaxed m-0 mb-8 text-[var(--t-muted)]">
            Tidal maps renewable potential to actual geography. Not spreadsheets — shorelines.
          </p>

          <fieldset className="border-0 p-0 m-0 mb-10">
            <legend className="text-xs uppercase tracking-widest text-[var(--t-muted)] mb-4">
              Your region
            </legend>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(regions) as RegionKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="tidal__region-btn px-4 py-3 text-sm"
                  aria-pressed={region === key}
                  onClick={() => setRegion(key)}
                >
                  {regions[key].label}
                </button>
              ))}
            </div>
          </fieldset>

          <p className="text-sm m-0 mb-10 text-[var(--t-accent)]">{active.project}</p>

          <div className="p-6 bg-[var(--t-surface)] rounded-sm mb-10">
            <label htmlFor="acres-slider" className="block text-xs uppercase tracking-widest text-[var(--t-muted)] mb-4">
              Site acreage
            </label>
            <input
              id="acres-slider"
              type="range"
              min={5}
              max={500}
              value={acres}
              onChange={(e) => setAcres(Number(e.target.value))}
              className="w-full"
            />
            <p className="tidal__result text-3xl font-bold m-0 mt-4">
              ~{mw} MW <span className="text-base font-normal text-[var(--t-muted)]">estimated capacity</span>
            </p>
          </div>

          <figure className="mb-8">
            <img
              src="/assets/tidal/map.jpg"
              alt="Coastal tidal energy map with contour lines and depth markers"
              className="w-full rounded-sm"
              loading="lazy"
            />
            <figcaption className="text-xs text-[var(--t-muted)] mt-2">
              Fundy depth survey layer
            </figcaption>
          </figure>

          <figure>
            <img
              src="/assets/tidal/solar.jpg"
              alt="Aerial view of solar panel field in rural landscape"
              className="w-full rounded-sm"
              loading="lazy"
            />
            <figcaption className="text-xs text-[var(--t-muted)] mt-2">
              Cape Breton solar siting, 2024
            </figcaption>
          </figure>
        </section>

        <section className="px-4 sm:px-8 py-10 border-t border-[var(--t-surface)]">
          <p className="text-sm text-[var(--t-muted)] m-0 mb-3">Ready when your site is.</p>
          <a
            href="mailto:projects@tidalenergy.ca"
            className="inline-flex items-center min-h-[44px] text-[var(--t-accent)] underline underline-offset-4"
          >
            projects@tidalenergy.ca
          </a>
        </section>
      </main>

      <footer className="px-4 sm:px-8 py-6 text-xs text-[var(--t-muted)]">
        <p className="m-0">Renewable siting · environmental assessment</p>
      </footer>
    </div>
  )
}
