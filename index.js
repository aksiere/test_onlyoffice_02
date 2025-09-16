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

const offices = await page.$$('[itemprop~="addressLocality"]')
for (const office of offices) {
	const parent = await office.evaluateHandle(el => el.parentNode)
	const [ country, companyName, ...rest ] = await parent.$$eval('span', elements =>
		elements.map(e => e.textContent),
	)

	console.log({
		country: country.trim().replace(/\s+/g, ' '),
		companyName: companyName.trim().replace(/\s+/g, ' '),
		fullAddress: rest.map(r => r.trim().replace(/\s+/g, ' ')).join(', ')
	})
}

// await page.screenshot({
// 	path: 'hn.png',
// })

await browser.close()