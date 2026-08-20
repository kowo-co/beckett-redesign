import './veld.css'

export function VeldPage() {
  return (
    <div className="veld">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="px-6 sm:px-24 pt-16 pb-32">
        <p className="veld__sans m-0 mb-8">Veld · Utrecht</p>
        <h1>Flat land.</h1>
      </header>

      <main id="main">
        <figure className="mb-32 sm:mb-48">
          <img
            src="/assets/veld/polder.jpg"
            alt="Minimal Dutch polder landscape with flat green fields"
          />
        </figure>

        <div className="px-6 sm:px-24 pb-32 max-w-lg">
          <p className="text-xl leading-relaxed mb-16 font-light">
            Veld advises on land use where the horizon is the brief. Polders, dikes, flood zones.
          </p>
          <p className="veld__sans mb-32">IJsselmeer buffer study · 2025</p>
        </div>

        <figure className="mb-32 sm:mb-48 max-w-sm mx-auto px-6">
          <img
            src="/assets/veld/grass.jpg"
            alt="Single blade of grass against white sky"
            loading="lazy"
          />
        </figure>

        <figure className="mb-32 sm:mb-48">
          <img
            src="/assets/veld/canal.jpg"
            alt="Dutch canal with straight vanishing point"
            loading="lazy"
          />
        </figure>

        <div className="px-6 sm:px-24 pb-24">
          <a href="mailto:studio@veld.nl" className="veld__sans text-[var(--v-ink)] no-underline">
            studio@veld.nl
          </a>
        </div>
      </main>
    </div>
  )
}
