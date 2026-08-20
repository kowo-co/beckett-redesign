import { Reel } from '../../lib/Reel'
import { DISCORD } from '../../content/pages'
import { FieldCanvas } from './FieldCanvas'
import './p6.css'

/**
 * FIELD. The homepage as a piece of running software: a fragment shader drags
 * a chrome plate through domain-warped noise for as long as the tab is open,
 * the ink column burns through the headline on screen blend, and the type
 * inverts itself against whatever the field happens to be doing underneath.
 */
export function Page6() {
  return (
    <div className="p6">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <FieldCanvas src="/a/6/chrome.jpg" />

      <main id="main" className="p6-main">
        <div className="p6-plume">
          <Reel
            src="/a/6/flow.mp4"
            poster="/a/6/flow-poster.jpg"
            label="Violet and green ink blooming upward through water"
            className="p6-reel"
          />
        </div>

        <img className="p6-shard" src="/a/6/bloom.jpg" alt="" width={1024} height={1024} />

        <div className="p6-rules" aria-hidden="true">
          <span className="p6-rule p6-rule-a" />
          <span className="p6-rule p6-rule-b" />
          <span className="p6-tick p6-tick-a" />
          <span className="p6-tick p6-tick-b" />
        </div>

        <h1 className="p6-h1">
          <span className="p6-band p6-l1">
            <span className="p6-ink">Something</span>
          </span>{' '}
          <span className="p6-band p6-l2">
            <span className="p6-ink">is</span>
          </span>{' '}
          <span className="p6-band p6-l3">
            <span className="p6-ink">running</span>
          </span>{' '}
          <span className="p6-band p6-l4">
            <span className="p6-ink">behind</span>
          </span>{' '}
          <span className="p6-band p6-l5">
            <span className="p6-ink">this.</span>
          </span>
        </h1>

        <div className="p6-slab">
          <p className="p6-body">
            Right now, on a machine in a room you have never been in, a branch is being written for
            someone who went to bed.
          </p>
          <p className="p6-fogg">Fogg: Motivation. Hope beats fear every time.</p>
        </div>

        <a className="p6-cta" href={DISCORD}>
          <span>Wake up to a merge</span>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
            <path
              d="M3 12h16M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="square"
            />
          </svg>
        </a>
      </main>

      <a className="homebar" href="/">
        Index
      </a>
    </div>
  )
}
