import { Reel } from '../../lib/Reel'
import { DISCORD } from '../../content/pages'
import './p3.css'

export function Page3() {
  return (
    <div className="p3">
      <a className="skip-link" href="#main">Skip to content</a>

      <main id="main" className="p3-main">
        <img className="p3-atmosphere" src="/a/3/window.jpg" alt="" aria-hidden="true" width={1024} height={1536} />

        <div className="p3-stage">
          <div className="p3-frame">
            <Reel
              src="/a/3/rack.mp4"
              poster="/a/3/rack-poster.jpg"
              label="A dark server rack corridor, lights blinking, at night"
              className="p3-reel"
            />
          </div>

          <h1 className="p3-h1">It works while the house sleeps.</h1>
          <p className="p3-body">In the morning there is a merged pull request and a link.</p>
          <p className="p3-fogg">Fogg: Suggestion. Offered when attention is cheap.</p>
          <a className="p3-cta" href={DISCORD} target="_blank" rel="noopener noreferrer">
            Leave it something to do
          </a>
        </div>

        <div className="p3-corners">
          <span className="p3-corner p3-corner--tl">03:14</span>
          <span className="p3-corner p3-corner--tr">nobody watching</span>
          <span className="p3-corner p3-corner--br">you asleep</span>
          <span className="p3-corner p3-corner--bl">build running</span>
        </div>
      </main>

      <a className="homebar" href="/">Index</a>
    </div>
  )
}
