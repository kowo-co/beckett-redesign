/**
 * Copy for all ten homepages. One export per route.
 *
 * Every page here is a homepage for Beckett. The imagined author changes; the
 * subject never does. Hard limits enforced by scripts/audit.mjs:
 *   hero <= 8 words, whole page < 150 words, no banned vocabulary, no em dashes.
 */

export const DISCORD = 'https://discord.gg/beckett'
export const SOURCE = 'https://github.com/kowo-co/beckett'

export interface PageMeta {
  /** Route number, 1..10 */
  n: number
  /** Internal codename, shown on the gallery */
  codename: string
  /** severe | receipt | chaotic */
  pole: 'receipt' | 'severe' | 'chaotic'
  /** The imagined consultancy's one-line take, gallery only */
  take: string
  /** Fogg lever this page pulls, named on the page itself */
  fogg: string
  /** Gallery swatch */
  ink: string
  paper: string
}

export const PAGES: PageMeta[] = [
  {
    n: 1,
    codename: 'LEDGER',
    pole: 'receipt',
    take: 'A till receipt for a night of work',
    fogg: 'Self-monitoring',
    ink: '#111111',
    paper: '#f4f1ea',
  },
  {
    n: 2,
    codename: 'MASS',
    pole: 'severe',
    take: 'Six words per screen, nothing else',
    fogg: 'Reduction',
    ink: '#0a0a0a',
    paper: '#ffffff',
  },
  {
    n: 3,
    codename: 'NIGHT',
    pole: 'severe',
    take: 'One video in a dark room',
    fogg: 'Suggestion',
    ink: '#e8e6e1',
    paper: '#08090b',
  },
  {
    n: 4,
    codename: 'RULE',
    pole: 'severe',
    take: 'A hairline, a serif, a wide margin',
    fogg: 'Ability',
    ink: '#1b1a17',
    paper: '#e9e5db',
  },
  {
    n: 5,
    codename: 'STEP',
    pole: 'severe',
    take: 'One fact at a time, you advance it',
    fogg: 'Tunneling',
    ink: '#f5f5f4',
    paper: '#141414',
  },
  {
    n: 6,
    codename: 'FIELD',
    pole: 'chaotic',
    take: 'A shader that eats the photograph',
    fogg: 'Motivation',
    ink: '#f0eefc',
    paper: '#05030f',
  },
  {
    n: 7,
    codename: 'OVERPRINT',
    pole: 'chaotic',
    take: 'Riso collage, four inks, no grid',
    fogg: 'Conditioning',
    ink: '#141008',
    paper: '#efe7d2',
  },
  {
    n: 8,
    codename: 'ATLAS',
    pole: 'chaotic',
    take: 'Drag the page. The site is a map',
    fogg: 'Tailoring',
    ink: '#0d1b12',
    paper: '#cfe3d2',
  },
  {
    n: 9,
    codename: 'STROBE',
    pole: 'chaotic',
    take: 'Split-flap board and a wall of video',
    fogg: 'Prompt',
    ink: '#ffe500',
    paper: '#100c06',
  },
  {
    n: 10,
    codename: 'DITHER',
    pole: 'chaotic',
    take: 'Live 1-bit dither of a running build',
    fogg: 'Surveillance',
    ink: '#c9ffe3',
    paper: '#020604',
  },
]
