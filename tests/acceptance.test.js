import { test, expect, describe, beforeAll, afterAll, it } from 'vitest'
import { main as getOffices } from '../index.js'
import puppeteer from 'puppeteer'

let browser, page

describe('ONLYOFFICE', () => {
	beforeAll(async () => {
		const url = 'https://www.onlyoffice.com/'

		browser = await puppeteer.launch({
			browser: 'firefox',
			headless: 'new',
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
		})

		page = await browser.newPage()

		await page.goto(url)
		await page.setViewport({ width: 1920, height: 1080 })
	})

	afterAll(async () => {
		await browser.close()
	})

	it('Главная страница', async () => {
		const title = await page.title()
		expect(title).toMatch(/ONLYOFFICE/)
	})

	it('Переход в Contacts', async () => {
		await page.locator('#navitem_about').hover()

		await Promise.all([
			page.waitForNavigation(),
			page.click('a#navitem_about_contacts')
		])

		const title = await page.title()
		expect(title).toMatch(/Contacts/)
	})

	it('Имеются офисы', async () => {
		const offices = await page.$$('[itemprop~="addressLocality"]')
		expect(offices.length).toBeGreaterThan(0)
	})
})

test('main > Количество адресов должно быть больше 0 и все они должны содержать непустые поля country, companyName, fullAddress', async () => {
	const url = 'https://www.onlyoffice.com/'
	const addresses = await getOffices(url, 'offices.csv')
	expect(addresses.length).toBeGreaterThan(0)
	for (const address of addresses) {
		expect(address.country).toBeTruthy()
		expect(address.companyName).toBeTruthy()
		expect(address.fullAddress).toBeTruthy()
	}
}, 30000)
