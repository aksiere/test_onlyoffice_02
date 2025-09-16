import { test, expect } from 'vitest'
import { main as getOffices } from '../index.js'

test('result.length > 0', async () => {
	const url = 'https://www.onlyoffice.com/'
	const addresses = await getOffices(url, 'offices.csv')
	expect(addresses.length).toBeGreaterThan(0)
}, 30000)
