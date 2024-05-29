import { NumberUtils } from '../src/';

describe('NumberUtils', () => {
	it('deg2Rad should convert degrees to radians', () => {
		expect(NumberUtils.deg2Rad(0)).toBe(0);
		expect(NumberUtils.deg2Rad(180)).toBeCloseTo(Math.PI);
		expect(NumberUtils.deg2Rad(360)).toBeCloseTo(2 * Math.PI);
	});

	it('rad2Deg should convert radians to degrees', () => {
		expect(NumberUtils.rad2Deg(0)).toBe(0);
		expect(NumberUtils.rad2Deg(Math.PI)).toBe(180);
		expect(NumberUtils.rad2Deg(2 * Math.PI)).toBe(360);
	});

	it('dollarsToCents should convert dollars to cents', () => {
		expect(NumberUtils.dollarsToCents(1.0)).toBe(100);
		expect(NumberUtils.dollarsToCents(0.99)).toBe(99);
		expect(NumberUtils.dollarsToCents(0.01)).toBe(1);
	});

	it('centsToDollars should convert cents to dollars', () => {
		expect(NumberUtils.centsToDollars(100)).toBe(1.0);
		expect(NumberUtils.centsToDollars(99)).toBe(0.99);
		expect(NumberUtils.centsToDollars(1)).toBe(0.01);
	});

	it('round should round a number to the nearest significance', () => {
		expect(NumberUtils.round(123, 5)).toBe(125);
		expect(NumberUtils.round(123, 10)).toBe(120);
		expect(NumberUtils.round(0, 10)).toBe(0);
		expect(NumberUtils.round(-123, 5)).toBe(-125);
		expect(NumberUtils.round(-123, 10)).toBe(-120);
	});

	it('randomNumberInRange should return a random number in the given range', () => {
		const maxLimit = 10;
		for (let i = 0; i < 100; i++) {
			const randomNum = NumberUtils.randomNumberInRange(maxLimit);
			expect(randomNum).toBeGreaterThanOrEqual(0);
			expect(randomNum).toBeLessThan(maxLimit);
		}
	});

	it('randomInclusiveInRange should return a random number in the inclusive range', () => {
		const min = 1;
		const max = 10;
		for (let i = 0; i < 100; i++) {
			const randomNum = NumberUtils.randomInclusiveInRange(min, max);
			expect(randomNum).toBeGreaterThanOrEqual(min);
			expect(randomNum).toBeLessThanOrEqual(max);
		}
	});
});
