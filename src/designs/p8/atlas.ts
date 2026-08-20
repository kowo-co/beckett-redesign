/**
 * Survey geometry for /8 ATLAS. Everything here is drawing, not copy: the
 * watercourses, the graticule, the tick marks that hang off a survey line and
 * the little benchmarks scattered over the sheet. All coordinates are
 * normalised 0..1 against the world box so the same plate can be drawn at
 * 2200x1600 on a desktop and at a smaller, recomposed size on a phone.
 */

export type Pt = [number, number]

/** Deterministic scatter. Same sheet every reload, no jitter between renders. */
export function rnd(i: number): number {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

/** Catmull-Rom through the points, emitted as cubic beziers. */
export function smooth(points: Pt[], w: number, h: number): string {
  const p = points.map(([x, y]) => [x * w, y * h] as Pt)
  if (p.length < 2) return ''
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

export type Tick = { x1: number; y1: number; x2: number; y2: number }

/** Perpendicular ticks along a straight run, the way a traverse is drawn. */
export function ticksAlong(a: Pt, b: Pt, w: number, h: number, spacing = 78, len = 6): Tick[] {
  const ax = a[0] * w
  const ay = a[1] * h
  const bx = b[0] * w
  const by = b[1] * h
  const dx = bx - ax
  const dy = by - ay
  const dist = Math.hypot(dx, dy)
  if (dist < spacing) return []
  const ux = dx / dist
  const uy = dy / dist
  const out: Tick[] = []
  for (let d = spacing; d < dist - spacing * 0.4; d += spacing) {
    const cx = ax + ux * d
    const cy = ay + uy * d
    const big = Math.round(d / spacing) % 3 === 0
    const l = big ? len * 1.9 : len
    out.push({ x1: cx - uy * l, y1: cy + ux * l, x2: cx + uy * l, y2: cy - ux * l })
  }
  return out
}

/** The main watercourse and its tributaries, in normalised space. */
export const RIVERS: Pt[][] = [
  [
    [-0.02, 0.24],
    [0.11, 0.3],
    [0.24, 0.26],
    [0.34, 0.37],
    [0.42, 0.55],
    [0.52, 0.63],
    [0.63, 0.6],
    [0.74, 0.72],
    [0.87, 0.7],
    [1.02, 0.79],
  ],
  [
    [0.06, 0.68],
    [0.16, 0.63],
    [0.27, 0.62],
    [0.36, 0.52],
    [0.42, 0.55],
  ],
  [
    [0.86, 0.16],
    [0.8, 0.29],
    [0.7, 0.42],
    [0.63, 0.6],
  ],
  [
    [0.48, 0.98],
    [0.55, 0.86],
    [0.6, 0.74],
    [0.63, 0.6],
  ],
]

/** Two hatched regions: marsh on the sheet, ballast for the composition. */
export const REGIONS: Pt[][] = [
  [
    [0.62, 0.02],
    [0.98, 0.06],
    [1.02, 0.34],
    [0.84, 0.4],
    [0.71, 0.3],
    [0.66, 0.14],
  ],
  [
    [-0.02, 0.78],
    [0.19, 0.84],
    [0.3, 0.98],
    [0.26, 1.04],
    [-0.02, 1.04],
  ],
]

/**
 * Built-up ground, printed solid. A survey sheet is not all hairlines: the
 * dense stuff goes down as a black mass, and the sheet needs that weight or it
 * floats away as one polite mid-tone.
 */
export const URBAN: Pt[][] = [
  [
    [0.42, 0.6],
    [0.505, 0.565],
    [0.6, 0.6],
    [0.655, 0.7],
    [0.62, 0.83],
    [0.665, 0.95],
    [0.43, 0.99],
    [0.385, 0.82],
    [0.35, 0.72],
  ],
  [
    [0.9, 0.35],
    [1.03, 0.33],
    [1.03, 0.5],
    [0.94, 0.47],
  ],
]

export type NodeKind = 'hero' | 'plain' | 'image' | 'video'

/**
 * Lettering register. A real sheet does not caption everything the same way:
 * settlements are set large, stations are spaced small caps, watercourses are
 * italic, and whatever the surveyor added in the field is small and crooked.
 */
export type Register = 'plate' | 'station' | 'hydro'

export type NodeSpec = {
  id: string
  text: string
  kind: NodeKind
  img?: string
  alt?: string
  /** normalised position of the node anchor, desktop plate */
  wide: Pt
  /** normalised position of the node anchor, phone plate */
  phone: Pt
  rot: number
  rotPhone: number
  /** card width in px at k=1 */
  w: number
  wPhone: number
  /** caption size in px at k=1 */
  fs: number
  fsPhone: number
  reg: Register
  /** stacking order inside the sheet, so plates can slide under one another */
  z: number
  /**
   * Pinned stations keep their exact offset from the hero when the plate is
   * resurveyed for a narrower frame, because they are pasted onto the hero
   * card rather than scattered on the ground.
   */
  pin?: boolean
}

export const NODES: NodeSpec[] = [
  {
    id: 'hero',
    text: 'Drag. The work is spread out here.',
    kind: 'hero',
    wide: [0.45, 0.46],
    phone: [0.5, 0.36],
    rot: -4.2,
    rotPhone: -3.2,
    w: 548,
    wPhone: 300,
    fs: 29,
    fsPhone: 20,
    reg: 'plate',
    z: 30,
  },
  {
    id: 'door',
    text: 'Discord. The whole front door.',
    kind: 'video',
    wide: [0.26, 0.2397],
    phone: [0.475, 0.2262],
    rot: -10.5,
    rotPhone: -8.5,
    w: 360,
    wPhone: 250,
    fs: 25,
    fsPhone: 19,
    reg: 'plate',
    z: 18,
  },
  {
    id: 'browser',
    text: 'A real browser it drives itself.',
    kind: 'plain',
    wide: [0.6275, 0.2735],
    /* Ninety of world below where it used to sit. `source` is a plate and
       letters at its foot, so this station was landing square on that caption
       once a tall phone showed both at once. Clears the lettering above it and
       still clears `memory` below. */
    phone: [0.5341, 0.6591],
    rot: 7.4,
    rotPhone: -7,
    w: 300,
    wPhone: 200,
    fs: 15,
    fsPhone: 13,
    reg: 'station',
    z: 22,
  },
  {
    id: 'memory',
    text: 'Memory that survives the week.',
    kind: 'image',
    img: '/a/8/aerial.jpg',
    alt: 'Aerial survey of a braided river delta',
    wide: [0.68, 0.616],
    phone: [0.5, 0.7626],
    rot: -13.2,
    rotPhone: -12,
    w: 330,
    wPhone: 240,
    fs: 22,
    fsPhone: 18,
    reg: 'plate',
    z: 14,
  },
  {
    id: 'cron',
    text: 'Cron jobs at 4am.',
    kind: 'plain',
    wide: [0.59, 0.373],
    phone: [0.6, 0.4403],
    rot: 14.5,
    rotPhone: 13,
    w: 168,
    wPhone: 150,
    fs: 15,
    fsPhone: 14,
    reg: 'hydro',
    z: 40,
    pin: true,
  },
  {
    id: 'source',
    text: 'It edits its own source.',
    kind: 'image',
    img: '/a/8/grid.jpg',
    alt: 'Blueprint sheet of a bracing lattice',
    wide: [0.2925, 0.63],
    phone: [0.5, 0.5665],
    rot: 9.8,
    rotPhone: 10.5,
    w: 470,
    wPhone: 330,
    fs: 27,
    fsPhone: 21,
    reg: 'plate',
    z: 12,
  },
  {
    id: 'reviewer',
    text: 'A reviewer that is not it.',
    kind: 'plain',
    wide: [0.2, 0.4178],
    phone: [0.4545, 0.8788],
    rot: -7.8,
    rotPhone: 6.4,
    w: 240,
    wPhone: 195,
    fs: 18,
    fsPhone: 15,
    reg: 'plate',
    z: 20,
  },
]

/** A wobbling closed ring: a lake shore, or something circled in the field. */
export function ring(cx: number, cy: number, rPx: number, w: number, h: number, seed: number): string {
  const n = 15
  const pts: Pt[] = []
  for (let i = 0; i <= n + 2; i++) {
    const a = ((i % n) / n) * Math.PI * 2
    const r = rPx * (0.8 + rnd(seed + (i % n)) * 0.42)
    pts.push([cx + (Math.cos(a) * r) / w, cy + (Math.sin(a) * r * 0.76) / h])
  }
  return smooth(pts, w, h)
}

/** Standing water. Dark mass is what keeps the sheet from going flat. */
export const LAKES: { c: Pt; r: number; seed: number }[] = [
  { c: [0.885, 0.145], r: 128, seed: 5 },
  { c: [0.315, 0.925], r: 96, seed: 19 },
  { c: [0.045, 0.6], r: 74, seed: 31 },
  { c: [0.625, 0.405], r: 96, seed: 44 },
  { c: [0.53, 0.24], r: 58, seed: 52 },
]

/**
 * Red pencil, added on the sheet after it was printed and after the plates
 * were pasted down. These ride above the cards, so a ring runs straight across
 * cream paper the way it would if somebody circled the whole thing at once.
 */
export const NOTES: { c: Pt; r: number; seed: number }[] = [
  { c: [0.3, 0.325], r: 214, seed: 61 },
  { c: [0.735, 0.6], r: 196, seed: 77 },
  { c: [0.885, 0.145], r: 120, seed: 5 },
  { c: [0.4798, 0.284], r: 152, seed: 88 },
]

/** On the portrait sheet the traverse is a single route down the strip. */
export const PHONE_EDGES: [string, string][] = [
  ['door', 'hero'],
  ['hero', 'cron'],
  ['cron', 'source'],
  ['source', 'browser'],
  ['browser', 'memory'],
  ['memory', 'reviewer'],
  ['door', 'browser'],
]

/** Which nodes are joined by a surveyed traverse. */
export const EDGES: [string, string][] = [
  ['hero', 'door'],
  ['hero', 'browser'],
  ['hero', 'memory'],
  ['hero', 'cron'],
  ['hero', 'source'],
  ['hero', 'reviewer'],
  ['door', 'reviewer'],
  ['browser', 'memory'],
  ['source', 'cron'],
]
