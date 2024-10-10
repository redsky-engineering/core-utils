import { DateUtils } from '../src/index.js';
import {expect} from 'chai';

describe('DateUtils', () => {
	it('daysBetweenStartAndEndDates should return the number of days between two dates', () => {
		const startDate = new Date('2023-01-01');
		const endDate = new Date('2023-01-05');
		expect(DateUtils.daysBetweenStartAndEndDates(startDate, endDate)).to.equal(4);
	});

	it.skip('formatDateForUser should format date to MM-DD-YYYY', () => {
		const date = new Date('2023-01-01');
		expect(DateUtils.formatDateForUser(date)).to.equal('1-1-2023');
		expect(DateUtils.formatDateForUser('N/A')).to.equal('N/A');
	});

	it('getDateDifferenceFriendly should return a friendly string of the difference between two dates', () => {
		const startDate = new Date('2023-01-01T00:00:00');
		const endDate = new Date('2023-01-02T01:01:01');
		expect(DateUtils.getDateDifferenceFriendly(endDate, startDate)).to.equal('1 day');
	});

	it.skip('getMonthName should return the month name for a date object', () => {
		const date = new Date('2023-01-01');
		expect(DateUtils.getMonthName(date)).to.equal('January');
		expect(DateUtils.getMonthName(date, 'short')).to.equal('Jan');
	});

	it('displayFriendlyDateTime should return a friendly date time string', () => {
		const date = new Date();
		expect(DateUtils.displayFriendlyDateTime(date)).to.contain('Today at');
		const yesterday = new Date(date);
		yesterday.setDate(date.getDate() - 1);
		expect(DateUtils.displayFriendlyDateTime(yesterday)).to.contain('Yesterday at');
	});

	it.skip('displayFriendlyDate should return a friendly date string', () => {
		const date = new Date('2023-01-01');
		expect(DateUtils.displayFriendlyDate(date)).to.equal('Jan 1 2023');
	});

	it('dbNow should return a MySQL compliant datetime string for now', () => {
		const now = new Date();
		const dbNow = DateUtils.dbNow();
		expect(dbNow).to.equal(DateUtils.jsDateToDbDateTime(now));
	});

	it('dbHoursFromNow should return a MySQL compliant datetime string for a given hour offset', () => {
		const hours = 1;
		const now = new Date();
		now.setHours(now.getHours() + hours);
		expect(DateUtils.dbHoursFromNow(hours)).to.equal(DateUtils.jsDateToDbDateTime(now));
	});

	it('dbMinutesFromNow should return a MySQL compliant datetime string for a given minute offset', () => {
		const minutes = 30;
		const now = new Date();
		now.setMinutes(now.getMinutes() + minutes);
		expect(DateUtils.dbMinutesFromNow(minutes)).to.equal(DateUtils.jsDateToDbDateTime(now));
	});

	it('daysInMonth should return the number of days in the given month and year', () => {
		expect(DateUtils.daysInMonth(2, 2023)).to.equal(28);
		expect(DateUtils.daysInMonth(2, 2024)).to.equal(29);
	});

	it('padStart should pad a value with a leading zero', () => {
		expect(DateUtils.padStart('1')).to.equal('01');
		expect(DateUtils.padStart('12')).to.equal('12');
	});

	it.skip('addDays should return a date object with a new range of days', () => {
		const date = new Date('2023-01-01');
		const newDate = DateUtils.addDays(date, 5);
		expect(newDate.getDate()).to.equal(6);
	});

	it('addSeconds should add a number of seconds to a date', () => {
		const date = new Date('2023-01-01T00:00:00');
		const newDate = DateUtils.addSeconds(date, 60);
		expect(newDate.getSeconds()).to.equal(0); // wrap around to 0 for 60 seconds
		expect(newDate.getMinutes()).to.equal(1); // increment minutes
	});

	it.skip('getDateRange should get a range of dates inclusive between a start and end date', () => {
		const startDate = new Date('2023-01-01');
		const endDate = new Date('2023-01-03');
		expect(DateUtils.getDateRange(startDate, endDate)).toEqual(['*2023-01-01', '*2023-01-02', '*2023-01-03']);
	});

	it('displayTime should display time of input date time', () => {
		const date = new Date('2023-01-01T13:45:00');
		expect(DateUtils.displayTime(date)).to.equal('1:45 pm');
	});

	it.skip('displayDate should display date of input date time as mm/dd/yyyy', () => {
		const date = new Date('2023-01-01');
		expect(DateUtils.displayDate(date)).to.equal('1/1/2023');
	});

	it.skip('displayDayOfWeek should display day of the week of the input date', () => {
		const date = new Date('2023-01-01');
		expect(DateUtils.displayDayOfWeek(date)).to.equal('Sunday');
	});

	it('isSameWeekAsCurrent should check if input date is the same week as current date', () => {
		const date = new Date();
		expect(DateUtils.isSameWeekAsCurrent(date)).to.equal(true);
		const lastWeek = new Date(date);
		lastWeek.setDate(date.getDate() - 7);
		expect(DateUtils.isSameWeekAsCurrent(lastWeek)).to.equal(false);
	});

	it('isSameDayAsCurrent should check if input date is the same day as current date', () => {
		const date = new Date();
		expect(DateUtils.isSameDayAsCurrent(date)).to.equal(true);
		const yesterday = new Date(date);
		yesterday.setDate(date.getDate() - 1);
		expect(DateUtils.isSameDayAsCurrent(yesterday)).to.equal(false);
	});

	it('isYesterday should check if input date is yesterday', () => {
		const date = new Date();
		const yesterday = new Date(date);
		yesterday.setDate(date.getDate() - 1);
		expect(DateUtils.isYesterday(yesterday)).to.equal(true);
		expect(DateUtils.isYesterday(date)).to.equal(false);
	});

	it.skip('jsDateToDbDateTime should convert a javascript Date object to a MySQL compatible datetime string', () => {
		const date = new Date('2023-01-01T13:45:00');
		expect(DateUtils.jsDateToDbDateTime(date)).to.equal('2023-01-01 13:45:00');
	});

	it('jsDateToDbDate should convert a javascript Date object to a MySQL compatible date string', () => {
		const date = new Date('2023-01-01');
		expect(DateUtils.jsDateToDbDate(date)).to.equal('2023-01-01');
	});

	it.skip('dbDateToJsDate should convert a MySQL compatible date column string to a javascript Date object', () => {
		const dateStr = '2023-01-01';
		const date = DateUtils.dbDateToJsDate(dateStr);
		expect(date).to.equal(new Date('2023-01-01'));
	});

	it('dbDateTimeToJsDate should convert a MySQL compatible datetime column string to a javascript Date object', () => {
		const dateStr = '2023-01-01 13:45:00';
		const date = DateUtils.dbDateTimeToJsDate(dateStr);
		expect(date.toISOString()).to.equal(new Date('2023-01-01T13:45:00Z').toISOString());
	});

	it('dateFromString should convert a date string to a date object', () => {
		const dateStr = '2023-01-01 13:45:00';
		const date = DateUtils.dateFromString(dateStr);
		expect(date.toISOString()).to.equal(new Date('2023-01-01T13:45:00').toISOString());
	});

	it('isJsDate should check if input date is a JS date object', () => {
		const date = new Date();
		expect(DateUtils.isJsDate(date)).to.equal(true);
		expect(DateUtils.isJsDate('2023-01-01')).to.equal(false);
	});
});
