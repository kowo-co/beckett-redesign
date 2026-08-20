import { DISCORD } from '../../content/pages'
import { Reel } from '../../lib/Reel'
import './p1.css'

/**
 * LEDGER. The page is a till roll lying across the mouth of the machine that
 * printed it: one bone strip, torn at both ends, set in one ink. The tear is
 * the silhouette of the real sheet in /a/1/paper.jpg, used as a luminance mask.
 */

type Row = { time: string; name: string; value: string }

const ROWS: Row[] = [
  { time: '23:41', name: 'ASK', value: 'discord' },
  { time: '23:42', name: 'BRANCH', value: 'cut' },
  { time: '00:06', name: 'CODE', value: '214 lines' },
  { time: '00:19', name: 'REVIEW', value: 'second agent' },
  { time: '00:28', name: 'PULL REQUEST', value: 'opened' },
  { time: '00:33', name: 'MERGE', value: 'clean' },
  { time: '00:35', name: 'DEPLOY', value: 'live' },
]

/** Every block prints in sequence, top down, the way the paper comes out. */
const beat = (ms: number) => ({ animationDelay: `${ms}ms` })

/** `===` and `---` set as ruled lines so they end exactly at the paper edge. */
function Rule({ kind, delay }: { kind: 'double' | 'single'; delay: number }) {
  return (
    <div className={`p1-rule p1-rule-${kind} p1-print`} style={beat(delay)} aria-hidden="true" />
  )
}

export function Page1() {
  return (
    <div className="p1">
      <a className="skip-link" href="#main">Skip to content</a>

      <div className="p1-bench" aria-hidden="true">
        <div className="p1-machine">
          <img className="p1-drum" src="/a/1/drum.jpg" alt="" width={1536} height={1024} />
        </div>
        <span className="p1-pool" />
      </div>

      <main id="main" className="p1-feed">
        <div className="p1-shade">
          <span className="p1-tear p1-tear-top" aria-hidden="true" />
          <span className="p1-tear p1-tear-bot" aria-hidden="true" />

          <article className="p1-strip">
            <span className="p1-thermal" aria-hidden="true" />
            <span className="p1-curl" aria-hidden="true" />

            <div className="p1-body">
              <Rule kind="double" delay={0} />

              <h1 className="p1-h1 p1-print" style={beat(70)}>
                <span>Asked at 23:41.</span>{' '}
                <span>Shipped by 00:35.</span>
              </h1>

              <Rule kind="double" delay={110} />

              <div className="p1-window p1-print" style={beat(150)}>
                <Reel
                  src="/a/1/print.mp4"
                  poster="/a/1/print-poster.jpg"
                  label="A printer feeding a strip of paper out of its drum."
                  className="p1-reel"
                />
              </div>

              <Rule kind="single" delay={190} />

              <ol className="p1-lines">
                {ROWS.map((r, i) => (
                  <li className="p1-line p1-print" key={r.time} style={beat(230 + i * 36)}>
                    <span className="p1-t">[ {r.time} ]</span>
                    <span className="p1-n">{r.name}</span>
                    <span className="p1-lead" aria-hidden="true" />
                    <span className="p1-v">{r.value}</span>
                  </li>
                ))}
              </ol>

              <Rule kind="double" delay={490} />

              <section className="p1-total">
                <img
                  className="p1-stamp"
                  src="/a/1/stamp.jpg"
                  alt=""
                  width={1024}
                  height={1024}
                />
                <div className="p1-line p1-print" style={beat(520)}>
                  <span className="p1-t">[ TOTAL ]</span>
                  <span className="p1-lead" aria-hidden="true" />
                </div>
                <p className="p1-big p1-print" style={beat(560)}>54 MINUTES</p>
                <div className="p1-line p1-mid p1-print" style={beat(600)}>
                  <span className="p1-t">[ AWAKE ]</span>
                  <span className="p1-lead" aria-hidden="true" />
                  <span className="p1-v">13 OF THEM</span>
                </div>
              </section>

              <Rule kind="double" delay={630} />

              <p className="p1-line p1-fogg p1-print" style={beat(660)}>
                <span className="p1-t">[ FOGG ]</span>
                <span className="p1-lead" aria-hidden="true" />
                <span className="p1-v">SELF-MONITORING</span>
              </p>

              <p className="p1-record p1-print" style={beat(700)}>
                A record you did not have to ask for.
              </p>

              <div className="p1-barcode p1-print" style={beat(740)} aria-hidden="true" />

              <div className="p1-cut p1-print" style={beat(770)} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
                  <g fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
                    <circle cx="5.5" cy="18" r="2.6" />
                    <circle cx="18.5" cy="18" r="2.6" />
                    <path d="M7.6 16.2 19 3M16.4 16.2 5 3" />
                  </g>
                </svg>
              </div>

              <a
                className="p1-cta p1-print"
                style={beat(800)}
                href={DISCORD}
                target="_blank"
                rel="noreferrer"
              >
                [ SEND THE NEXT ONE ]
              </a>
            </div>
          </article>
        </div>
      </main>

      <a className="homebar" href="/">Index</a>
    </div>
  )
}
