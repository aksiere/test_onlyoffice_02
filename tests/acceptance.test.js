import { test, expect, describe, beforeAll, afterAll, it } from 'vitest'
import { main as getOffices } from '../index.js'
import puppeteer from 'puppeteer'

// test('Количество адресов должно быть больше 0', async () => {
// 	const url = 'https://www.onlyoffice.com/'
// 	const addresses = await getOffices(url, 'offices.csv')
// 	expect(addresses.length).toBeGreaterThan(0)
// }, 30000)

let browser, page

describe('Страница открывается', () => {
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

	it('Главная страница работает и возвращает тайтл', async () => {
		const title = await page.title()
		expect(title).toMatch(/ONLYOFFICE/)
	})
})
