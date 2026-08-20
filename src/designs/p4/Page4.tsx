import type { CSSProperties } from 'react'
import { Reel } from '../../lib/Reel'
import './p4.css'

const theme = {
  '--hb-bg': '#e9e5db',
  '--hb-fg': '#1b1a17',
  '--hb-line': '#1b1a17',
  '--focus': '#1b1a17',
} as CSSProperties

export function Page4() {
  return (
    <div className="p4" style={theme}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="p4-paper" aria-hidden="true" />
      <main id="main" className="p4-main">
        <div className="p4-hairline" aria-hidden="true" />

        <div className="p4-hero">
          <h1>One sentence is the whole interface.</h1>
        </div>

        <Reel
          src="/a/4/rule.mp4"
          poster="/a/4/rule-poster.jpg"
          label="A brush drawing a single ink line on paper."
          className="p4-reel"
        />

        <div className="p4-body">
          <p className="p4-copy">
            Effort is what kills good ideas. So the ask is one sentence in a
            chat window, and the next thing you touch is a deployed link.
          </p>
          <p className="p4-fogg">Fogg: Ability. Make the first move cost nothing.</p>
          <a className="p4-cta" href="https://discord.com">Write the sentence</a>
        </div>

        <div className="p4-line-wrap">
          <img className="p4-line" src="/a/4/line.jpg" alt="" width={1536} height={1024} />
        </div>
      </main>
      <a className="homebar" href="/">Index</a>
    </div>
  )
}
