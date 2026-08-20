import './omission.css'

export function OmissionPage() {
  return (
    <div className="omission">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <main id="main" className="px-6 sm:px-20 py-24 sm:py-32">
        <h1 className="mb-32 sm:mb-48">What we leave out.</h1>

        <p className="omission__body mb-32">
          Omission advises by deletion. New York. Six clients.
        </p>

        <figure className="mb-32 max-w-sm">
          <img
            src="/assets/omission/wall.jpg"
            alt="Empty gallery wall with single small framed document"
            className="w-full"
          />
        </figure>

        <p className="omission__body mb-32 text-[var(--o-muted)]">
          A fintech startup dropped four product lines. Revenue up.
        </p>

        <figure className="mb-32 max-w-md mx-auto">
          <img
            src="/assets/omission/type.jpg"
            alt="Letterpress typographic texture close-up"
            className="w-full"
            loading="lazy"
          />
        </figure>

        <figure className="mb-32 max-w-xs">
          <img
            src="/assets/omission/sketch.jpg"
            alt="Minimal line drawing of empty room corner"
            className="w-full"
            loading="lazy"
          />
        </figure>

        <a href="mailto:hello@omission.co" className="omission__body underline underline-offset-4">
          hello@omission.co
        </a>
      </main>
    </div>
  )
}
