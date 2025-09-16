import puppeteer from 'puppeteer'
import { writeFileSync } from 'fs'

async function main(outputFileName) {
	const browser = await puppeteer.launch({ browser: 'firefox' })
	const page = await browser.newPage()

	await page.goto('https://www.onlyoffice.com/')
	await page.setViewport({ width: 1920, height: 1080 })

	await page.locator('#navitem_about').hover()

	await Promise.all([
		page.waitForNavigation(),
		page.click('a#navitem_about_contacts')
	])

	let result = []

	const offices = await page.$$('[itemprop~="addressLocality"]')
	for (const office of offices) {
		const parent = await office.evaluateHandle(el => el.parentNode)
		const [ country, companyName, ...rest ] = await parent.$$eval('span', elements =>
			elements.map(e => e.textContent),
		)

		let country_ = country.trim().replace(/\s+/g, ' ')
		let companyName_ = companyName.trim().replace(/\s+/g, ' ')
		let fullAddress_ = rest.map(r => r.trim().replace(/\s+/g, ' ')).join(', ')

		result.push({
			country: country_,
			companyName: companyName_,
			fullAddress: fullAddress_
		})
	}

	await browser.close()

	writeFileSync(outputFileName, 'Country,CompanyName,FullAddress\n' + result.map(r => `"${r.country}","${r.companyName}","${r.fullAddress}"`).join('\n'))
	
	return result
}

const offices = await main('offices.csv')
console.log(offices)
