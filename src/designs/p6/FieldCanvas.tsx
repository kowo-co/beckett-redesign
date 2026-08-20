import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * The field. A full-viewport WebGL surface that samples /a/6/chrome.jpg and
 * drags it through a domain-warped fbm, so the chrome smears, folds and keeps
 * folding. The pointer pulls the surface toward itself and rings a ripple out
 * of the contact point.
 *
 * Hard requirements this component honours:
 *   - getContext('webgl') returning null falls back to a plain <img>.
 *   - device pixel ratio capped at 2, resize handled.
 *   - the RAF loop is cancelled on unmount.
 *   - prefers-reduced-motion: reduce renders exactly one frame, binds no
 *     pointer listeners, and stops.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;

uniform sampler2D uTex;
uniform vec2  uRes;
uniform float uTexAspect;
uniform float uTime;
uniform vec2  uPointer;
uniform float uPull;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float scr = uRes.x / uRes.y;

  // cover-fit the texture into the viewport
  vec2 s = scr > uTexAspect
    ? vec2(1.0, uTexAspect / scr)
    : vec2(scr / uTexAspect, 1.0);
  vec2 st = (uv - 0.5) * s + 0.5;

  float t = uTime * 0.05;

  // domain warp, two levels deep
  vec2 p = st * vec2(2.6, 3.4);
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p + 3.4 * q + vec2(1.7, 9.2) + 0.21 * t),
    fbm(p + 3.4 * q + vec2(8.3, 2.8) - 0.17 * t)
  );
  float f = fbm(p + 3.6 * r);

  vec2 warp = (r - 0.5) * 0.30 + (q - 0.5) * 0.10;

  // pointer: drag the surface toward the cursor, ring a ripple out of it
  vec2 d = (uv - uPointer) * vec2(scr, 1.0);
  float dist = length(d) + 1e-5;
  vec2 dir = d / dist;
  float grip = exp(-dist * 3.6);
  float ring = sin(dist * 24.0 - uTime * 2.4) * exp(-dist * 5.0);
  warp -= dir * (grip * 0.16 + ring * 0.05) * uPull;

  vec3 col = texture2D(uTex, clamp(st + warp, 0.001, 0.999)).rgb;

  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 violet = vec3(0.46, 0.12, 1.00);
  vec3 cyan   = vec3(0.10, 0.92, 1.00);
  vec3 tint = mix(violet, cyan, smoothstep(0.30, 0.78, f + 0.28 * r.y));

  vec3 base = vec3(0.018, 0.010, 0.052);
  col = base + col * 0.74 + tint * pow(lum, 2.5) * 1.05;

  // filaments: thin bright seams where the warp folds back on itself
  float seam = smoothstep(0.66, 0.995, fbm(p * 2.2 + 5.0 * r));
  col += cyan * seam * 0.16 * (0.35 + 0.65 * grip);

  // ripple highlight so the contact point reads
  col += cyan * max(ring, 0.0) * grip * 0.55 * uPull;

  // vignette and grain
  vec2 v = uv - 0.5;
  col *= 1.0 - dot(v, v) * 1.05;
  col += (hash(gl_FragCoord.xy * 0.7 + fract(uTime)) - 0.5) * 0.045;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export function FieldCanvas({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dead, setDead] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl =
      (canvas.getContext('webgl', { antialias: false, alpha: false }) as WebGLRenderingContext | null) ??
      null
    if (!gl) {
      setDead(true)
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()
    if (!vs || !fs || !prog) {
      setDead(true)
      return
    }
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setDead(true)
      return
    }
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'uRes')
    const uTime = gl.getUniformLocation(prog, 'uTime')
    const uPointer = gl.getUniformLocation(prog, 'uPointer')
    const uPull = gl.getUniformLocation(prog, 'uPull')
    const uTexAspect = gl.getUniformLocation(prog, 'uTexAspect')

    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGB,
      1,
      1,
      0,
      gl.RGB,
      gl.UNSIGNED_BYTE,
      new Uint8Array([8, 4, 24]),
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0)
    gl.uniform1f(uTexAspect, 1.5)

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const nw = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const nh = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (nw === w && nh === h) return false
      w = nw
      h = nh
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
      return true
    }
    resize()

    // pointer state, eased so the drag has weight
    const target = { x: 0.5, y: 0.62 }
    const at = { x: 0.5, y: 0.62 }
    let pull = 0
    let pullTarget = 0

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth
      target.y = 1 - e.clientY / window.innerHeight
      pullTarget = 1
    }
    const onLeave = () => {
      pullTarget = 0
    }

    let raf = 0
    let ready = false
    const start = performance.now()

    const draw = (now: number) => {
      const time = (now - start) / 1000
      at.x += (target.x - at.x) * 0.08
      at.y += (target.y - at.y) * 0.08
      pull += (pullTarget - pull) * 0.05
      gl.uniform1f(uTime, time)
      gl.uniform2f(uPointer, at.x, at.y)
      gl.uniform1f(uPull, pull)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const frame = (now: number) => {
      resize()
      draw(now)
      raf = requestAnimationFrame(frame)
    }

    const still = () => {
      resize()
      gl.uniform1f(uTime, 12.5)
      gl.uniform2f(uPointer, 0.5, 0.62)
      gl.uniform1f(uPull, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const onResizeStill = () => {
      if (ready) still()
    }

    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
      gl.uniform1f(uTexAspect, img.naturalWidth / Math.max(1, img.naturalHeight))
      ready = true
      if (reduced) {
        still()
      } else {
        raf = requestAnimationFrame(frame)
      }
    }
    img.onerror = () => setDead(true)
    img.src = src

    if (reduced) {
      window.addEventListener('resize', onResizeStill)
    } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onMove, { passive: true })
      window.addEventListener('pointerleave', onLeave)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResizeStill)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      window.removeEventListener('pointerleave', onLeave)
      img.onload = null
      img.onerror = null
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [src, reduced])

  if (dead) {
    return (
      <div className="p6-field p6-field-flat">
        <img src={src} alt="" width={1536} height={1024} />
      </div>
    )
  }

  return (
    <div className="p6-field">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  )
}
