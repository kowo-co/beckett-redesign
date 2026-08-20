import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * A mechanical split-flap row. Eight tiles, each one a piece of black plastic
 * with a hairline seam across the middle. Tiles spin through glyphs and settle
 * left to right onto the word, then the board holds before the next one.
 *
 * Every glyph is painted by CSS `content: attr(data-ch)` so the random glyphs a
 * spinning tile throws never enter the accessibility tree. The words the board
 * settles on are named once, statically, in a visually hidden node: no live
 * region, so nothing is queued into a screen reader on a loop.
 *
 * Safety: a tile changes glyph at most once per TICK (340ms, under 3/sec), the
 * tiles are small, and the luminance swing is a thin yellow letterform on
 * black. Under reduced motion the board lands instantly on the last word.
 */

const WORDS = ['MERGED', 'DEPLOYED', 'LIVE'] as const
const CELLS = 8
const SUB_SLOTS = 18
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const TICK = 340
const STAGGER = 2
const HOLD = 10

function layout(word: string): string[] {
  const pad = Math.floor((CELLS - word.length) / 2)
  return Array.from({ length: CELLS }, (_, i) => word[i - pad] ?? ' ')
}

function glyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

export function SplitFlap() {
  const reduced = useReducedMotion()
  const [chars, setChars] = useState<string[]>(() => layout(WORDS[0]))
  /** What each cell showed one tick ago: printed on the falling flap. */
  const [leaves, setLeaves] = useState<string[]>(() => layout(WORDS[0]))
  const [spin, setSpin] = useState<boolean[]>(() => Array<boolean>(CELLS).fill(false))
  const [land, setLand] = useState(-1)

  useEffect(() => {
    const last = WORDS[WORDS.length - 1]
    if (reduced) {
      setChars(layout(last))
      setLeaves(layout(last))
      setSpin(Array<boolean>(CELLS).fill(false))
      setLand(-1)
      return
    }

    let t = 0
    let index = 0
    let shown = layout(WORDS[0])
    // Negative start means every tile is already settled on the first word at
    // t = 0, so the board reads clean before it ever moves.
    let start = -(CELLS - 1) * STAGGER

    const id = window.setInterval(() => {
      t += 1
      const target = layout(WORDS[index])
      const nextChars: string[] = []
      const nextSpin: boolean[] = []
      let landed = -1

      for (let i = 0; i < CELLS; i += 1) {
        const at = start + i * STAGGER
        if (t >= at) {
          nextChars.push(target[i])
          nextSpin.push(false)
          if (t === at) landed = i
        } else {
          nextChars.push(glyph())
          nextSpin.push(true)
        }
      }

      setLeaves(shown)
      shown = nextChars
      setChars(nextChars)
      setSpin(nextSpin)
      setLand(landed)

      const done = start + (CELLS - 1) * STAGGER
      if (t >= done + HOLD) {
        index = (index + 1) % WORDS.length
        start = t + 1
      }
    }, TICK)

    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <>
      <p className="vh">{reduced ? 'LIVE' : 'MERGED. DEPLOYED. LIVE.'}</p>
      <div className="p9-flap" aria-hidden="true">
        <div className="p9-row">
          {chars.map((c, i) => (
            <div
              key={i}
              className="p9-cell"
              data-spin={spin[i] ? '1' : '0'}
              data-land={land === i ? '1' : '0'}
            >
              <span className="p9-half p9-half--top" data-ch={c} />
              <span className="p9-half p9-half--bot" data-ch={c} />
              <span className="p9-leaf" data-ch={leaves[i] ?? c} />
              <span className="p9-seam" />
            </div>
          ))}
        </div>
        <div className="p9-sub">
          {Array.from({ length: SUB_SLOTS }, (_, i) => (
            <span key={i} className="p9-slot" />
          ))}
        </div>
      </div>
    </>
  )
}
