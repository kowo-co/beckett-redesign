/**
 * The contour stock is a photograph of a printed sheet, not a repeating
 * pattern: its left edge is about 35 levels darker than its right, so tiling it
 * raw lays down a patchwork of rectangles with a tonal step at every join. That
 * is fatal for a page whose whole premise is one continuous printed survey.
 *
 * So the plate is made tileable here, in the browser, before it is ever laid
 * down. Standard offset-and-heal: wrap the image by half its size so the four
 * outer edges meet in the middle, which moves every discontinuity onto a cross
 * through the centre, then paint the untouched original back over that cross
 * through a feathered mask. The result repeats forever with no step and no
 * mirror symmetry, at the plate's native resolution, so the contours stay as
 * fine as they were printed.
 */

const BAND = 0.16 // half-width of the healing band, as a fraction of the plate

function heal(img: HTMLImageElement): HTMLCanvasElement {
  const w = img.naturalWidth
  const h = img.naturalHeight

  // Wrapped by half: the seams now run down and across the middle.
  const base = document.createElement('canvas')
  base.width = w
  base.height = h
  const b = base.getContext('2d')
  if (!b) return base
  for (const [ox, oy] of [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [-w / 2, h / 2],
    [w / 2, h / 2],
  ]) {
    b.drawImage(img, ox, oy, w, h)
  }

  // A feathered cross: opaque over the seams, clear everywhere else.
  const mask = document.createElement('canvas')
  mask.width = w
  mask.height = h
  const m = mask.getContext('2d')
  if (!m) return base
  m.globalCompositeOperation = 'lighter'
  const bw = w * BAND
  const bh = h * BAND
  const vert = m.createLinearGradient(w / 2 - bw, 0, w / 2 + bw, 0)
  const horz = m.createLinearGradient(0, h / 2 - bh, 0, h / 2 + bh)
  for (const g of [vert, horz]) {
    g.addColorStop(0, 'rgba(255,255,255,0)')
    g.addColorStop(0.5, 'rgba(255,255,255,1)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
  }
  m.fillStyle = vert
  m.fillRect(w / 2 - bw, 0, bw * 2, h)
  m.fillStyle = horz
  m.fillRect(0, h / 2 - bh, w, bh * 2)

  // The original, cut to that cross, dropped over the seams it does not have.
  const patch = document.createElement('canvas')
  patch.width = w
  patch.height = h
  const p = patch.getContext('2d')
  if (!p) return base
  p.drawImage(img, 0, 0, w, h)
  p.globalCompositeOperation = 'destination-in'
  p.drawImage(mask, 0, 0)

  b.drawImage(patch, 0, 0)
  return base
}

/**
 * Returns an object URL for the tileable plate, or null if it could not be
 * built. Callers fall back to the raw file, which is better than no terrain.
 */
export function seamlessPlate(src: string): { promise: Promise<string | null>; dispose: () => void } {
  let url: string | null = null
  let dead = false

  const promise = new Promise<string | null>((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      try {
        heal(img).toBlob(
          (blob) => {
            if (dead || !blob) return resolve(null)
            url = URL.createObjectURL(blob)
            resolve(url)
          },
          'image/jpeg',
          0.9,
        )
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = src
  })

  return {
    promise,
    dispose: () => {
      dead = true
      if (url) URL.revokeObjectURL(url)
    },
  }
}
