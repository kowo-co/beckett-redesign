import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'
import './field.css'

export function FieldCanvas({ density }: { density: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let raf = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const count = Math.floor(density * 1.2)
    const points = Array.from({ length: count }, (_, i) => ({
      x: (Math.sin(i * 2.1) * 0.4 + 0.5) * canvas.clientWidth,
      y: (Math.cos(i * 1.7) * 0.35 + 0.5) * canvas.clientHeight,
      r: 1 + (i % 3),
      phase: i * 0.4,
    }))

    const draw = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.fillStyle = '#1a1814'
      ctx.fillRect(0, 0, w, h)

      points.forEach((p, i) => {
        const t = frame * 0.008 + p.phase
        const x = p.x + Math.sin(t) * 12
        const y = p.y + Math.cos(t * 0.7) * 8
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = i % 5 === 0 ? '#c4a35a' : '#6b6560'
        ctx.fill()

        if (i > 0 && i % 4 === 0) {
          const prev = points[i - 1]
          ctx.strokeStyle = 'rgba(196, 163, 90, 0.15)'
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(prev.x, prev.y)
          ctx.lineTo(x, y)
          ctx.stroke()
        }
      })

      frame++
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density, reduced])

  if (reduced) return null
  return <canvas ref={canvasRef} aria-hidden="true" />
}

export function FieldPage() {
  const reduced = useReducedMotion()
  const [density, setDensity] = useState(60)

  return (
    <div className="field">
      <a href="#main" className="skip-link" style={{ '--skip-bg': '#1a1814', '--skip-fg': '#e8e4dc' } as CSSProperties}>
        Skip to content
      </a>

      <header className="px-4 sm:px-8 py-6 flex justify-between items-baseline border-b border-[var(--f-muted)]/20">
        <h1 className="text-2xl sm:text-3xl font-bold m-0 tracking-tight">Points on ground.</h1>
        <p className="text-xs text-[var(--f-muted)] m-0">Edinburgh</p>
      </header>

      <main id="main">
        <section className="field__canvas-wrap" aria-label="Live survey point field">
          {reduced ? (
            <img
              src="/assets/field/terrain.jpg"
              alt="Aerial satellite terrain topography"
              className="field__fallback"
            />
          ) : (
            <FieldCanvas density={density} />
          )}
        </section>

        <div className="px-4 sm:px-8 py-12 max-w-xl">
          <p className="text-sm text-[var(--f-muted)] leading-relaxed m-0 mb-8">
            Field Survey maps terrain nobody else walks. Highlands, peat bogs, wind farm sites.
          </p>

          <label htmlFor="density-slider" className="block text-xs uppercase tracking-widest text-[var(--f-muted)] mb-3">
            Survey point density
          </label>
          <input
            id="density-slider"
            type="range"
            min={20}
            max={120}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
          />
          <p className="text-lg mt-4 m-0 tabular-nums text-[var(--f-accent)]">{density} points/km²</p>

          <figure className="mt-12 mb-8">
            <img
              src="/assets/field/survey.jpg"
              alt="Surveyor theodolite on tripod in grassland"
              className="w-full"
              loading="lazy"
            />
          </figure>

          <figure>
            <img
              src="/assets/field/contour.jpg"
              alt="Hand-drawn topographic contour map"
              className="w-full"
              loading="lazy"
            />
          </figure>
        </div>

        <section className="px-4 sm:px-8 py-8 border-t border-[var(--f-muted)]/30">
          <a href="mailto:survey@field.ltd" className="text-[var(--f-accent)] underline underline-offset-4 text-sm">
            survey@field.ltd
          </a>
        </section>
      </main>
    </div>
  )
}
