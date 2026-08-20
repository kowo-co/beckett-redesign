import { Reel } from '../../lib/Reel'
import './p2.css'

export function Page2() {
  return (
    <div className="p2">
      <a className="skip-link" href="#main">Skip to content</a>

      <main id="main" className="p2-scroll">
        <section className="p2-panel p2-panel--type">
          <h1>Say it once.</h1>
        </section>

        <section className="p2-panel p2-panel--type">
          <p>It cuts the branch.</p>
        </section>

        <section className="p2-panel p2-panel--type">
          <p>It writes the code.</p>
        </section>

        <section className="p2-panel p2-panel--image">
          <img
            src="/a/2/monolith.jpg"
            alt="A single dark monolithic form standing alone against white."
            width={1024}
            height={1536}
          />
        </section>

        <section className="p2-panel p2-panel--type">
          <p>Another agent tears the diff apart.</p>
        </section>

        <section className="p2-panel p2-panel--type">
          <p>Then it merges itself.</p>
        </section>

        <section className="p2-panel p2-panel--video">
          <Reel
            src="/a/2/turn.mp4"
            poster="/a/2/turn-poster.jpg"
            label="A form turning slowly in place."
            className="p2-reel"
            style={{ aspectRatio: '960 / 542' }}
          />
        </section>

        <section className="p2-panel p2-panel--type">
          <p>You get a link.</p>
        </section>

        <section className="p2-panel p2-panel--type p2-panel--fogg">
          <div className="p2-rule" aria-hidden="true" />
          <p>Fogg: Reduction. One screen, one idea.</p>
        </section>

        <section className="p2-panel p2-panel--type p2-panel--cta">
          <a className="p2-cta" href="https://discord.com">Say it in Discord</a>
        </section>
      </main>

      <a className="homebar" href="/">Index</a>
    </div>
  )
}
