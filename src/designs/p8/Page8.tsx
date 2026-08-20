import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Reel } from '../../lib/Reel'
import { useReducedMotion } from '../../lib/useReducedMotion'
import {
  EDGES,
  LAKES,
  PHONE_EDGES,
  NODES,
  NOTES,
  REGIONS,
  RIVERS,
  URBAN,
  ring,
  rnd,
  smooth,
  ticksAlong,
  type NodeSpec,
  type Pt,
} from './atlas'
import { seamlessPlate } from './terrain'
import './p8.css'

type Box = { w: number; h: number }
type Pan = { x: number; y: number }

const WIDE: Box = { w: 2000, h: 1460 }
const PHONE: Box = { w: 880, h: 1980 }
const STEP = 80

function clamp(pan: Pan, world: Box, view: Box): Pan {
  return {
    x: world.w <= view.w ? (view.w - world.w) / 2 : Math.min(0, Math.max(view.w - world.w, pan.x)),
    y: world.h <= view.h ? (view.h - world.h) / 2 : Math.min(0, Math.max(view.h - world.h, pan.y)),
  }
}

/** Red pencil, drawn last of all: over the print and over the pasted plates. */
function Notes({ world, phone, k }: { world: Box; phone: boolean; k: number }) {
  const { w, h } = world
  const notes = NOTES.map((n) => ({ ...n, c: (phone ? [n.c[1], n.c[0]] : n.c) as Pt }))
  return (
    <svg className="p8-note" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      {notes.map((n, i) => (
        <path key={`nt${i}`} d={`${ring(n.c[0], n.c[1], (phone ? n.r * 0.7 : n.r) * k, w, h, n.seed)} Z`} />
      ))}
    </svg>
  )
}

/** The drawn sheet: water, hatching, graticule, traverses, benchmarks. */
function Plate({ world, phone, k, at }: { world: Box; phone: boolean; k: number; at: (n: NodeSpec) => Pt }) {
  const { w, h } = world
  const gap = Math.round((phone ? 82 : 104) * k)

  // The sheet was drawn landscape. On a portrait plate it is turned, not squashed.
  const turn = useCallback((p: Pt): Pt => (phone ? [p[1], p[0]] : p), [phone])
  const rivers = useMemo(() => RIVERS.map((r) => r.map(turn)), [turn])
  const regions = useMemo(() => REGIONS.map((r) => r.map(turn)), [turn])
  const urban = useMemo(() => URBAN.map((r) => r.map(turn)), [turn])
  const lakes = useMemo(() => LAKES.map((l) => ({ ...l, c: turn(l.c) })), [turn])
  const edges = phone ? PHONE_EDGES : EDGES

  const cols = useMemo(() => {
    const out: number[] = []
    for (let x = gap; x < w; x += gap) out.push(x)
    return out
  }, [w, gap])
  const rows = useMemo(() => {
    const out: number[] = []
    for (let y = gap; y < h; y += gap) out.push(y)
    return out
  }, [h, gap])

  const anchors = useMemo(() => {
    const m = new Map<string, Pt>()
    for (const n of NODES) m.set(n.id, at(n))
    return m
  }, [at])

  const marks = useMemo(() => {
    const out: { x: number; y: number; kind: number; r: number }[] = []
    const count = Math.round((phone ? 26 : 44) * k)
    for (let i = 0; i < count; i++) {
      out.push({
        x: rnd(i * 3 + 1) * w,
        y: rnd(i * 3 + 2) * h,
        kind: Math.floor(rnd(i * 3 + 3) * 4),
        r: rnd(i * 5 + 7) * 60,
      })
    }
    return out
  }, [w, h, phone, k])

  return (
    <svg className="p8-plate" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="p8-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="#0d1b12" strokeWidth="0.8" opacity="0.34" />
        </pattern>
        <pattern id="p8-marsh" width="26" height="18" patternUnits="userSpaceOnUse">
          <line x1="2" y1="5" x2="12" y2="5" stroke="#0d1b12" strokeWidth="1" opacity="0.4" />
          <line x1="15" y1="12" x2="24" y2="12" stroke="#0d1b12" strokeWidth="1" opacity="0.4" />
        </pattern>
      </defs>

      <g className="p8-graticule">
        {cols.map((x, i) => (
          <line key={`c${x}`} x1={x} y1="0" x2={x} y2={h} strokeWidth={i % 5 === 4 ? 1.1 : 0.5} opacity={i % 5 === 4 ? 0.42 : 0.2} />
        ))}
        {rows.map((y, i) => (
          <line key={`r${y}`} x1="0" y1={y} x2={w} y2={y} strokeWidth={i % 5 === 4 ? 1.1 : 0.5} opacity={i % 5 === 4 ? 0.42 : 0.2} />
        ))}
      </g>

      {regions.map((poly, i) => (
        <polygon
          key={`reg${i}`}
          className="p8-region"
          points={poly.map(([x, y]) => `${x * w},${y * h}`).join(' ')}
          fill={i === 0 ? 'url(#p8-hatch)' : 'url(#p8-marsh)'}
        />
      ))}

      <g className="p8-urban">
        <clipPath id="p8-urbanclip">
          {urban.map((poly, i) => (
            <polygon key={`uc${i}`} points={poly.map(([x, y]) => `${x * w},${y * h}`).join(' ')} />
          ))}
        </clipPath>
        {urban.map((poly, i) => (
          <polygon key={`urb${i}`} points={poly.map(([x, y]) => `${x * w},${y * h}`).join(' ')} />
        ))}
        {/* The graticule and the block grain are struck back over the solid so
            it reads as printed ground rather than a hole cut in the sheet. */}
        <g clipPath="url(#p8-urbanclip)" className="p8-urban-over">
          {cols.map((x) => (
            <line key={`uc${x}`} x1={x} y1="0" x2={x} y2={h} />
          ))}
          {rows.map((y) => (
            <line key={`ur${y}`} x1="0" y1={y} x2={w} y2={y} />
          ))}
          {marks.map((m, i) => (
            <rect
              key={`ub${i}`}
              x={m.x - 26 * k}
              y={m.y - 13 * k}
              width={(20 + (m.kind + 1) * 11) * k}
              height={(8 + m.kind * 4) * k}
              transform={`rotate(${(m.r % 22) - 11} ${m.x} ${m.y})`}
            />
          ))}
        </g>
      </g>

      <g className="p8-water">
        {lakes.map((l, i) => (
          <path key={`lk${i}`} d={`${ring(l.c[0], l.c[1], (phone ? l.r * 0.78 : l.r) * k, w, h, l.seed)} Z`} className="p8-lake" />
        ))}
        {rivers.map((r, i) => (
          <path key={`wb${i}`} d={smooth(r, w, h)} className="p8-water-bed" strokeWidth={(i === 0 ? (phone ? 54 : 76) : phone ? 22 : 32) * k} />
        ))}
        {rivers.map((r, i) => (
          <path key={`wc${i}`} d={smooth(r, w, h)} className="p8-water-line" strokeWidth={i === 0 ? 2.2 : 1.2} />
        ))}
      </g>

      <g className="p8-ghost" transform="translate(4.5 -3.5)">
        {edges.map(([a, b]) => {
          const pa = anchors.get(a)
          const pb = anchors.get(b)
          if (!pa || !pb) return null
          return <line key={`g${a}-${b}`} x1={pa[0] * w} y1={pa[1] * h} x2={pb[0] * w} y2={pb[1] * h} />
        })}
      </g>

      <g className="p8-traverse">
        {edges.map(([a, b]) => {
          const pa = anchors.get(a)
          const pb = anchors.get(b)
          if (!pa || !pb) return null
          return (
            <g key={`${a}-${b}`}>
              <line x1={pa[0] * w} y1={pa[1] * h} x2={pb[0] * w} y2={pb[1] * h} className="p8-traverse-line" />
              {ticksAlong(pa, pb, w, h, (phone ? 58 : 78) * k, 6 * k).map((t, i) => (
                <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className="p8-traverse-tick" />
              ))}
            </g>
          )
        })}
      </g>

      <g className="p8-marks">
        {marks.map((m, i) => {
          if (m.kind === 0) {
            return (
              <g key={i} transform={`translate(${m.x} ${m.y}) rotate(${m.r}) scale(${k})`}>
                <path d="M -7 5 L 0 -7 L 7 5 Z" />
                <circle cx="0" cy="1" r="1.6" className="p8-solid" />
              </g>
            )
          }
          if (m.kind === 1) {
            return (
              <g key={i} transform={`translate(${m.x} ${m.y}) scale(${k})`}>
                <line x1="-9" y1="0" x2="9" y2="0" />
                <line x1="0" y1="-9" x2="0" y2="9" />
                <circle cx="0" cy="0" r="4.5" />
              </g>
            )
          }
          if (m.kind === 2) {
            return (
              <g key={i} transform={`translate(${m.x} ${m.y}) rotate(${m.r}) scale(${k})`}>
                <ellipse cx="0" cy="0" rx="26" ry="15" />
                <ellipse cx="1" cy="0" rx="15" ry="8" />
                <ellipse cx="2" cy="0" rx="6" ry="3" />
              </g>
            )
          }
          return (
            <g key={i} transform={`translate(${m.x} ${m.y}) rotate(${m.r}) scale(${k})`}>
              <line x1="-14" y1="-4" x2="14" y2="-4" strokeDasharray="3 6" />
              <line x1="-10" y1="4" x2="10" y2="4" strokeDasharray="3 6" />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function Page8() {
  const reduced = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({})
  const [bias, setBias] = useState(0)
  const biasRef = useRef(0)

  const [view, setView] = useState<Box>({ w: 1280, h: 900 })
  const [phone, setPhone] = useState(false)
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })
  const [eased, setEased] = useState(false)
  const [dragging, setDragging] = useState(false)

  const panRef = useRef<Pan>({ x: 0, y: 0 })
  const [world, setWorld] = useState<Box>(WIDE)
  const [plate, setPlate] = useState<string>('/a/8/contour.jpg')

  // The contour stock is made tileable once, then laid down as one field.
  useEffect(() => {
    const job = seamlessPlate('/a/8/contour.jpg')
    let live = true
    job.promise.then((url) => {
      if (live && url) setPlate(url)
    })
    return () => {
      live = false
      job.dispose()
    }
  }, [])

  /**
   * The landscape plate is composed for a 1280 frame. On a narrower desktop the
   * sheet does not shrink, so without help the outer plates hang off the frame
   * and a caption gets guillotined mid-word. Instead the scatter is drawn in
   * towards the hero: the same seven stations, surveyed closer together.
   *
   * Cards are meant to overlap and to bleed off the edges, the way plates on a
   * survey sheet do. What may never happen is a caption sliced by the frame,
   * because these seven captions are the whole of the page's copy. The station
   * furthest out is `memory`, and the room it needs is linear in the frame, so
   * the draw-in is linear too and carries a little margin under it. An earlier
   * 0.62 floor stopped the draw-in at about 940px and left four captions cut
   * mid-word between there and the phone breakpoint.
   *
   * The vertical will not take the same treatment, and it is worth writing down
   * why. `door` hangs its caption at the foot of a 366-tall plate, and at full
   * spread that caption clears the top edge of the hero card by two and a half
   * pixels. Survey the sheet in vertically and the caption is under the hero at
   * once. So the vertical spread is not free to be chosen: it is tied to the
   * gauge below, which is the one move that shrinks the hero card at the same
   * rate, and the two-and-a-half pixels are held at every size.
   */
  const spreadX = Math.min(1, Math.max(0.34, (view.w - 400) / 900))

  /**
   * A short frame is struck at a smaller gauge. Station positions are a fraction
   * of the world and do not move when the gauge drops, so this is not a zoom: it
   * shrinks the cards while the sheet stays where it is, which is what buys the
   * lower two captions their room above the bottom edge. `spreadY` rides the
   * same number so the hero card contracts in step with the stations above it.
   */
  const gauge = Math.min(1, Math.max(0.8, (view.h - 16) / 798))
  const spreadY = gauge

  const at = useCallback(
    (n: NodeSpec): Pt => {
      if (phone) return n.phone
      if (n.pin) return n.wide
      const [hx, hy] = NODES[0].wide
      return [hx + (n.wide[0] - hx) * spreadX, hy + (n.wide[1] - hy) * spreadY]
    },
    [phone, spreadX, spreadY],
  )

  /**
   * The sheet is printed at whatever size the frame demands. If the world grew
   * to fill a wide monitor, the plates, the lettering and the line work grow
   * with it, so 2560px shows a bigger sheet rather than the same seven stamps
   * marooned in a field.
   *
   * It grows by the tighter of the two axes. Following width alone, an ultrawide
   * but short frame struck the cards half again as large while the vertical room
   * stayed where it was, and the two lower captions were pushed out under the
   * bottom edge.
   *
   * The portrait sheet stops growing at 1. Its stations are spaced down a fixed
   * 1980 of world, so a card struck any larger than this only eats the gap to
   * the station under it. Below 375 the gauge still drops away with the frame,
   * which is the safe direction.
   */
  const fit = Math.min(world.w / WIDE.w, world.h / WIDE.h)
  const k = phone
    ? Math.min(1, Math.max(0.84, view.w / 375))
    : Math.min(1.55, fit * gauge)

  const origin = useCallback(
    (v: Box, wd: Box, ph: boolean, by: number): Pan => {
      const hero = NODES[0]
      const a = ph ? hero.phone : hero.wide
      return clamp({ x: v.w / 2 - a[0] * wd.w, y: v.h / 2 - by - a[1] * wd.h }, wd, v)
    },
    [],
  )

  const apply = useCallback(
    (next: Pan, v: Box, wd: Box) => {
      const c = clamp(next, wd, v)
      panRef.current = c
      setPan(c)
    },
    [],
  )

  /**
   * The band of caption is not centred on the hero. The three plates hang their
   * lettering at the foot of a tall card and the small stations carry theirs in
   * the middle, so the writing on the sheet sits lower than the hero does. On a
   * frame with height to spare that costs nothing. On a short one the band runs
   * out under the bottom edge while forty-odd pixels of slack sit unused above
   * it, so the rest position gives back exactly the difference, and never more
   * than the slack above will bear. Measured off the sheet rather than kept as a
   * table of numbers here, so it stays true if the lettering is ever reset.
   */
  useLayoutEffect(() => {
    const heroEl = nodeRefs.current[NODES[0].id]
    if (!heroEl || phone) {
      if (bias !== 0) {
        biasRef.current = 0
        setBias(0)
      }
      return
    }
    const hb = heroEl.getBoundingClientRect()
    const mid = hb.top + hb.height / 2
    let top = Infinity
    let bot = -Infinity
    for (const n of NODES) {
      const cap = nodeRefs.current[n.id]?.querySelector('.p8-node-text, .p8-h1')
      if (!cap) continue
      const r = cap.getBoundingClientRect()
      top = Math.min(top, r.top - mid)
      bot = Math.max(bot, r.bottom - mid)
    }
    if (!Number.isFinite(top)) return
    // Both ends are measured off the hero, so panning cannot move them and this
    // settles in a single pass.
    const half = view.h / 2 - 10
    const next = Math.round(Math.min(Math.max(0, bot - half), Math.max(0, top + half)))
    if (Math.abs(next - bias) > 0.5) {
      biasRef.current = next
      setBias(next)
      apply(origin(view, world, phone, next), view, world)
    }
  }, [view, world, k, spreadX, spreadY, phone, bias, apply, origin])

  // Measure, and recompose when the frame changes size.
  useLayoutEffect(() => {
    const measure = () => {
      const el = frameRef.current
      if (!el) return
      const v = { w: el.clientWidth, h: el.clientHeight }
      /**
       * Which of the two sheets is struck. The landscape sheet stands the hero
       * card, 548 wide, in the middle of the frame and flies the stations out
       * to either side of it; under about a thousand pixels the gutter beside
       * the hero is narrower than the cards meant to sit in it, and `reviewer`
       * ends up reading through the hero. No amount of surveying in rescues it,
       * because drawing the stations closer only buries them further. The
       * portrait sheet is the one composed for a frame that narrow, so the
       * changeover sits at 1024: a tablet held long gets the column, the same
       * tablet turned gets the landscape sheet.
       */
      const ph = v.w < 1024
      // The sheet is always larger than the frame, so there is always somewhere to go.
      const base = ph ? PHONE : WIDE
      const wd = { w: Math.max(base.w, v.w + 440), h: Math.max(base.h, v.h + 420) }
      setView(v)
      setPhone(ph)
      setWorld(wd)
      apply(origin(v, wd, ph, biasRef.current), v, wd)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [apply, origin])

  const panBy = useCallback(
    (dx: number, dy: number, smoothMove: boolean) => {
      setEased(smoothMove && !reduced)
      apply({ x: panRef.current.x + dx, y: panRef.current.y + dy }, view, world)
    },
    [apply, reduced, view, world],
  )

  // Wheel pans the sheet. Non-passive so the gesture belongs to the map.
  useEffect(() => {
    const el = frameRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      setEased(false)
      apply({ x: panRef.current.x - e.deltaX, y: panRef.current.y - e.deltaY }, view, world)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [apply, view, world])

  const drag = useRef<{ id: number; x: number; y: number; from: Pan } | null>(null)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    const t = e.target as HTMLElement
    if (t.closest('a, button')) return
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, from: { ...panRef.current } }
    frameRef.current?.setPointerCapture(e.pointerId)
    setEased(false)
    setDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    apply({ x: d.from.x + (e.clientX - d.x), y: d.from.y + (e.clientY - d.y) }, view, world)
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return
    drag.current = null
    setDragging(false)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, [number, number]> = {
      ArrowLeft: [STEP, 0],
      ArrowRight: [-STEP, 0],
      ArrowUp: [0, STEP],
      ArrowDown: [0, -STEP],
    }
    const d = map[e.key]
    if (!d) return
    e.preventDefault()
    panBy(d[0], d[1], true)
  }

  /** A node that takes focus pulls itself onto the sheet by the shortest move. */
  const onNodeFocus = (id: string) => {
    const frame = frameRef.current
    const el = nodeRefs.current[id]
    if (!frame || !el) return
    const f = frame.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const m = 20
    let dx = 0
    let dy = 0
    if (r.left < f.left + m) dx = f.left + m - r.left
    else if (r.right > f.right - m) dx = Math.max(f.right - m - r.right, f.left + m - r.left)
    if (r.top < f.top + m) dy = f.top + m - r.top
    else if (r.bottom > f.bottom - m) dy = Math.max(f.bottom - m - r.bottom, f.top + m - r.top)
    if (dx || dy) panBy(dx, dy, true)
  }

  // The index diagram fits a box rather than tracking the world ratio, so the
  // portrait sheet cannot collapse it into an illegible sliver on a phone.
  const mmBox = phone ? { w: 42, h: 68 } : { w: 68, h: 68 }
  const mmFit = Math.min(mmBox.w / world.w, mmBox.h / world.h)
  const mmW = Math.max(phone ? 38 : 46, Math.round(world.w * mmFit))
  const mmH = Math.max(30, Math.round(world.h * mmFit))
  const vr = {
    x: (-pan.x / world.w) * mmW,
    y: (-pan.y / world.h) * mmH,
    w: Math.min(mmW, (view.w / world.w) * mmW),
    h: Math.min(mmH, (view.h / world.h) * mmH),
  }

  return (
    <div className="p8">
      <a className="skip-link" href="#main">Skip to content</a>

      <main id="main" className="p8-main">
        <div
          ref={frameRef}
          className={`p8-frame${dragging ? ' is-dragging' : ''}`}
          tabIndex={0}
          role="group"
          aria-label="Survey sheet. Drag, or pan with the arrow keys."
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
        >
          <div
            className="p8-deep"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${plate})`,
              backgroundPosition: `${pan.x * (reduced ? 1 : 0.35)}px ${pan.y * (reduced ? 1 : 0.35)}px`,
            }}
          />

          <div
            className={`p8-world${eased ? ' is-eased' : ''}`}
            style={{
              width: world.w,
              height: world.h,
              transform: `translate3d(${Math.round(pan.x)}px, ${Math.round(pan.y)}px, 0)`,
            }}
          >
            <div className="p8-terrain" aria-hidden="true" style={{ backgroundImage: `url(${plate})` }} />
            <div className="p8-terrain p8-terrain--b" aria-hidden="true" style={{ backgroundImage: `url(${plate})` }} />
            <div className="p8-terrain p8-terrain--misreg" aria-hidden="true" style={{ backgroundImage: `url(${plate})` }} />

            <Plate world={world} phone={phone} k={k} at={at} />

            {NODES.map((n) => {
              const a = at(n)
              const style = {
                left: `${a[0] * world.w}px`,
                top: `${a[1] * world.h}px`,
                width: `${Math.round((phone ? n.wPhone : n.w) * k)}px`,
                zIndex: n.z,
                ['--rot' as string]: `${phone ? n.rotPhone : n.rot}deg`,
                ['--fs' as string]: `${((phone ? n.fsPhone : n.fs) * k).toFixed(1)}px`,
                ['--k' as string]: k,
              } as React.CSSProperties
              return (
                <section
                  key={n.id}
                  className={`p8-node p8-node--${n.kind} p8-reg--${n.reg}`}
                  data-id={n.id}
                  style={style}
                  tabIndex={0}
                  ref={(el) => {
                    nodeRefs.current[n.id] = el
                  }}
                  onFocus={() => onNodeFocus(n.id)}
                >
                  <span className="p8-corner p8-corner--tl" aria-hidden="true" />
                  <span className="p8-corner p8-corner--br" aria-hidden="true" />

                  {n.kind === 'video' && (
                    <span className="p8-plateimg">
                      <Reel
                        src="/a/8/delta.mp4"
                        poster="/a/8/delta-poster.jpg"
                        label="Aerial footage of a river delta running out to the sea"
                        className="p8-reel"
                      />
                    </span>
                  )}

                  {n.kind === 'image' && n.img && (
                    <span className="p8-plateimg">
                      <img src={n.img} alt={n.alt ?? ''} width={1024} height={1024} />
                    </span>
                  )}

                  {n.kind === 'hero' ? (
                    <>
                      <h1 className="p8-h1">
                        <span className="p8-h1-lead">Drag.</span> The work is spread out here.
                      </h1>
                      <p className="p8-fogg">Fogg: Tailoring. You pick your own route.</p>
                      <svg className="p8-reticle" viewBox="0 0 90 90" width="90" height="90" aria-hidden="true" focusable="false">
                        <circle cx="45" cy="45" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="45" cy="45" r="13" fill="none" stroke="currentColor" strokeWidth="1" />
                        <circle cx="45" cy="45" r="2.4" fill="currentColor" stroke="none" />
                        <line x1="45" y1="0" x2="45" y2="26" stroke="currentColor" strokeWidth="1" />
                        <line x1="45" y1="64" x2="45" y2="90" stroke="currentColor" strokeWidth="1" />
                        <line x1="0" y1="45" x2="26" y2="45" stroke="currentColor" strokeWidth="1" />
                        <line x1="64" y1="45" x2="90" y2="45" stroke="currentColor" strokeWidth="1" />
                      </svg>
                      <a className="p8-cta" href="https://discord.com">
                        Start in Discord
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
                          <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </a>
                    </>
                  ) : (
                    <p className="p8-node-text">{n.text}</p>
                  )}

                  <span className="p8-pin" aria-hidden="true">
                    <svg viewBox="0 0 18 34" width="18" height="34" focusable="false">
                      <line x1="9" y1="8" x2="9" y2="31" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="9" cy="32" r="1.8" fill="currentColor" />
                      <circle cx="9" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                </section>
              )
            })}

            <Notes world={world} phone={phone} k={k} />
          </div>

          <div className="p8-crop" aria-hidden="true" />
        </div>
      </main>

      <div className="p8-hud">
        <button
          type="button"
          className="p8-recentre"
          onClick={() => {
            setEased(!reduced)
            apply(origin(view, world, phone, biasRef.current), view, world)
          }}
        >
          Recentre
        </button>
      </div>

      <div className="p8-minimap" aria-hidden="true">
        <svg width={mmW} height={mmH} viewBox={`0 0 ${mmW} ${mmH}`} focusable="false">
          <rect x="0" y="0" width={mmW} height={mmH} className="p8-mm-bed" />
          {RIVERS.map((r, i) => (
            <path
              key={i}
              d={smooth(phone ? r.map((q) => [q[1], q[0]] as Pt) : r, mmW, mmH)}
              className="p8-mm-water"
              strokeWidth={i === 0 ? 2.4 : 1}
            />
          ))}
          {NODES.map((n) => {
            const a = at(n)
            return <circle key={n.id} cx={a[0] * mmW} cy={a[1] * mmH} r={n.kind === 'hero' ? 2.8 : 1.7} className="p8-mm-dot" />
          })}
          <rect x={vr.x} y={vr.y} width={vr.w} height={vr.h} className="p8-mm-view" />
        </svg>
        <div className="p8-scale">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="p8-compass" aria-hidden="true">
        <svg viewBox="0 0 44 44" width="44" height="44" focusable="false">
          <circle cx="22" cy="22" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <circle cx="22" cy="22" r="20.5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="1 4" />
          <path d="M22 3 L26.5 22 L22 19 Z" fill="currentColor" />
          <path d="M22 3 L17.5 22 L22 19 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M22 41 L26.5 22 L22 25 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <path d="M22 41 L17.5 22 L22 25 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>

      <a className="homebar" href="/">Index</a>
    </div>
  )
}
