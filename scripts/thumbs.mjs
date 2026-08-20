/**
 * Capture the gallery thumbnails into public/thumbs/N.jpg.
 * Above the fold only, 1280x853, so the index reads as ten posters.
 *   BASE_URL=http://127.0.0.1:4400 node scripts/thumbs.mjs
 */
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321'
mkdirSync('public/thumbs', { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 853 }, deviceScaleFactor: 1 })

for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  await page.goto(`${base}/${n}`, { waitUntil: 'networkidle' })
  // Let shaders warm up, videos reach a frame, and flap boards settle.
  await page.waitForTimeout(3200)
  // The index link is furniture, not part of the poster.
  await page.addStyleTag({ content: '.homebar { display: none !important }' })
  await page.screenshot({ path: `public/thumbs/${n}.jpg`, type: 'jpeg', quality: 72, fullPage: false })
  console.log(`thumbs/${n}.jpg`)
}

await browser.close()
