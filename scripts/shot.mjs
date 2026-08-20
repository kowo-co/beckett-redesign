/**
 * Capture a route so you can actually look at it.
 *   node scripts/shot.mjs 3 .beckett/tmp/3.png            # 1280x900, full page
 *   node scripts/shot.mjs 3 .beckett/tmp/3-phone.png 375  # phone width
 * Reads BASE_URL, default http://127.0.0.1:4321.
 */
import { chromium } from 'playwright'

const [route, out, width] = process.argv.slice(2)
if (!route || !out) {
  console.error('usage: node scripts/shot.mjs <route> <outfile.png> [width]')
  process.exit(2)
}

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321'
const w = Number(width ?? 1280)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: w, height: w < 500 ? 812 : 900 }, deviceScaleFactor: 1 })
await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1800)
await page.screenshot({ path: out, fullPage: process.env.FULL !== '0' })
console.log(`wrote ${out}`)
await browser.close()
