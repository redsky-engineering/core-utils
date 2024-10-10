import { NumberUtils } from '../src/';
import {expect} from 'chai';

describe('NumberUtils', () => {
	it('deg2Rad should convert degrees to radians', () => {
		expect(NumberUtils.deg2Rad(0)).to.equal(0);
		expect(NumberUtils.deg2Rad(180)).to.be.closeTo(Math.PI, 0.001);
		expect(NumberUtils.deg2Rad(360)).to.be.closeTo(2 * Math.PI,0.001);
	});

	it('rad2Deg should convert radians to degrees', () => {
		expect(NumberUtils.rad2Deg(0)).to.equal(0);
		expect(NumberUtils.rad2Deg(Math.PI)).to.equal(180);
		expect(NumberUtils.rad2Deg(2 * Math.PI)).to.equal(360);
	});

	it('dollarsToCents should convert dollars to cents', () => {
		expect(NumberUtils.dollarsToCents(1.0)).to.equal(100);
		expect(NumberUtils.dollarsToCents(0.99)).to.equal(99);
		expect(NumberUtils.dollarsToCents(0.01)).to.equal(1);
	});

	it('centsToDollars should convert cents to dollars', () => {
		expect(NumberUtils.centsToDollars(100)).to.equal(1.0);
		expect(NumberUtils.centsToDollars(99)).to.equal(0.99);
		expect(NumberUtils.centsToDollars(1)).to.equal(0.01);
	});

	it('round should round a number to the nearest significance', () => {
		expect(NumberUtils.round(123, 5)).to.equal(125);
		expect(NumberUtils.round(123, 10)).to.equal(120);
		expect(NumberUtils.round(0, 10)).to.equal(0);
		expect(NumberUtils.round(-123, 5)).to.equal(-125);
		expect(NumberUtils.round(-123, 10)).to.equal(-120);
	});

	it('randomNumberInRange should return a random number in the given range', () => {
		const maxLimit = 10;
		for (let i = 0; i < 100; i++) {
			const randomNum = NumberUtils.randomNumberInRange(maxLimit);
			expect(randomNum).to.be.gte(0);
			expect(randomNum).to.be.lt(maxLimit);
		}
	});

	it('randomInclusiveInRange should return a random number in the inclusive range', () => {
		const min = 1;
		const max = 10;
		for (let i = 0; i < 100; i++) {
			const randomNum = NumberUtils.randomInclusiveInRange(min, max);
			expect(randomNum).to.be.gte(min);
			expect(randomNum).to.be.lte(max);
		}
	});
});
