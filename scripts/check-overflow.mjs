import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321'
const routes = ['picker', '1', '2', '3', '4', '5']

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 375, height: 812 } })

for (const route of routes) {
  await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth
  })
  console.log(`${route}: horizontal overflow = ${overflow}`)
}

await browser.close()
