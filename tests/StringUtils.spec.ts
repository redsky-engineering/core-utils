import { StringUtils } from '../src/';

describe('StringUtils', () => {
	it('convertCamelCaseToHuman should convert camel case to human readable string', () => {
		expect(StringUtils.convertCamelCaseToHuman('camelCase')).toBe('Camel Case');
		expect(StringUtils.convertCamelCaseToHuman('thisIsATest')).toBe('This Is A Test');
	});

	it('getInitialsFromName should return initials from full name', () => {
		expect(StringUtils.getInitialsFromName('John Doe')).toBe('JD');
		expect(StringUtils.getInitialsFromName('Alice Bob Carol')).toBe('AC');
	});

	it('convertEnumToHuman should convert enum value to human readable string', () => {
		expect(StringUtils.convertEnumToHuman('UPPERCASE_STRING')).toBe('Uppercase String');
		expect(StringUtils.convertEnumToHuman('ANOTHER_ENUM_VALUE')).toBe('Another Enum Value');
	});

	it('convertTwentyFourHourTime should convert 24-hour time to am/pm format', () => {
		expect(StringUtils.convertTwentyFourHourTime('1300')).toBe('1:00 PM');
		expect(StringUtils.convertTwentyFourHourTime('0900')).toBe('9:00 AM');
		expect(StringUtils.convertTwentyFourHourTime('0000')).toBe('12:00 AM');
	});

	it('convertFrom12To24Format should convert 12-hour time format to 24-hour format', () => {
		expect(StringUtils.convertFrom12To24Format('1:00pm')).toBe('13:00');
		expect(StringUtils.convertFrom12To24Format('12:00am')).toBe('00:00');
		expect(StringUtils.convertFrom12To24Format('12:00pm')).toBe('12:00');
	});

	it('convertFromSecToHrMinFormat should convert seconds to hour min format', () => {
		expect(StringUtils.convertFromSecToHrMinFormat(3600)).toBe('1 hr 0 min');
		expect(StringUtils.convertFromSecToHrMinFormat(3660)).toBe('1 hr 1 min');
	});

	it('convertFromMinToHrMinFormat should convert minutes to hour min format', () => {
		expect(StringUtils.convertFromMinToHrMinFormat(60)).toBe('1 hr 0 min');
		expect(StringUtils.convertFromMinToHrMinFormat(61)).toBe('1 hr 1 min');
	});

	it('convertFromSecToHrMinArray should convert seconds to [hour, minute] array', () => {
		expect(StringUtils.convertFromSecToHrMinArray(3600)).toEqual(['1', '0']);
		expect(StringUtils.convertFromSecToHrMinArray(3660)).toEqual(['1', '1']);
	});

	it('validateEmail should validate email syntax', () => {
		expect(StringUtils.validateEmail('test@example.com')).toBe(true);
		expect(StringUtils.validateEmail('invalid-email')).toBe(false);
	});

	it('removeLineEndings should remove line endings and extra spaces', () => {
		expect(StringUtils.removeLineEndings('Hello\nWorld\t!')).toBe('Hello World !');
	});

	it('capitalizeFirst should capitalize the first letter', () => {
		expect(StringUtils.capitalizeFirst('hello')).toBe('Hello');
	});

	it('semVerToNumber should convert semVer string to number', () => {
		expect(StringUtils.semVerToNumber('1.2.3')).toBe(1002003);
	});

	it('isValidUrl should check if a string is a valid URL', () => {
		expect(StringUtils.isValidUrl('https://www.google.com')).toBe(true);
		expect(StringUtils.isValidUrl('invalid-url')).toBe(false);
	});

	it('intToBase36 should convert integer to base36 string', () => {
		expect(StringUtils.intToBase36(10)).toBe('0000000A');
	});

	it('isEmpty should check if a string is empty', () => {
		expect(StringUtils.isEmpty('')).toBe(true);
		expect(StringUtils.isEmpty('not empty')).toBe(false);
	});

	it('formatPriceRange should format price range string', () => {
		expect(StringUtils.formatPriceRange('1000-2000')).toBe('$10-$20');
	});

	it('testRegex should check if a value matches the regex', () => {
		expect(StringUtils.testRegex(/hello/, 'hello world')).toBe(true);
	});

	it('generateGuid should generate a unique GUID', () => {
		const guid1 = StringUtils.generateGuid();
		const guid2 = StringUtils.generateGuid();
		expect(guid1).not.toBe(guid2);
	});

	it('snakeCaseToHuman should convert snake case to human readable string', () => {
		expect(StringUtils.snakeCaseToHuman('snake_case')).toBe('Snake Case');
	});

	it('addCommasToNumber should add commas to number', () => {
		expect(StringUtils.addCommasToNumber(1000)).toBe('1,000');
	});

	it('removeHtmlTags should remove HTML tags from string', () => {
		expect(StringUtils.removeHtmlTags('<div>Hello</div>')).toBe('Hello');
	});

	it('removeIncorrectStringValues should remove incorrect string values (emojis)', () => {
		expect(StringUtils.removeIncorrectStringValues('Hello😀')).toBe('Hello');
	});

	it('formatPhoneNumber should format phone number', () => {
		expect(StringUtils.formatPhoneNumber('8013615555')).toBe('(801) 361-5555');
	});

	it('removeAllExceptNumbers should remove all characters except numbers', () => {
		expect(StringUtils.removeAllExceptNumbers('abc123')).toBe('123');
	});

	it('doubleDigit should prefix text with 0 if it is a single digit', () => {
		expect(StringUtils.doubleDigit('1')).toBe('01');
	});

	it('getHumanReadableByteValue should return human readable byte value', () => {
		expect(StringUtils.getHumanReadableByteValue(1024)).toBe('1.0 KB');
	});

	it('toPascalCasing should convert snake or kebab case to Pascal Case', () => {
		expect(StringUtils.toPascalCasing('hello-world')).toBe('HelloWorld');
		expect(StringUtils.toPascalCasing('hello_world')).toBe('HelloWorld');
	});
});
