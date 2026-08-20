import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321'
const routes = ['picker', '1', '2', '3', '4', '5']

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

for (const route of routes) {
  await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(route === '4' ? 500 : 1000)
  await page.screenshot({
    path: `screenshots/${route}.png`,
    fullPage: true,
  })
  console.log(`Captured ${route}`)
}

await browser.close()
