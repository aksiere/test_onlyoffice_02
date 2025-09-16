import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
	browser: 'firefox'
})
const page = await browser.newPage()

await page.goto('https://www.onlyoffice.com/')
await page.setViewport({ width: 1920, height: 1080 })

await page.locator('#navitem_about').hover()

await Promise.all([
	page.waitForNavigation(),
	page.click('a#navitem_about_contacts'),
])

const contents = await page.$$('[itemprop="addressLocality"]')
for (const content of contents) {
	const country = await content.evaluate(el => el.textContent)
	console.log(country.trim())
}

// await page.screenshot({
// 	path: 'hn.png',
// })

await browser.close()