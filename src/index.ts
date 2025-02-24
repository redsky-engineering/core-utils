// Todo: fix all the any's and remove this line
/* eslint-disable  @typescript-eslint/no-explicit-any */
import cloneDeep from 'lodash.clonedeep';

declare global {
	interface Date {
		getWeekOfMonth(): number;
	}
}

interface RsResponseData<T> {
	data: T;
}

Date.prototype.getWeekOfMonth = function () {
	const firstWeekday = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
	const offsetDate = this.getDate() + firstWeekday - 1;
	return Math.floor(offsetDate / 7);
};
export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** String related utilities */
export class StringUtils {
	/**
	 * Returns a string that was originally a camel case string converted to a human-readable string with spaces
	 * @param inputString - camel case string to convert (e.x. camelCase)
	 * @returns {string} - Human readable string (e.x. Camel Case)
	 */
	static convertCamelCaseToHuman(inputString: string): string {
		let result = '';
		let isPrevCharUpperCase = false;
		let isNextCharUpperCase = false;

		for (let i = 0; i < inputString.length; i++) {
			const char = inputString[i];
			isNextCharUpperCase = i + 1 < inputString.length && inputString[i + 1] === inputString[i + 1].toUpperCase();
			if (char === char.toUpperCase() && (!isPrevCharUpperCase || !isNextCharUpperCase)) {
				result += ' ' + char;
			} else {
				result += char;
			}
			isPrevCharUpperCase = char === char.toUpperCase();
		}

		if (result.length > 0) {
			result = result[0].toUpperCase() + result.slice(1);
		}

		return result;
	}

	/**
	 * Returns a two character initial from a string of a users full name
	 * @param name - full name of user (e.x. John Doe)
	 * @returns {string} - two character initial (e.x. JD)
	 */
	static getInitialsFromName(name: string): string {
		if (!name) return '';
		const initials = name.match(/\b\w/g) || [];
		return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
	}

	/**
	 * Returns a string that was originally a UPPERCASE_STRING converted to a human-readable
	 * @param enumValue - enum upper case string to convert (e.x. UPPERCASE_STRING)
	 * @returns {string} - human-readable string (e.x. Uppercase String)
	 */
	static convertEnumToHuman(enumValue: string): string {
		const humanValueArray = enumValue.split('_');
		humanValueArray.forEach((value, index) => {
			humanValueArray[index] = this.capitalizeFirst(value.toLowerCase());
		});
		return humanValueArray.join(' ');
	}

	/**
	 * Convert 24-hour time format to am/pm time format
	 * @param {string | number} time
	 * @returns {string} - Returns a string
	 */
	static convertTwentyFourHourTime(time: string | number): string {
		if (!time) return '';

		let sanitizedTime: number = parseInt(time.toString().replace(/\D+/g, ''));
		if (sanitizedTime > 1259) {
			sanitizedTime = sanitizedTime - 1200;
			if (sanitizedTime.toString().length === 3) {
				const minutes = sanitizedTime.toString().slice(-2);
				const hour = sanitizedTime.toString().slice(0, 1);
				return `${hour}:${minutes} PM`;
			} else if (sanitizedTime.toString().length === 4) {
				const minutes = sanitizedTime.toString().slice(-2);
				const hours = sanitizedTime.toString().slice(0, 2);
				return `${hours}:${minutes} PM`;
			} else {
				return '';
			}
		}
		if (sanitizedTime.toString().length < 3) {
			let minute = sanitizedTime.toString();
			if (minute.length === 1) minute = '0' + minute;
			const hour = '12';
			return `${hour}:${minute} AM`;
		} else if (sanitizedTime.toString().length === 3) {
			const minutes = sanitizedTime.toString().slice(-2);
			const hour = sanitizedTime.toString().slice(0, 1);
			return `${hour}:${minutes} AM`;
		} else if (sanitizedTime.toString().length === 4) {
			const minutes = sanitizedTime.toString().slice(-2);
			const hours = sanitizedTime.toString().slice(0, 2);
			return `${hours}:${minutes} ${hours === '12' ? 'PM' : 'AM'}`;
		} else {
			return '';
		}
	}

	/**
	 * Converts 12 hour string to a 24-hour format
	 * @param time12 12-hour time format
	 * @returns string in 24-hour format
	 */
	static convertFrom12To24Format(time12: string): string {
		const time = time12.match(/([0-9]{1,2}):([0-9]{2})(am|pm)/)?.slice(1);
		if (time) {
			const PM = time[2] === 'pm';
			const hours = (+time[0] % 12) + (PM ? 12 : 0);

			return `${('0' + hours).slice(-2)}:${time[1]}`;
		}
		return time12;
	}

	/**
	 * Converts seconds to Hour Min format
	 * @param sec number of seconds
	 * @returns string 00 hr 00 min
	 */
	static convertFromSecToHrMinFormat(sec: number): string {
		const min = sec / 60;
		const hours = Math.floor(min / 60);
		const minutes = Math.round(min % 60);
		return `${hours} hr ${minutes} min`;
	}

	/**
	 * Converts min to Hour Min format
	 * @param min number of minute
	 * @returns string 00 hr 00 min
	 */
	static convertFromMinToHrMinFormat(min: number): string {
		const hours = Math.floor(min / 60);
		const minutes = min % 60;
		return `${hours} hr ${minutes} min`;
	}
	/**
	 * Converts seconds to an array in the format [Hour: string, Minute: string].
	 **/
	static convertFromSecToHrMinArray(sec: number): [string, string] {
		sec = Math.max(sec, 0);
		const min = sec / 60;
		const hours = Math.floor(min / 60);
		const minutes = Math.floor(min % 60);
		return [hours.toString(), minutes.toString()];
	}

	/**
	 * Validates if an email's syntax is correct
	 * @param email {string} - email to validate
	 * @returns {boolean} - true or false
	 */
	static validateEmail(email: string): boolean {
		const tester =
			/^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

		if (!email) return false;

		const emailParts = email.split('@');

		if (emailParts.length !== 2) return false;

		const account = emailParts[0];
		const address = emailParts[1];

		if (account.length > 64) return false;
		else if (address.length > 255) return false;

		const domainParts = address.split('.');
		if (
			domainParts.some(function (part) {
				return part.length > 63;
			})
		)
			return false;

		return tester.test(email);
	}

	/**
	 * Returns a 'clean' string with no carriage return, tab or new line and removes all additional spaces
	 * @name removeLineEndings
	 * @param {string} value - The string to clean
	 * @returns {string} - Returns the cleaned version of the string
	 */
	static removeLineEndings(value: string): string {
		if (!value) return '';
		const newValue = value
			.replace(/\r?\n|\t|\r/g, ' ') // remove carriage return, new line, and tab
			.match(/[^ ]+/g); // remove extra spaces
		if (newValue) return newValue.join(' ');
		// return to single spaces
		else return '';
	}

	/**
	 * Capitalizes the first letter
	 * @name capitalizeFirst
	 * @param {string} value
	 * @returns {string}
	 */
	static capitalizeFirst(value: string): string {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}

	/**
	 * Converts a semVer string such as 1.2.3 to a number 1 * 1000 * 1000 + 2 * 1000 + 3 = 1_002_003
	 * @param versionString a semVer string not including tag or build
	 * @return a number converted from string
	 * @private
	 */
	static semVerToNumber(versionString: string): number {
		const versionSplit = versionString.split('.');
		let versionValue = 0;
		let versionMultiplier = 1;
		for (let i = versionSplit.length - 1; i >= 0; i--) {
			versionValue = versionValue + parseInt(versionSplit[i]) * versionMultiplier;
			versionMultiplier *= 1000;
		}
		return versionValue;
	}

	/**
	 * Check if input string is a valid URL.
	 * @name isValidUrl
	 * @param {string} test
	 * @returns {boolean} returns true or false
	 * @example
	 * isValidUrl("https://www.google.com") true
	 * isValidUrl("I am an invalid URL string.") false
	 */
	static isValidUrl(test: string): boolean {
		try {
			new URL(test);
			return true;
		} catch (_e) {
			return false;
		}
	}

	/**
	 * Convert an integer to base36 string
	 * @name intToBase36
	 * @param {number} int
	 * @returns {string}
	 * @example
	 * const resilt = intToBase36(10);
	 */
	static intToBase36(int: number): string {
		return int.toString(36).padStart(8, '0').toUpperCase();
	}

	/**
	 * Check if it is an empty string
	 * @name isEmpty
	 * @param {string} value
	 * @returns {boolean}
	 */
	static isEmpty(value: string): boolean {
		if (value === null) return true;
		if (value === undefined) return true;
		if (value === '') return true;
		return false;
	}

	/**
	 * Format string to price range string
	 * @name formatPriceRange
	 * @param {string} input
	 * @returns {string}
	 */
	static formatPriceRange(input: string): string {
		if (!input) return '-';
		const start = parseInt(input.split('-')[0]) / 100 || '';
		const end = parseInt(input.split('-')[1]) / 100 || '';
		if (!start && end) return `$${end}`;
		if (!end && start) return `$${start}`;
		if (start === end) return `$${start}`;
		return `$${start}-$${end}`;
	}

	/**
	 * Checks to see if the regex express passes on the given value
	 * @name testRegex
	 * @param {RegExp} regex - The regular expression to run on the value
	 * @param {string} value - A string value to check with the regular express
	 * @returns {boolean} - Returns true if the matching pattern was found
	 */
	static testRegex(regex: RegExp, value: string): boolean {
		regex = new RegExp(regex);
		return regex.test(value);
	}

	/**
	 * Generate a unique GUID. It is a compatibility function for crypto.randomUUID() as not all browsers support it.
	 * @name generateGuid
	 * @returns {string} - Returns a string unique GUID
	 * */
	static generateGuid(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0,
				v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	/**
	 * Converts snake case into regular text that is upper cased
	 * @param {string} snakeCase
	 * @returns {string}
	 */
	static snakeCaseToHuman(snakeCase: string): string {
		if (snakeCase.constructor !== String || snakeCase === '') return '';
		const humanize = snakeCase.split('_');
		for (let i = 0; i < humanize.length; i++) {
			humanize[i] = humanize[i][0].toUpperCase() + humanize[i].substr(1);
		}
		return humanize.join(' ');
	}

	/**
	 * Adds commas to a string number or regular number
	 * @param {string || number} intNum
	 * @returns {string}
	 */
	static addCommasToNumber(num: number): string {
		if (isNaN(num)) return num.toString();
		const [integerPart, decimalPart] = num.toString().split('.');
		const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
	}

	/**
	 * Removes HTML Tags from string
	 * @param {string} html
	 * @returns {string}
	 */
	static removeHtmlTags(html: string): string {
		if (!html) return '';
		return html.replace(/(<([^>]+)>)/gi, '');
	}

	/**
	 * Removes Incorrect String Values (Emojis) from string
	 * @param {string} string
	 * @returns {string}
	 */
	static removeIncorrectStringValues(string: string): string {
		if (!string) return '';
		return string.replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '');
	}

	/**
	 * Formats a phone number from a string or a numerical string
	 * @param phone Example "8013615555
	 * @returns string Formatted number Ex (801) 361-5555
	 */
	static formatPhoneNumber(phone: string | number): string {
		const cleaned = ('' + phone).replace(/\D/g, '');
		const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

		if (match) {
			return `(${match[1]}) ${match[2]}-${match[3]}`;
		} else {
			return cleaned;
		}
	}

	/**
	 * Returns all characters from a string that is not a number
	 * @param string - String with mix numbers, characters
	 * @returns string with only numbers
	 */
	static removeAllExceptNumbers(string: string): string {
		if (!string) return '';
		return string.replace(/\D+/g, '');
	}

	/**
	 * Prefixes 0 to the front of a double digit like Month
	 * @param text string to be prefixed
	 * @returns string with zero prefixes
	 */
	static doubleDigit(text: string): string {
		if (text.length === 1) return '0' + text;
		if (text.length === 0) return '00';
		return text;
	}

	/**
	 * Returns a human readable by byte count, such as 1024 bytes = 1 KB
	 * @param bytes {number} - Number of bytes
	 * @param digits {number} - How many fractional digits to include
	 * @returns {string} - Human readable string value
	 */
	static getHumanReadableByteValue(bytes: number, digits: number = 1): string {
		if (bytes < 1024) return `${bytes} B`;
		const kiloBytes = bytes / 1024;
		if (kiloBytes < 1024) return `${kiloBytes.toFixed(digits)} KB`;
		const megaBytes = kiloBytes / 1024;
		if (megaBytes < 1024) return `${megaBytes.toFixed(digits)} MB`;
		const gigaBytes = megaBytes / 1024;
		return `${gigaBytes.toFixed(digits)} GB`;
	}

	/**
	 * Converts the incoming snake or kebab case string to Pascal Case
	 * @param inputString
	 * @returns {string} - Pascal Case string
	 */
	static toPascalCasing(inputString: string): string {
		const regex = /[_-](\w)/g; // Match underscore or hyphen followed by a word character
		const convert = function (_: string, group1: string) {
			return group1.toUpperCase();
		};
		const result = inputString.replace(regex, convert);
		return StringUtils.capitalizeFirst(result);
	}
}

/** Number related utilities */
export class NumberUtils {
	/**
	 * Convert Degrees to Radians
	 * @param degrees: number
	 * @return number
	 */
	static deg2Rad(degrees: number): number {
		return (degrees * Math.PI) / 180;
	}

	/**
	 * Convert Radians to degrees
	 * @param radians: number
	 * @return number
	 */
	static rad2Deg(radians: number): number {
		return (radians * 180) / Math.PI;
	}

	/**
	 * @name dollarsToCents
	 * @param {dollars} The floating point dollar value
	 * @returns {number} The integer number of cents
	 */
	static dollarsToCents(dollars: number): number {
		return parseInt((dollars * 100).toFixed(0));
	}

	/**
	 * centsToDollars
	 * @param {number} cents - cent dollar value
	 * @returns {number} floating point dollar value
	 */
	static centsToDollars(cents: number): number {
		return parseFloat((cents / 100).toFixed(2));
	}

	/**
	 * round - Rounds a number to significance
	 * @param {number} num
	 * @param {number} significance
	 * @returns {number} number moved to relative significance
	 */
	static round(num: number, significance: number): number {
		if (num === 0) return 0;
		const sign = Math.sign(num);
		num = Math.abs(num);
		significance = Math.abs(significance);
		const halfSignificance = significance / 2;
		const remainder = num % significance;
		if (remainder >= halfSignificance) {
			return sign * (num - remainder + significance);
		} else {
			return sign * (num - remainder);
		}
	}

	/**
	 * Returns a random number within the range of 0 and your input value
	 * @param {number} value - Max range input (not inclusive)
	 * @returns {number} a random number between 0 and your max input value (not inclusive)
	 */
	static randomNumberInRange(maxLimit: number): number {
		return Math.floor(Math.random() * Math.floor(maxLimit));
	}

	/**
	 * randomInclusiveInRange - Gets a random inclusive number in a range
	 * @param {number} min - minimum number in the range (default 0)
	 * @param {number} max - maximum number in the range (default 9999999999)
	 * @returns {number} a random number up to a max value
	 */
	static randomInclusiveInRange(min: number = 0, max: number = 9999999999): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}

/** Object related utilities */
export class ObjectUtils {
	/**
	 * Dedupe an array of tables with a compound key
	 * @param {any[]} dataset - an array of tables
	 * @param {...string[]} properties - property string you wish to dedupe on
	 * @returns {any[]} - Deduped version of the original dataset
	 */
	static multiPropDedupe<T extends object>(dataset: T[], ...properties: string[]): T[] {
		if (properties.length === 0) return dataset;
		const values: T[] = [];
		for (const data of dataset) {
			if (
				values.some(function (obj: object) {
					for (const prop of properties) {
						//@ts-expect-error - this is a dynamic property
						if (data[prop] !== obj[prop]) return false;
					}
					return true;
				})
			)
				continue;
			values.push(data);
		}
		return values;
	}

	/**
	 * Convert an array of objects to a csv format
	 * @param rows - an array of objects for each row
	 * @param headers - dictionary with the key being the objects key and the value being what you want it called in the csv file
	 * @returns string - csv formatted string of object
	 */
	static convertToCSV<T extends object>(rows: T[], headers?: { [Property in keyof Partial<T>]: string }): string {
		type keys = keyof T;
		const csvKeys: keys[] = (headers ? Object.keys(headers) : Object.keys(rows[0])) as keys[];
		let stringBuilder = (headers ? Object.values(headers) : csvKeys).join(',');
		stringBuilder += '\r\n';
		for (const row of rows) {
			const stringArray: string[] = [];
			for (const key of csvKeys) {
				const value: unknown = row[key];
				if (!value && value !== 0) {
					stringArray.push('');
					continue;
				}
				if (value instanceof Date) {
					stringArray.push(DateUtils.formatDateForUser(value));
				} else {
					stringArray.push(value.toString().replace(/,/gi, ' '));
				}
			}
			stringBuilder += stringArray.join(',');
			stringBuilder += '\r\n';
		}
		return stringBuilder;
	}

	/**
	 *
	 * @param data - the array to paginate
	 * @param page - which page of data to return
	 * @param perPage - number of items per page
	 * @returns - a new array made up of the page of data from the original array
	 */
	static paginateArray<T>(data: T[], page: number, perPage: number): T[] {
		const offset = page * perPage - perPage;
		return data.slice(offset, page * perPage);
	}

	/**
	 * Filters an array in place
	 * Based on the answer here https://stackoverflow.com/a/57685728
	 * @param array The array to filter
	 * @param condition The filter criteria
	 * @returns An array of the elements removed
	 */
	static filterInPlace<T>(array: T[], condition: (value: T) => boolean): T[] {
		let next_place = 0;
		const removed: T[] = [];

		for (const value of array) {
			if (condition(value)) array[next_place++] = value;
			else removed.push(value);
		}

		array.splice(next_place);
		return removed;
	}

	/**
	 * Syntactic sugar for force casting a variable
	 * @param obj
	 * @returns
	 */
	static forceCast<T>(obj: unknown): T {
		return obj as unknown as T;
	}

	/**
	 * Returns a base object either through JSON.parse or a clone of the original object
	 * @name safeParse
	 * @param json
	 * @returns {object} - Returns a json object of the stringified object
	 */
	static safeParse<T extends object>(json: unknown): T | object {
		if (!json) return {};
		try {
			if (typeof json === 'string') return JSON.parse(json);
		} catch (_e) {
			/* empty */
		}
		return this.clone(json);
	}

	/**
	 * Returns a data structure that is parsed and retains the original object
	 * @name deepSafeParse
	 * @param json - any data structure
	 * @returns - Returns a fully parsed data structure
	 */
	static deepSafeParse<T>(json: unknown): object | T | string | unknown {
		const isNumString = (str: string) => !isNaN(Number(str));
		if (typeof json === 'string') {
			if (isNumString(json)) {
				return json;
			}
			try {
				return ObjectUtils.deepSafeParse(JSON.parse(json));
			} catch (_err) {
				return json;
			}
		} else if (Array.isArray(json)) {
			return json.map((val) => ObjectUtils.deepSafeParse(val));
		} else if (typeof json === 'object' && json !== null) {
			return Object.keys(json).reduce((obj, key) => {
				// @ts-expect-error - Object could be anything
				const val = json[key];
				// @ts-expect-error - Object could be anything
				obj[key] = isNumString(val) ? val : ObjectUtils.deepSafeParse<T>(val);
				return obj;
			}, {});
		} else {
			return json;
		}
	}

	/**
	 * Deep value replace for object
	 * @name deepValueReplace
	 * @param {any} entity
	 * @param {string} search
	 * @param {string} replacement
	 * @returns {object}
	 * @example
	 * deepValueReplace(
	 *  {a:"red",b: {b1:"blue",b2:"red"},c:{c1:{c11:"red"}}},
	 *  "red",
	 *  "yellow"
	 * )
	 */
	static deepValueReplace<T extends object>(entity: T, search: string, replacement: string): T {
		const newEntity: any = {},
			regExp = new RegExp(search, 'g');
		for (const property in entity) {
			if (!entity.hasOwnProperty(property)) {
				continue;
			}

			let value: any = entity[property];
			const newProperty = property;
			if (typeof value === 'object') {
				value = ObjectUtils.deepValueReplace(value, search, replacement);
			} else if (typeof value === 'string') {
				value = value.replace(regExp, replacement);
			}

			newEntity[newProperty] = value;
		}

		return newEntity;
	}

	/**
	 * Check if it is an empty object
	 * @name isEmptyObject
	 * @param {object} obj
	 * @returns {boolean}
	 */
	static isEmptyObject(obj: object): boolean {
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) return false;
		}
		return true;
	}

	/**
	 * Tests if passed in value is an object and is not null
	 * @param credentials
	 */
	static isObject(obj: unknown): boolean {
		return typeof obj === 'object' && obj !== null;
	}

	/**
	 * Serialize an object to query string
	 * @name serialize
	 * @param {object} obj
	 * @returns {string}
	 */
	static serialize(obj: any): string {
		const str = [];
		for (const p in obj)
			if (obj.hasOwnProperty(p)) {
				if (Array.isArray(obj[p])) {
					const concatArray: string[] = [];
					for (let i = 0; i < obj[p].length; i++) {
						concatArray.push(encodeURIComponent(p) + '[]=' + encodeURIComponent(obj[p][i]));
					}
					const concatStr = concatArray.join('&');
					str.push(concatStr);
				} else if (typeof obj[p] === 'object') {
					str.push(encodeURIComponent(p) + '=' + JSON.stringify(obj[p]));
				} else {
					str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
				}
			}
		return str.join('&');
	}

	/**
	 * Convert server object to client object
	 * @name serverToClientObj
	 * @param {any} object
	 * @param {any} metadata
	 * @returns {any}
	 */
	static serverToClientObj<T extends object>(object: any, metadata: any): T {
		const meta = metadata ?? null;
		const obj = cloneDeep(object);
		if (obj && Array.isArray(obj)) {
			for (const j in obj) {
				for (const i in meta) {
					if (obj[j][i] !== undefined) {
						obj[j][i] = ObjectUtils.serverToClientProperty(obj[j][i], meta[i]);
					}
				}
			}
		} else {
			for (const i in meta) {
				if (obj[i] !== undefined) {
					obj[i] = ObjectUtils.serverToClientProperty(obj[i], meta[i]);
				}
			}
		}
		return obj;
	}

	private static serverToClientProperty(property: any, metadata: any) {
		if (metadata.type === 'date') {
			property = DateUtils.dbDateToJsDate(property);
		} else if (metadata.type === 'datetime') {
			property = DateUtils.dbDateTimeToJsDate(property);
		}
		return property;
	}

	/**
	 * Convert client object to server object
	 * @name clientToServerObj
	 * @param {any} obj
	 * @param {any} metadata
	 * @returns {any}
	 */
	static clientToServerObj(obj: any, metadata: any) {
		const meta = metadata ?? null;
		const object = cloneDeep(obj);
		if (!meta) {
			for (const i in object) {
				if (DateUtils.isJsDate(object[i])) {
					object[i] = DateUtils.jsDateToDbDateTime(object[i]);
				} else if (MiscUtils.isBoolean(object[i])) {
					object[i] = object[i] ? 1 : 0;
				}
			}
		}
		if (object && Array.isArray(object)) {
			for (const j in object) {
				for (const i in meta) {
					if (object[j][i]) {
						object[j][i] = ObjectUtils.clientToServerProperty(object[j][i], meta[i]);
					}
				}
			}
		} else {
			for (const i in meta) {
				object[i] = ObjectUtils.clientToServerProperty(object[i], meta[i]);
			}
		}
		return object;
	}

	static clientToServerProperty(property: any, metadata: any) {
		if (metadata.type === 'date') {
			return DateUtils.jsDateToDbDate(property);
		} else if (metadata.type === 'datetime') {
			return DateUtils.jsDateToDbDateTime(property);
		} else if (metadata.type === 'related' && property === '') {
			return null;
		} else if (metadata.type === 'boolean') {
			return property ? 1 : 0;
		}
		return property;
	}

	/**
	 * Converts values of an obj (key/value pair) to a array.
	 * @name toArray
	 * @param {any} obj - The object to convert
	 * @returns {Array<T>}
	 */
	static toArray<T>(obj: any): Array<T> {
		const res: T[] = [];
		for (const i in obj) {
			res.push(obj[i]);
		}
		return res;
	}

	/**
	 * Converts an array to an object or resorts an object using a new key.
	 * @name toObject<T>
	 * @param {Array<T>} array - The array or object to have mapped
	 * @param {keyof T} property - The property to use as the new key
	 * @returns {object}
	 */
	static toObject<T>(array: T[], property: keyof T): object {
		const res: any = {};
		for (const i in array) {
			if (array[i] === null || array[i] === undefined) continue;
			res[array[i][property]] = array[i];
		}
		return res;
	}

	/**
	 * Updates an the properties of an object based on a new objects properties and values
	 * @name update<T>
	 * @param {T} obj - The object to update
	 * @param {T} newObj - The new object to use as the updates
	 * @returns {T}
	 */
	static update<T>(obj: T, newObj: T): T {
		for (const i in newObj) {
			obj[i] = newObj[i];
		}
		return obj;
	}

	/**
	 * Sorts an object or array based on a property and direction
	 * @name sort
	 * @param dataset - The dataset to sort
	 * @param property - The property to sort by
	 * @param reverse - Sort in reverse direction
	 */
	static sort<T>(dataset: T[], property: keyof T, reverse: boolean): T[] {
		let sortOrder = 1;
		if (reverse) {
			sortOrder = -1;
		}
		const compare = function (a: T, b: T) {
			const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
			return result * sortOrder;
		};

		dataset.sort(compare);
		return dataset;
	}

	/**
	 * Determines if an object is empty or not
	 * @name isEmpty
	 * @param {any} obj - The dataset to check
	 * @returns {boolean}
	 */
	static isEmpty(obj: object): boolean {
		for (const i in obj) {
			if (obj.hasOwnProperty(i)) return false;
		}
		return true;
	}

	/**
	 * Get the length of an object by counting its keys
	 * @name getObjectLength
	 * @param {any} obj
	 * @returns {number}
	 */
	static getObjectLength(obj: object): number {
		return Object.keys(obj).length;
	}

	/**
	 * Returns the stripped off data object from a standard database response
	 * @name toData
	 * @param {object} - A standard RsResponseData from the database layer
	 * @returns {object} - Returns the base object nested within the RsResponseData
	 */
	static toData<T>(obj: RsResponseData<T>): T | RsResponseData<T> {
		if (obj && (obj.data || (typeof obj.data === 'boolean' && obj.data === false))) {
			return obj.data;
		}
		return obj;
	}

	/**
	 * Returns a boolean to determine if the value is an array and that array contains data
	 * @name isArrayWithData
	 * @param {Array<any>}
	 * @returns {boolean} - Returns a boolean value
	 * */
	static isArrayWithData(possibleArray: Array<any> | undefined): possibleArray is Array<any> {
		return !!(possibleArray && Array.isArray(possibleArray) && possibleArray.length > 0);
	}

	/**
	 * Groups a dataset by a property.
	 * @param dataset - The dataset to group
	 * @param property - The property to group by
	 * @returns {object}
	 */
	static group(dataset: any[], property: string): object {
		const res: any = {};
		for (const i in dataset) {
			if (!res[dataset[i][property]]) res[dataset[i][property]] = [];

			res[dataset[i][property]].push(dataset[i]);
		}
		return res;
	}

	/**
	 * Filter an object down to specific field list
	 * @param obj {Object} - A given object you wish to filter over
	 * @param fields {string[]} - An array of columns(keys) wished to return from object
	 * @returns {object}
	 * */
	static filterObject(obj: any, fields: string[]): object {
		for (const i in obj) {
			if (fields.includes(i)) continue;
			delete obj[i];
		}
		return obj;
	}

	/**
	 * Same as Clone, kept for backwards compatibility
	 * @param {Object} obj - Any object you wish to have a deep copy of
	 * @returns {Object}
	 * */
	static copy<T>(obj: T): T {
		return cloneDeep(obj);
	}

	/**
	 * Performs a deep clone of an object
	 * @param {Object} obj - Any object you wish to have a deep copy of
	 * @returns {Object}
	 * */
	static clone<T>(obj: T): T {
		return cloneDeep(obj);
	}

	/**
	 * Cast a value to a boolean value
	 * @param data - Any value that you want to actually evaluate to a boolean value
	 * @return {boolean}
	 */
	static toBoolean(data: any): boolean {
		return !(data === 'false' || !data);
	}

	/**
	 * Dedupe an array of objects
	 * @param {any[]} dataset - an array of objects
	 * @param {string} property - property string you wish to dedupe on
	 * @returns {any[]} - Deduped version of the original dataset
	 */
	static dedupe(dataset: any[], property: string): any {
		const res = [];
		const existsValue: any[] = [];
		for (const data of dataset) {
			if (existsValue.includes(data[property])) continue;
			res.push(data);
			existsValue.push(data[property]);
		}
		return res;
	}

	/**
	 * Sort the attributes of an object to return ASC
	 * @param {any} dataset - any singular object
	 * @returns {any} - Returns the given object with values sorted ASC order
	 */
	static simpleSort<T extends object>(dataset: T): T {
		return Object.keys(dataset)
			.sort()
			.reduce(
				(accumulator, key) => ({
					...accumulator,
					[key]: (dataset as any)[key]
				}),
				{}
			) as T;
	}

	/**
	 * Allows to check an array for a particular value
	 * @param arrayToRead
	 * @param valueToLookFor
	 */
	static includes<T extends U, U>(arrayToRead: ReadonlyArray<T>, valueToLookFor: U): valueToLookFor is T {
		return arrayToRead.includes(valueToLookFor as T);
	}

	/**
	 * Find key difference between two objects
	 * @param obj1
	 * @param obj2
	 * @returns {object}
	 */
	static findDiffKeys(obj1: any, obj2: any): object {
		if (!obj1 || !obj2) {
			return {};
		}

		return Object.keys(obj1)
			.filter((key) => !obj2.hasOwnProperty(key))
			.reduce((result: any, current) => {
				result[current] = obj1[current];
				return result;
			}, {});
	}
}

/** Miscellaneous utilities that didn't belong anywhere else */
export class MiscUtils {
	/**
	 * SHA-256 hashes a string
	 * @param value - string to be hashed such as a password
	 * @returns {Promise<string>} - hashed string
	 */
	static async sha256Encode(value: string): Promise<string> {
		if (typeof window !== 'undefined' && typeof window.crypto !== 'undefined') {
			// Browser: Use Web Crypto API
			const encoder = new TextEncoder();
			const data = encoder.encode(value);
			const hash = await window.crypto.subtle.digest('SHA-256', data);

			// Convert ArrayBuffer to Hex String
			const hashArray = Array.from(new Uint8Array(hash));
			return hashArray.map((b) => ('00' + b.toString(16)).slice(-2)).join('');
		} else if (typeof require !== 'undefined') {
			// Node.js: Use crypto module
			const crypto = await import('crypto');
			const hash = crypto.createHash('sha256').update(value, 'utf8').digest('hex');
			return hash;
		} else {
			throw new Error('Crypto functionality is not available in this environment.');
		}
	}

	/**
	 * it wraps whatever function provided as a promise
	 * @param fn: a function.
	 * @returns a function.
	 */
	static wrapAsync(fn: any) {
		return (req: any, res: any, next: any) => {
			// Make sure to `.catch()` any errors and pass them along to the `next()`
			// middleware in the chain, in this case the error handler.
			fn(req, res, next).catch(next);
		};
	}

	/**
	 * Returns the object with a list of fields removed, of a type without those fields
	 * @param arg - an object or array of tables to sanitize
	 * @param remove - an array of property names or indices to remove
	 * @returns {any} - the sanitized object or array
	 */
	static sanitize<T, U extends string | number>(arg: T, remove: U[]): Omit<T, U> {
		const result: any = { ...arg };
		for (const key of remove) {
			delete result[key];
		}
		return result;
	}

	/**
	 * Checks a thrown error object from an axios request for the standard RedSky Error Message
	 * @param error - Error object thrown via axios
	 * @param defaultMessage - A message to use incase there wasn't one given
	 * @returns The msg from the RsError object or the defaultMessage passed in
	 */
	static getRsErrorMessage(error: any, defaultMessage: string): string {
		const errorResponse = ObjectUtils.safeParse(error);
		if (typeof errorResponse !== 'object') return errorResponse;
		if ('msg' in errorResponse) {
			if (typeof errorResponse.msg === 'object') return JSON.stringify(errorResponse.msg);
			return errorResponse.msg as string;
		} else if ('err' in errorResponse) {
			if (typeof errorResponse.err === 'object') return JSON.stringify(errorResponse.err);
			return errorResponse.err as string;
		}
		return defaultMessage;
	}

	/**
	 * Strips off all subdomains and returns just the base domain
	 * @name getDomain
	 * @param {string} url - A url to parse such as truvision.ontrac.io
	 * @returns {string} - The stripped domain such as "ontrac.io"
	 */
	static getDomain(url: string): string {
		if (!url) return '';
		// The Node URL class doesn't consider it a valid url without http or https. Add if needed
		if (url.indexOf('http') === -1) url = 'http://' + url;
		const hostname = new URL(url).hostname;
		if (hostname.includes('ontrac')) {
			return hostname.split('.')[0];
		}
		// Remove all subdomains
		const hostnameSplit = hostname.split('.').slice(-2);
		return hostnameSplit.join('.');
	}

	/**
	 * Returns the hostname of the url. example: https://www.youtube.com -> www.youtube.com
	 * @param url Url of address
	 * @returns Hostname of url or empty if url was empty
	 */
	static getHostname(url: string): string {
		if (!url) return '';
		// The Node URL class doesn't consider it a valid url without http or https. Add if needed
		if (!url.startsWith('http')) url = 'http://' + url;
		return new URL(url).hostname;
	}

	/**
	 * Returns the first subdomain of the url. example https://truvision.ontrac.io -> truvision
	 * @param url
	 * @returns First subdomain or an empty string
	 */
	static getFirstSubdomain(url: string): string {
		if (!url) return '';
		const hostname = this.getHostname(url);
		const hostnameSplit = hostname.split('.');
		if (hostnameSplit.length > 2) return hostnameSplit.splice(-3, 1)[0];
		return '';
	}

	/**
	 * Async sleep method for waiting for a timeout period
	 * @name sleep
	 * @param {number} ms - sleep time in milliseconds
	 * @returns {Promise}
	 * */
	static async sleep(ms: number): Promise<any> {
		await new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Takes an object and stringifies any nested objects
	 * @param data - Must be typeof object
	 * @returns An object whose children are either numbers, strings, booleans, no nested objects
	 */
	static convertDataForUrlParams(data: any): any {
		const convertedData: any = {};
		for (const i in data) {
			if (typeof data[i] === 'object') {
				convertedData[i] = JSON.stringify(data[i]);
			} else {
				convertedData[i] = data[i];
			}
		}
		return convertedData;
	}

	/**
	 * Check if input is a boolean type
	 * @name isBoolean
	 * @param {any} bool
	 * @returns {boolean}
	 */
	static isBoolean(bool: any): boolean {
		if (bool === !!bool) return true;
		return false;
	}
}

/** Date related utilities */
export class DateUtils {
	/**
	 * Get number of days between a start and end date
	 * @param {Date | string} startDate
	 * @param {Date | string} endDate
	 * @returns {number} - Returns a number
	 */
	static daysBetweenStartAndEndDates(startDate: Date, endDate: Date): number {
		const differenceInTime = endDate.getTime() - startDate.getTime();
		return differenceInTime / (1000 * 3600 * 24);
	}

	/**
	 * Format a date for email templates
	 * @param {Date | string} date
	 * @returns {string} - Returns a string such as 10-25-2019 (MM-DD-YYYY)
	 */
	static formatDateForUser(date: string | Date): string {
		if (date === 'N/A') return date;
		const newDate = new Date(`${date}`);
		return `${(newDate.getMonth() + 1).toString()}-${newDate.getDate()}-${newDate.getFullYear()}`;
	}

	/**
	 * Returns a friendly string of the difference between two dates
	 * @param endDate
	 * @param startDate
	 * @returns Friendly string Example: 1 day, 2 hours, 3 minutes, 4 seconds
	 */
	static getDateDifferenceFriendly(endDate: Date, startDate: Date, showNegative = true): string {
		const isNegative = endDate < startDate;
		let diff = Math.abs(endDate.getTime() - startDate.getTime());
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		diff -= days * (1000 * 60 * 60 * 24);
		const hours = Math.floor(diff / (1000 * 60 * 60));
		diff -= hours * (1000 * 60 * 60);
		const minutes = Math.floor(diff / (1000 * 60));
		diff -= minutes * (1000 * 60);
		const seconds = Math.floor(diff / 1000);

		if (days > 0) return `${showNegative && isNegative ? '-' : ''}${days} day${days > 1 ? 's' : ''}`;
		if (hours > 0) return `${showNegative && isNegative ? '-' : ''}${hours} hour${hours > 1 ? 's' : ''}`;
		if (minutes > 0) return `${showNegative && isNegative ? '-' : ''}${minutes} minute${minutes > 1 ? 's' : ''}`;
		return `${showNegative && isNegative ? '-' : ''}${seconds} second${seconds > 1 ? 's' : ''}`;
	}

	/**
	 * Returns the month name for a date object
	 * @param date
	 * @param format - Describes how the text format should be returned. Defaults to long
	 * @returns Month name
	 */
	static getMonthName(
		date: Date,
		format: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined = 'long'
	): string {
		return date.toLocaleString('default', { month: format });
	}

	/**
	 * Returns the date in a friendly format
	 * @param date
	 * @returns Date Time in format of Today, Yesterday, or Month Day at Time
	 */
	static displayFriendlyDateTime(date: string | Date): string {
		let displayDate: Date;
		if (typeof date === 'string') displayDate = new Date(date);
		else displayDate = date;

		if (DateUtils.isSameDayAsCurrent(displayDate)) return `Today at ${DateUtils.displayTime(displayDate)}`;
		else if (DateUtils.isYesterday(displayDate)) return `Yesterday at ${DateUtils.displayTime(displayDate)}`;
		else return `${DateUtils.displayFriendlyDate(displayDate)}, at ${DateUtils.displayTime(displayDate)}`;
	}

	/**
	 * Returns the date in a friendly format with short month name
	 * @param date
	 * @returns Date in format of Short Month Day Year
	 */
	static displayFriendlyDate(date: Date): string {
		return `${DateUtils.getMonthName(date).substr(0, 3)} ${date.getDate()} ${date.getFullYear()}`;
	}

	/**
	 * Returns a Mysql compliant datetime string for now
	 * @name dbNow
	 * @returns {string} - Returns a string for datetime insertion into a database
	 */
	static dbNow(): string {
		return this.jsDateToDbDateTime(new Date());
	}

	/**
	 * Returns a Mysql compliant datetime string for a given hour offset
	 * @name dbHoursFromNow
	 * @param {number} hours - The number of hours you want a date Object formatted
	 * @returns {string} - Returns a string for datetime insertion into a database
	 * */
	static dbHoursFromNow(hours: number): string {
		const today = new Date();
		today.setTime(today.getTime() + hours * (1000 * 60 * 60));
		return this.jsDateToDbDateTime(today);
	}

	/**
	 * Returns a Mysql compliant datetime string for a given minute offset
	 * @name dbMinutesFromNow
	 * @param {number} minutes - The number of minutes you want a date Object formatted
	 * @returns {string} - Returns a string for datetime insertion into a database
	 * */
	static dbMinutesFromNow(minutes: number): string {
		const today = new Date();
		today.setTime(today.getTime() + minutes * (1000 * 60));
		return this.jsDateToDbDateTime(today);
	}

	/**
	 * Returns the number of days in the given month and year
	 * @param {number} month
	 * @param {number} year
	 * @returns {number} - Returns a number with the total days in the year/month
	 */
	static daysInMonth(month: number, year: number): number {
		return new Date(year, month, 0).getDate();
	}

	/**
	 * Pad a value with a leading zero
	 * @param {string} num
	 * @retuns {string} - Returns a zero padded number
	 */
	static padStart(num: string) {
		if (num.length >= 2) return num;
		return '0' + num.slice(-2);
	}

	/**
	 * Returns a date object with a new range of days
	 * @param {Date} date
	 * @param {number} days
	 * @returns {Date} - Returns a new date with days incremented
	 */
	static addDays(date: Date | string, days: number): Date {
		const returnDate: Date = new Date(date);
		returnDate.setDate(returnDate.getDate() + days);
		return returnDate;
	}

	/**
	 * Adds a number of seconds to a date
	 * @param date - The date to add seconds to
	 * @param seconds - Number of seconds to add
	 * @returns {Date} - Returns a date with augmented time
	 */
	static addSeconds(date: Date, seconds: number): Date {
		return new Date(date.getTime() + seconds * 1000);
	}

	/**
	 * Get a range of dates inclusive between a start and end date
	 * @param {Date | string} startDate
	 * @param {Date | string} endDate
	 * @returns {string[]} - Returns a string array of inclusive dates
	 */
	static getDateRange(startDate: Date | string, endDate: Date | string): string[] {
		const dateArray = [];
		let currentDate = startDate;
		while (currentDate <= endDate) {
			const newDate = new Date(currentDate).toISOString().slice(0, 10);
			dateArray.push(`*${newDate}`);
			currentDate = DateUtils.addDays(currentDate, 1).toISOString().slice(0, 10);
		}
		return dateArray;
	}

	/**
	 * Display time of input date time
	 * @name displayTime
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayTime(date: Date | string): string {
		if (typeof date === 'string') {
			const workingDate: Date | null = this.getDateFromString(date);
			if (workingDate == null) return date;
			date = workingDate;
		}
		let hours = date.getHours();
		let minutes: number | string = date.getMinutes();
		const ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // The hour '0' should be '12'
		minutes = minutes < 10 ? `0${minutes}` : minutes;
		return `${hours}:${minutes} ${ampm}`;
	}

	/**
	 * Display date of input date time as this: mm/dd/yyyy
	 * @name displayDate
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayDate(date: Date | string): string {
		if (typeof date === 'string') {
			const workingDate: Date | null = this.getDateFromString(date);
			if (workingDate == null) return date;
			date = workingDate;
		}
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const year = date.getFullYear();

		return `${month}/${day}/${year}`;
	}

	/**
	 * Display day of the week of the input date
	 * @name displayDayOfWeek
	 * @param {Date} date
	 * @returns {string}
	 */
	static displayDayOfWeek(date: Date): string {
		return days[date.getDay()];
	}

	/**
	 * Check if input date is the same week as current date
	 * @name isSameWeekAsCurrent
	 * @param {Date} date
	 * @returns {boolean}
	 */
	static isSameWeekAsCurrent(date: Date): boolean {
		const current = new Date();
		if (current.getWeekOfMonth() !== date.getWeekOfMonth()) {
			return false;
		}
		if (current.getMonth() !== date.getMonth()) {
			return false;
		}
		if (current.getFullYear() !== date.getFullYear()) {
			return false;
		}
		return true;
	}

	/**
	 * Check if input date is the same day as current date
	 * @name isSameDayAsCurrent
	 * @param {Date} date
	 * @returns {boolean}
	 */
	static isSameDayAsCurrent(date: Date): boolean {
		if (!date) {
			return false;
		}
		const current = new Date();
		if (current.getDate() !== date.getDate()) {
			return false;
		}
		if (current.getMonth() !== date.getMonth()) {
			return false;
		}
		if (current.getFullYear() !== date.getFullYear()) {
			return false;
		}
		return true;
	}

	/**
	 * Check if input date is yesterday
	 * @name isYesterday
	 * @param {Date} date
	 * @returns {boolean}
	 */
	static isYesterday(date: Date): boolean {
		const currentDate = new Date();
		const todayMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
		const yesterdayMidnight = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			currentDate.getDate() - 1
		);
		return date.getTime() >= yesterdayMidnight.getTime() && date.getTime() <= todayMidnight.getTime();
	}

	/**
	 * Convert a javascript Date object to a MySQL compatible datetime string
	 * @name jsDateToDbDateTime
	 * @param {Date} date
	 * @returns {string}
	 */
	static jsDateToDbDateTime(date: Date): string {
		return date.toISOString().slice(0, 19).replace('T', ' ');
	}

	/**
	 * Convert a javascript Date object to a MySQL compatible date string
	 * @name jsDateToDbDate
	 * @param {Date} date
	 * @returns {string}
	 */
	static jsDateToDbDate(date: Date): string {
		return date.toISOString().substring(0, 10);
	}

	/**
	 * Convert a MySQL compatible date column string to a javascript Date object
	 * @name dbDateToJsDate
	 * @param {string} dateStr - A date string from a database
	 * @returns {Date | null}
	 */
	static dbDateToJsDate(dateStr: string): Date | null {
		if (!dateStr) {
			return null;
		}
		return new Date(dateStr.replace(/T.*Z/g, '').replace(/-/g, '/'));
	}

	/**
	 * Convert a MySQL compatible datetime column string to a javascript Date object
	 * @name dbDateTimeToJsDate
	 * @param {string} dateStr - A datetime string from a database
	 * @returns {Date | null}
	 */
	static dbDateTimeToJsDate(dateStr: string): Date | null {
		if (!dateStr) {
			return null;
		}
		const date = DateUtils.dateFromString(dateStr);
		return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
	}

	/**
	 * Convert date string to date object
	 * @name dateFromString
	 * @param {string} dateStr
	 * @returns {Date}
	 */
	static dateFromString(dateStr: string): Date {
		dateStr = dateStr.replace('T', ' ').replace('Z', '');
		const a = dateStr.split(/[^0-9]/).map((s) => {
			return parseInt(s, 10);
		});
		return new Date(a[0], a[1] - 1 || 0, a[2] || 1, a[3] || 0, a[4] || 0, a[5] || 0, a[6] || 0);
	}

	/**
	 * Check if input date is a JS date object
	 * @name isJsDate
	 * @param {any} date
	 * @returns {boolean}
	 */
	static isJsDate(date: any): boolean {
		if (date && date.getTime && typeof date.getTime === 'function') {
			return true;
		} else {
			return false;
		}
	}

	private static getDateFromString(dateString: string): Date | null {
		try {
			return new Date(dateString);
		} catch {
			return null;
		}
	}
}

export const US_States_Territories = [
	{ abbreviation: 'AL', name: 'Alabama' },
	{ abbreviation: 'AK', name: 'Alaska' },
	{ abbreviation: 'AZ', name: 'Arizona' },
	{ abbreviation: 'AR', name: 'Arkansas' },
	{ abbreviation: 'CA', name: 'California' },
	{ abbreviation: 'CO', name: 'Colorado' },
	{ abbreviation: 'CT', name: 'Connecticut' },
	{ abbreviation: 'DE', name: 'Delaware' },
	{ abbreviation: 'DC', name: 'District' },
	{ abbreviation: 'FL', name: 'Florida' },
	{ abbreviation: 'GA', name: 'Georgia' },
	{ abbreviation: 'HI', name: 'Hawaii' },
	{ abbreviation: 'ID', name: 'Idaho' },
	{ abbreviation: 'IL', name: 'Illinois' },
	{ abbreviation: 'IN', name: 'Indiana' },
	{ abbreviation: 'IA', name: 'Iowa' },
	{ abbreviation: 'KS', name: 'Kansas' },
	{ abbreviation: 'KY', name: 'Kentucky' },
	{ abbreviation: 'LA', name: 'Louisiana' },
	{ abbreviation: 'ME', name: 'Maine' },
	{ abbreviation: 'MD', name: 'Maryland' },
	{ abbreviation: 'MA', name: 'Massachusetts' },
	{ abbreviation: 'MI', name: 'Michigan' },
	{ abbreviation: 'MN', name: 'Minnesota' },
	{ abbreviation: 'MS', name: 'Mississippi' },
	{ abbreviation: 'MO', name: 'Missouri' },
	{ abbreviation: 'MT', name: 'Montana' },
	{ abbreviation: 'NE', name: 'Nebraska' },
	{ abbreviation: 'NV', name: 'Nevada' },
	{ abbreviation: 'NH', name: 'New Hampshire' },
	{ abbreviation: 'NJ', name: 'New Jersey' },
	{ abbreviation: 'NM', name: 'New Mexico' },
	{ abbreviation: 'NY', name: 'New York' },
	{ abbreviation: 'NC', name: 'North Carolina' },
	{ abbreviation: 'ND', name: 'North Dakota' },
	{ abbreviation: 'OH', name: 'Ohio' },
	{ abbreviation: 'OK', name: 'Oklahoma' },
	{ abbreviation: 'OR', name: 'Oregon' },
	{ abbreviation: 'PA', name: 'Pennsylvania' },
	{ abbreviation: 'RI', name: 'Rhode Island' },
	{ abbreviation: 'SC', name: 'South Carolina' },
	{ abbreviation: 'SD', name: 'South Dakota' },
	{ abbreviation: 'TN', name: 'Tennessee' },
	{ abbreviation: 'TX', name: 'Texas' },
	{ abbreviation: 'UT', name: 'Utah' },
	{ abbreviation: 'VT', name: 'Vermont' },
	{ abbreviation: 'VA', name: 'Virginia' },
	{ abbreviation: 'WA', name: 'Washington' },
	{ abbreviation: 'WV', name: 'West Virginia' },
	{ abbreviation: 'WI', name: 'Wisconsin' },
	{ abbreviation: 'WY', name: 'Wyoming' },
	{ abbreviation: 'AS', name: 'American Samoa' },
	{ abbreviation: 'GU', name: 'Guam' },
	{ abbreviation: 'MP', name: 'Northern Mariana Island' },
	{ abbreviation: 'PR', name: 'Puerto Rico' },
	{ abbreviation: 'VI', name: 'Virgin Islands' },
	{ abbreviation: 'AA', name: 'AA (Armed Forces Americas)' },
	{ abbreviation: 'AE', name: 'AE (Armed Forces Europe)' },
	{ abbreviation: 'AP', name: 'AP (Armed Forces Pacific)' }
];
