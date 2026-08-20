/**
 * Gate for the ten pages. Runs every route in a real browser at 375px and at
 * 1280px and fails on anything the brief calls a hard limit.
 *
 *   node scripts/audit.mjs           # all routes
 *   node scripts/audit.mjs 3 7       # just those routes
 *
 * Expects a server on BASE_URL (default http://127.0.0.1:4321).
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4321'
const ONLY = process.argv.slice(2).filter((a) => /^\d+$/.test(a))
const ROUTES = ONLY.length ? ONLY : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

const BANNED = [
  'seamless', 'robust', 'leverage', 'crucial', 'pivotal', 'landscape',
  'delve', 'empower', 'unlock', 'transform', 'elevate',
  'ai assistant', 'productivity', 'copilot', 'supercharge',
]

const MAX_PAGE_WORDS = 149
const MAX_HERO_WORDS = 8

/** Runs inside the page. Returns everything the checks need. */
function collect() {
  const hidden = new Set()
  for (const el of document.querySelectorAll('.skip-link, .vh')) hidden.add(el)

  const visibleText = (root) => {
    let out = ''
    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        out += ' ' + node.nodeValue
        return
      }
      if (node.nodeType !== Node.ELEMENT_NODE) return
      const el = /** @type {Element} */ (node)
      if (hidden.has(el)) return
      const tag = el.tagName
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return
      for (const child of node.childNodes) walk(child)
    }
    walk(root)
    return out.replace(/\s+/g, ' ').trim()
  }

  const smallTargets = []
  for (const el of document.querySelectorAll('a[href], button, [role="button"], input, select')) {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    if (el.classList.contains('skip-link')) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue
    if (r.width < 43.5 || r.height < 43.5) {
      smallTargets.push(`${el.tagName.toLowerCase()}.${el.className || '?'} ${Math.round(r.width)}x${Math.round(r.height)}`)
    }
  }

  const bgAssets = []
  for (const el of document.querySelectorAll('*')) {
    const bg = getComputedStyle(el).backgroundImage
    if (bg && bg.includes('/a/')) bgAssets.push(bg.slice(0, 60))
  }

  const h1s = [...document.querySelectorAll('h1')]

  return {
    text: visibleText(document.body),
    heroText: h1s.map((h) => h.textContent?.trim() ?? ''),
    h1Count: h1s.length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    bodyOverflow: document.body.scrollWidth - document.documentElement.clientWidth,
    hasSkip: !!document.querySelector('a.skip-link'),
    skipTarget: (() => {
      const s = document.querySelector('a.skip-link')
      if (!s) return false
      const href = s.getAttribute('href') ?? ''
      return href.startsWith('#') && !!document.querySelector(href)
    })(),
    hasHome: !!document.querySelector('a.homebar[href="/"]'),
    hasMain: !!document.querySelector('main'),
    imgAssets: [...document.querySelectorAll('img')].map((i) => i.getAttribute('src') ?? '').filter((s) => s.includes('/a/')),
    imgNoAlt: [...document.querySelectorAll('img')].filter((i) => i.getAttribute('alt') === null).length,
    videoAssets: [...document.querySelectorAll('video')].map((v) => v.getAttribute('src') ?? v.querySelector('source')?.getAttribute('src') ?? ''),
    bgAssets: bgAssets.slice(0, 5),
    canvases: document.querySelectorAll('canvas').length,
    smallTargets,
  }
}

const words = (s) => s.split(/\s+/).filter((t) => /[a-z0-9]/i.test(t))

const browser = await chromium.launch()
let failures = 0
const rows = []

for (const route of ROUTES) {
  const problems = []
  const notes = []

  const page = await browser.newPage({ viewport: { width: 375, height: 812 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 140)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)) })

  await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  const m = await page.evaluate(collect)

  // Phone: the hard one.
  if (m.overflow > 1) problems.push(`horizontal overflow at 375px (+${m.overflow}px)`)

  // Desktop pass, mainly for overflow and target sizes at the other end.
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.waitForTimeout(700)
  const d = await page.evaluate(collect)
  if (d.overflow > 1) problems.push(`horizontal overflow at 1280px (+${d.overflow}px)`)

  // Copy budget: measured on the phone, where every word has to earn its place.
  const all = words(m.text)
  if (all.length > MAX_PAGE_WORDS) problems.push(`${all.length} words on the page, limit ${MAX_PAGE_WORDS}`)

  if (m.h1Count !== 1) problems.push(`${m.h1Count} h1 elements, need exactly 1`)
  for (const hero of m.heroText) {
    const hw = words(hero)
    if (hw.length > MAX_HERO_WORDS) problems.push(`hero is ${hw.length} words: "${hero}"`)
  }

  const lower = ' ' + m.text.toLowerCase() + ' '
  for (const b of BANNED) {
    const re = b.includes(' ') ? new RegExp(b.replace(/\s+/g, '\\s+'), 'i') : new RegExp(`\\b${b}\\w*\\b`, 'i')
    if (re.test(lower)) problems.push(`banned word: "${b}"`)
  }
  if (/[—]/.test(m.text)) problems.push('em dash in visible copy')
  if (/not just .{1,40}?,? (it'?s|but)/i.test(m.text)) problems.push('"not just X, it\'s Y" construction')

  if (!m.hasSkip) problems.push('no .skip-link')
  else if (!m.skipTarget) problems.push('.skip-link points at a missing target')
  if (!m.hasHome) problems.push('no a.homebar[href="/"] back to the index')
  if (!m.hasMain) problems.push('no <main>')
  if (m.imgNoAlt > 0) problems.push(`${m.imgNoAlt} <img> without an alt attribute`)

  const usesImage = m.imgAssets.length > 0 || m.bgAssets.length > 0 || m.canvases > 0
  const usesVideo = m.videoAssets.some((s) => s.includes('/a/'))
  if (!usesImage) problems.push('no generated image on the page')
  if (!usesVideo) problems.push('no generated video on the page')

  const small = [...new Set([...m.smallTargets, ...d.smallTargets])]
  if (small.length) problems.push(`touch targets under 44px: ${small.slice(0, 4).join(', ')}`)

  if (!/fogg/i.test(m.text)) problems.push('the Fogg lever is not named in visible copy')

  if (errors.length) notes.push(`console: ${[...new Set(errors)].slice(0, 2).join(' | ')}`)

  await page.close()

  rows.push({ route, words: all.length, hero: words(m.heroText[0] ?? '').length, problems, notes })
  if (problems.length) failures++
}

await browser.close()

for (const r of rows) {
  const head = `/${r.route.padEnd(2)}  ${String(r.words).padStart(3)}w  hero ${r.hero}w`
  if (r.problems.length) {
    console.log(`FAIL ${head}`)
    for (const p of r.problems) console.log(`       - ${p}`)
  } else {
    console.log(`pass ${head}`)
  }
  for (const n of r.notes) console.log(`       ~ ${n}`)
}

console.log(failures ? `\n${failures} route(s) failing` : `\nall ${rows.length} route(s) pass`)
process.exit(failures ? 1 : 0)
