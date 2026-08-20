import { useEffect } from 'react'
import type { RefObject } from 'react'

/**
 * Ordered-dither engine for /10. One hook, used once per surface.
 *
 * The canvas is sized in *cells*, not pixels: a 1280px wide surface at a 5px
 * cell becomes a 256x180 backing store that CSS stretches back up with
 * `image-rendering: pixelated`. So the downsample, the threshold pass and the
 * blocky output are all the same cheap operation, and the whole frame is a
 * ~46k pixel loop.
 *
 * Every pixel is either phosphor mint or the black of the tube. No greys.
 */

/** Bayer 8x8, values 0..63. */
const BAYER8 = [
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
]

const ON = [201, 255, 227] as const
const OFF = [2, 6, 4] as const

export interface DitherOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>
  /** Element that contains the <Reel>'s real <video>; that video is the source. */
  hostRef: RefObject<HTMLElement | null>
  /** Still used when the video has no frame yet, or cannot play at all. */
  fallbackSrc: string
  /** Cell size in CSS pixels. */
  cell: number
  reduced: boolean
  /** Pushes the whole surface darker (+) or brighter (-). */
  bias?: number
  /** Spread of the Bayer matrix around the threshold. */
  amplitude?: number
  /**
   * Extra threshold at the left edge, tapering to nothing at the right. The
   * composition is cut into the dither rather than laid over it: the type side
   * of the page stays black, the far side is allowed to burn out.
   */
  gradient?: number
  /**
   * An element whose box is punched out of the field: inside it the threshold
   * is lifted hard and the Bayer spread collapses, so the cell grid stops
   * flickering between values and the glyphs over it keep their silhouette.
   * The pointer bloom and the scan sweep are masked out of it too.
   */
  quietRef?: RefObject<HTMLElement | null>
  /** How far the threshold is lifted inside `quietRef`. */
  quiet?: number
  /** Let the pointer bloom and collapse the smoke. */
  pointer?: boolean
  /** Slow autonomous breathing plus the scan sweep. */
  live?: boolean
}

export function useDither(options: DitherOptions) {
  const {
    canvasRef,
    hostRef,
    fallbackSrc,
    cell,
    reduced,
    bias = 0,
    amplitude = 104,
    gradient = 0,
    quietRef,
    quiet = 0,
    pointer = false,
    live = true,
  } = options

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let alive = true
    let raf = 0
    let retry = 0
    let video: HTMLVideoElement | null = null
    let fallbackReady = false

    /** Per-axis mask for the quiet box, rebuilt only when the grid resizes. */
    let maskX = new Float32Array(0)
    let maskY = new Float32Array(0)

    const fallback = new Image()
    const ptr = { x: -1, y: -1 }

    const onPointer = (e: PointerEvent) => {
      ptr.x = e.clientX
      ptr.y = e.clientY
    }
    const onLeave = () => {
      ptr.x = -1
      ptr.y = -1
    }

    /** Resize the backing store to the cell grid. Cheap, so it runs per frame. */
    const fit = () => {
      const rect = canvas.getBoundingClientRect()
      const gw = Math.max(8, Math.round(rect.width / cell))
      const gh = Math.max(8, Math.round(rect.height / cell))
      if (canvas.width !== gw) canvas.width = gw
      if (canvas.height !== gh) canvas.height = gh
      return rect
    }

    /**
     * Build the falloff along one axis for the quiet box. `a`/`b` are the box
     * edges in cells; `taper` is how many cells it takes to come back up.
     */
    const ramp = (
      buf: Float32Array<ArrayBuffer>,
      n: number,
      a: number,
      b: number,
      taper: number,
    ): Float32Array<ArrayBuffer> => {
      const out = buf.length === n ? buf : new Float32Array(n)
      if (b <= a) {
        out.fill(0)
        return out
      }
      for (let i = 0; i < n; i++) {
        const c = i + 0.5
        let f = 1
        if (c < a) f = 1 - (a - c) / taper
        else if (c > b) f = 1 - (c - b) / taper
        out[i] = f <= 0 ? 0 : f >= 1 ? 1 : f * f * (3 - 2 * f)
      }
      return out
    }

    /** Punch the quiet box out of the grid, in grid coordinates. */
    const buildMask = (rect: DOMRect, gw: number, gh: number) => {
      const el = quietRef?.current
      if (!el || quiet === 0 || rect.width === 0 || rect.height === 0) return false
      const b = el.getBoundingClientRect()
      if (b.width === 0 || b.height === 0) return false
      const pad = 12
      const sx = gw / rect.width
      const sy = gh / rect.height
      const taper = Math.max(1.5, 22 / cell)
      maskX = ramp(maskX, gw, (b.left - pad - rect.left) * sx, (b.right + pad - rect.left) * sx, taper)
      maskY = ramp(maskY, gh, (b.top - pad - rect.top) * sy, (b.bottom + pad - rect.top) * sy, taper)
      return true
    }

    const frame = (t: number): boolean => {
      const rect = fit()
      const gw = canvas.width
      const gh = canvas.height

      if (!video || !video.isConnected) {
        video = hostRef.current?.querySelector('video') ?? null
      }

      let source: CanvasImageSource | null = null
      let sw = 0
      let sh = 0
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        source = video
        sw = video.videoWidth
        sh = video.videoHeight
      } else if (fallbackReady && fallback.naturalWidth > 0) {
        source = fallback
        sw = fallback.naturalWidth
        sh = fallback.naturalHeight
      }
      if (!source) return false

      const scale = Math.max(gw / sw, gh / sh)
      const dw = sw * scale
      const dh = sh * scale
      ctx.drawImage(source, (gw - dw) / 2, (gh - dh) / 2, dw, dh)

      const img = ctx.getImageData(0, 0, gw, gh)
      const d = img.data

      const still = 122 + bias
      let base = still
      let sweep = -1
      if (live && !reduced) {
        base += Math.sin(t / 2300) * 13 + Math.sin(t / 770 + 1.7) * 5
        sweep = (t / 5400) % 1
      }

      let px = -1
      let py = -1
      if (pointer && !reduced && ptr.x >= 0 && rect.width > 0) {
        px = (ptr.x - rect.left) / rect.width
        py = (ptr.y - rect.top) / rect.height
        if (px < -0.3 || px > 1.3 || py < -0.3 || py > 1.3) px = -1
        else base += (py - 0.5) * 40
      }

      const spread = amplitude / 63
      const aspect = gh / gw

      // Inside the quiet box the threshold is high, flat and deaf to the
      // pointer: only the genuinely bright pixels light, so the cells behind
      // the type hold still instead of alternating value and shredding it.
      const masked = buildMask(rect, gw, gh)
      const quietBase = still + quiet
      const quietSpread = spread * 0.26

      for (let y = 0; y < gh; y++) {
        const ny = y / gh
        let row = base
        if (sweep >= 0) {
          const dist = Math.abs(ny - sweep)
          if (dist < 0.16) row -= (1 - dist / 0.16) * 20
        }
        const bayerRow = (y & 7) << 3
        const my = masked ? maskY[y] : 0
        for (let x = 0; x < gw; x++) {
          const nx = x / gw
          const b64 = BAYER8[bayerRow | (x & 7)]
          const bayer = b64 - 31.5
          let th = row + bayer * spread
          if (gradient !== 0) th += (1 - nx) * gradient
          if (px >= 0) {
            const dx = nx - px
            const dy = (ny - py) * aspect
            const dd = Math.sqrt(dx * dx + dy * dy)
            if (dd < 0.44) {
              const f = 1 - dd / 0.44
              th -= f * f * 60
            }
          }
          let m = 0
          if (my > 0) {
            m = my * maskX[x]
            if (m > 0) th += (quietBase + bayer * quietSpread - th) * m
          }
          const i = (y * gw + x) << 2
          const lum = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]
          let on = lum > th
          // Inside the box the field is also printed at a fifth of the density,
          // so however bright the plume gets it can never form a mass solid
          // enough to swallow a glyph. Type wins the argument every frame.
          if (on && m > 0 && b64 >= 64 - m * 50) on = false
          const c = on ? ON : OFF
          d[i] = c[0]
          d[i + 1] = c[1]
          d[i + 2] = c[2]
          d[i + 3] = 255
        }
      }

      ctx.putImageData(img, 0, 0)
      return true
    }

    if (reduced) {
      // One frame, then nothing. Keep trying until the poster or a video frame
      // exists so the page never renders an empty rectangle.
      const once = () => {
        if (!alive) return
        if (!frame(0) && retry++ < 80) {
          raf = window.setTimeout(once, 120)
        }
      }
      fallback.onload = () => {
        fallbackReady = true
        once()
      }
      fallback.src = fallbackSrc
      const onResize = () => {
        retry = 0
        once()
      }
      window.addEventListener('resize', onResize)
      once()
      return () => {
        alive = false
        window.clearTimeout(raf)
        window.removeEventListener('resize', onResize)
        fallback.onload = null
      }
    }

    fallback.onload = () => {
      fallbackReady = true
    }
    fallback.src = fallbackSrc

    if (pointer) {
      window.addEventListener('pointermove', onPointer, { passive: true })
      window.addEventListener('pointerleave', onLeave)
    }

    const loop = (t: number) => {
      if (!alive) return
      frame(t)
      raf = window.requestAnimationFrame(loop)
    }
    raf = window.requestAnimationFrame(loop)

    return () => {
      alive = false
      window.cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onLeave)
      fallback.onload = null
    }
  }, [
    canvasRef,
    hostRef,
    fallbackSrc,
    cell,
    reduced,
    bias,
    amplitude,
    gradient,
    quietRef,
    quiet,
    pointer,
    live,
  ])
}
