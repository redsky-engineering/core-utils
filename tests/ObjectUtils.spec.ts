import { expect } from 'chai';
import { ObjectUtils } from '../src/';

describe('ObjectUtils', () => {
	describe('multiPropDedupe', () => {
		it('should dedupe array based on multiple properties', () => {
			const dataset = [
				{ id: 1, name: 'Alice' },
				{ id: 1, name: 'Alice' },
				{ id: 1, name: 'Bob' },
				{ id: 2, name: 'Alice' }
			];
			const result = ObjectUtils.multiPropDedupe(dataset, 'id', 'name');
			expect(result).to.have.lengthOf(3);
		});

		it('should return original dataset if no properties provided', () => {
			const dataset = [{ id: 1 }, { id: 1 }];
			const result = ObjectUtils.multiPropDedupe(dataset);
			expect(result).to.equal(dataset);
		});
	});

	describe('convertToCSV', () => {
		it('should convert array of objects to CSV string', () => {
			const rows = [
				{ name: 'Alice', age: 30 },
				{ name: 'Bob', age: 25 }
			];
			const result = ObjectUtils.convertToCSV(rows);
			expect(result).to.include('name,age');
			expect(result).to.include('Alice,30');
			expect(result).to.include('Bob,25');
		});

		it('should use custom headers when provided', () => {
			const rows = [{ name: 'Alice', age: 30 }];
			const headers = { name: 'Full Name', age: 'Years Old' };
			const result = ObjectUtils.convertToCSV(rows, headers);
			expect(result).to.include('Full Name,Years Old');
		});

		it('should handle empty values', () => {
			const rows = [{ name: 'Alice', age: null as unknown as number }];
			const result = ObjectUtils.convertToCSV(rows);
			expect(result).to.include('Alice,');
		});

		it('should handle zero values', () => {
			const rows = [{ name: 'Alice', age: 0 }];
			const result = ObjectUtils.convertToCSV(rows);
			expect(result).to.include('Alice,0');
		});
	});

	describe('paginateArray', () => {
		it('should return correct page of data', () => {
			const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			expect(ObjectUtils.paginateArray(data, 1, 3)).to.deep.equal([1, 2, 3]);
			expect(ObjectUtils.paginateArray(data, 2, 3)).to.deep.equal([4, 5, 6]);
			expect(ObjectUtils.paginateArray(data, 4, 3)).to.deep.equal([10]);
		});
	});

	describe('filterInPlace', () => {
		it('should filter array in place and return removed items', () => {
			const array = [1, 2, 3, 4, 5];
			const removed = ObjectUtils.filterInPlace(array, (value) => value > 2);
			expect(array).to.deep.equal([3, 4, 5]);
			expect(removed).to.deep.equal([1, 2]);
		});
	});

	describe('forceCast', () => {
		it('should cast value to specified type', () => {
			const value: unknown = { name: 'test' };
			const result = ObjectUtils.forceCast<{ name: string }>(value);
			expect(result.name).to.equal('test');
		});
	});

	describe('safeParse', () => {
		it('should parse JSON string', () => {
			const result = ObjectUtils.safeParse('{"name":"test"}');
			expect(result).to.deep.equal({ name: 'test' });
		});

		it('should return empty object for falsy input', () => {
			expect(ObjectUtils.safeParse(null)).to.deep.equal({});
			expect(ObjectUtils.safeParse(undefined)).to.deep.equal({});
		});

		it('should return clone of object if already an object', () => {
			const original = { name: 'test' };
			const result = ObjectUtils.safeParse(original);
			expect(result).to.deep.equal(original);
			expect(result).to.not.equal(original);
		});
	});

	describe('deepSafeParse', () => {
		it('should deeply parse nested JSON strings', () => {
			const input = '{"nested": "{\\"key\\": \\"value\\"}"}';
			const result = ObjectUtils.deepSafeParse(input);
			expect(result).to.deep.equal({ nested: { key: 'value' } });
		});

		it('should handle arrays', () => {
			const input = ['{"key": "value"}'];
			const result = ObjectUtils.deepSafeParse(input);
			expect(result).to.deep.equal([{ key: 'value' }]);
		});

		it('should preserve numeric strings', () => {
			const input = '123';
			const result = ObjectUtils.deepSafeParse(input);
			expect(result).to.equal('123');
		});
	});

	describe('deepValueReplace', () => {
		it('should replace values deeply in an object', () => {
			const entity = { a: 'red', b: { b1: 'blue', b2: 'red' }, c: { c1: { c11: 'red' } } };
			const result = ObjectUtils.deepValueReplace(entity, 'red', 'yellow');
			expect(result.a).to.equal('yellow');
			expect(result.b.b2).to.equal('yellow');
			expect(result.c.c1.c11).to.equal('yellow');
			expect(result.b.b1).to.equal('blue');
		});
	});

	describe('isEmptyObject', () => {
		it('should return true for empty object', () => {
			expect(ObjectUtils.isEmptyObject({})).to.equal(true);
		});

		it('should return false for non-empty object', () => {
			expect(ObjectUtils.isEmptyObject({ key: 'value' })).to.equal(false);
		});
	});

	describe('isObject', () => {
		it('should return true for objects', () => {
			expect(ObjectUtils.isObject({})).to.equal(true);
			expect(ObjectUtils.isObject({ key: 'value' })).to.equal(true);
		});

		it('should return false for null', () => {
			expect(ObjectUtils.isObject(null)).to.equal(false);
		});

		it('should return false for primitives', () => {
			expect(ObjectUtils.isObject('string')).to.equal(false);
			expect(ObjectUtils.isObject(123)).to.equal(false);
			expect(ObjectUtils.isObject(undefined)).to.equal(false);
		});
	});

	describe('serialize', () => {
		it('should serialize object to query string', () => {
			const obj = { name: 'test', value: 123 };
			const result = ObjectUtils.serialize(obj);
			expect(result).to.equal('name=test&value=123');
		});

		it('should handle array values with primitives', () => {
			const obj = { ids: [1, 2, 3] };
			const result = ObjectUtils.serialize(obj);
			expect(result).to.equal('ids=1&ids=2&ids=3');
		});

		it('should handle array of objects with undefined values', () => {
			const obj = {
				items: [
					{
						productId: 6,
						quantity: 1,
						variantId: undefined,
						subscriptionIntervalUnit: 'MONTH',
						subscriptionIntervalCount: undefined,
						subscriptionPlanId: undefined
					},
					{
						productId: 7,
						quantity: 1,
						variantId: undefined,
						subscriptionIntervalUnit: 'MONTH',
						subscriptionIntervalCount: undefined,
						subscriptionPlanId: undefined
					}
				],
				customerUserId: 31,
				postalCode: '84660',
				countryCode: 'US',
				customItems: undefined
			};
			const result = ObjectUtils.serialize(obj);

			// Build expected result - undefined values in nested objects are preserved in JSON.stringify
			const expectedItem0 = 'items=' + encodeURIComponent(JSON.stringify(obj.items[0]));
			const expectedItem1 = 'items=' + encodeURIComponent(JSON.stringify(obj.items[1]));
			const expectedCustomerUserId = 'customerUserId=31';
			const expectedPostalCode = 'postalCode=84660';
			const expectedCountryCode = 'countryCode=US';
			// customItems is undefined at root level, so it should be skipped

			expect(result).to.include(expectedItem0);
			expect(result).to.include(expectedItem1);
			expect(result).to.include(expectedCustomerUserId);
			expect(result).to.include(expectedPostalCode);
			expect(result).to.include(expectedCountryCode);
			expect(result).to.not.include('customItems');
		});

		it('should handle nested objects', () => {
			const obj = { filter: { status: 'active' } };
			const result = ObjectUtils.serialize(obj);
			expect(result).to.equal('filter=' + encodeURIComponent(JSON.stringify({ status: 'active' })));
		});

		it('should encode nested objects with special characters', () => {
			const obj = { filter: { status: 'a&b=c' } };
			const result = ObjectUtils.serialize(obj);
			expect(result).to.equal('filter=' + encodeURIComponent(JSON.stringify({ status: 'a&b=c' })));
			// Verify that special characters in nested object are properly encoded
			expect(result).to.not.include('&b=c');
		});

		it('should encode special characters', () => {
			const obj = { name: 'hello world', special: '&=' };
			const result = ObjectUtils.serialize(obj);
			expect(result).to.include('name=hello%20world');
			expect(result).to.include('special=%26%3D');
		});

		it('should skip undefined values', () => {
			const obj = { name: 'test', value: undefined, other: 'data' };
			const result = ObjectUtils.serialize(obj);
			expect(result).to.equal('name=test&other=data');
			expect(result).to.not.include('value');
		});

		it('should skip undefined items in arrays', () => {
			const obj = { ids: [1, undefined, 3, undefined, 5] };
			const result = ObjectUtils.serialize(obj);
			// undefined items should be skipped
			expect(result).to.equal('ids=1&ids=3&ids=5');
			expect(result).to.not.include('undefined');
		});

		it('should handle arrays with null items but skip undefined items', () => {
			const obj = { values: [1, null, undefined, 'test'] };
			const result = ObjectUtils.serialize(obj);
			// null is kept as 'null', but undefined is skipped
			expect(result).to.equal('values=1&values=null&values=test');
			expect(result).to.not.include('undefined');
		});

		it('should handle arrays with only undefined items', () => {
			const obj = { name: 'test', ids: [undefined, undefined], other: 'data' };
			const result = ObjectUtils.serialize(obj);
			// Array with only undefined items results in no params for that key
			expect(result).to.equal('name=test&other=data');
			expect(result).to.not.include('ids');
		});

		it('should handle null values', () => {
			const obj = { name: 'test', value: null };
			const result = ObjectUtils.serialize(obj);
			expect(result).to.equal('name=test&value=null');
		});

		it('should handle empty arrays', () => {
			const obj = { name: 'test', ids: [] };
			const result = ObjectUtils.serialize(obj);
			expect(result).to.equal('name=test');
		});
	});

	describe('toArray', () => {
		it('should convert object values to array', () => {
			const obj = { a: 1, b: 2, c: 3 };
			const result = ObjectUtils.toArray<number>(obj);
			expect(result).to.deep.equal([1, 2, 3]);
		});
	});

	describe('toObject', () => {
		it('should convert array to object using property as key', () => {
			const array = [
				{ id: 'a', name: 'Alice' },
				{ id: 'b', name: 'Bob' }
			];
			const result = ObjectUtils.toObject(array, 'id');
			expect(result).to.deep.equal({
				a: { id: 'a', name: 'Alice' },
				b: { id: 'b', name: 'Bob' }
			});
		});

		it('should skip null and undefined values', () => {
			const array = [
				{ id: 'a', name: 'Alice' },
				null as unknown as { id: string; name: string },
				undefined as unknown as { id: string; name: string }
			];
			const result = ObjectUtils.toObject(array, 'id');
			expect(result).to.deep.equal({
				a: { id: 'a', name: 'Alice' }
			});
		});
	});

	describe('update', () => {
		it('should update object properties', () => {
			const obj = { name: 'Alice', age: 30 };
			const newObj = { name: 'Bob', age: 25 };
			const result = ObjectUtils.update(obj, newObj);
			expect(result).to.deep.equal({ name: 'Bob', age: 25 });
			expect(result).to.equal(obj);
		});
	});

	describe('sort', () => {
		it('should sort array by property ascending', () => {
			const dataset = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
			const result = ObjectUtils.sort(dataset, 'name', false);
			expect(result[0].name).to.equal('Alice');
			expect(result[1].name).to.equal('Bob');
			expect(result[2].name).to.equal('Charlie');
		});

		it('should sort array by property descending', () => {
			const dataset = [{ age: 20 }, { age: 30 }, { age: 25 }];
			const result = ObjectUtils.sort(dataset, 'age', true);
			expect(result[0].age).to.equal(30);
			expect(result[1].age).to.equal(25);
			expect(result[2].age).to.equal(20);
		});
	});

	describe('isEmpty', () => {
		it('should return true for empty object', () => {
			expect(ObjectUtils.isEmpty({})).to.equal(true);
		});

		it('should return false for non-empty object', () => {
			expect(ObjectUtils.isEmpty({ key: 'value' })).to.equal(false);
		});
	});

	describe('getObjectLength', () => {
		it('should return number of keys in object', () => {
			expect(ObjectUtils.getObjectLength({})).to.equal(0);
			expect(ObjectUtils.getObjectLength({ a: 1, b: 2 })).to.equal(2);
		});
	});

	describe('toData', () => {
		it('should extract data from RsResponseData object', () => {
			const response = { data: { name: 'test' } };
			const result = ObjectUtils.toData(response);
			expect(result).to.deep.equal({ name: 'test' });
		});

		it('should handle false data value', () => {
			const response = { data: false };
			const result = ObjectUtils.toData(response);
			expect(result).to.equal(false);
		});

		it('should return original object if no data property', () => {
			const response = { other: 'value' } as unknown as { data: unknown };
			const result = ObjectUtils.toData(response);
			expect(result).to.deep.equal({ other: 'value' });
		});
	});

	describe('isArrayWithData', () => {
		it('should return true for non-empty array', () => {
			expect(ObjectUtils.isArrayWithData([1, 2, 3])).to.equal(true);
		});

		it('should return false for empty array', () => {
			expect(ObjectUtils.isArrayWithData([])).to.equal(false);
		});

		it('should return false for undefined', () => {
			expect(ObjectUtils.isArrayWithData(undefined)).to.equal(false);
		});

		it('should return false for non-array values', () => {
			expect(ObjectUtils.isArrayWithData('string' as unknown as Array<unknown>)).to.equal(false);
		});
	});

	describe('group', () => {
		it('should group array by property', () => {
			const dataset = [
				{ category: 'A', name: 'Item1' },
				{ category: 'B', name: 'Item2' },
				{ category: 'A', name: 'Item3' }
			];
			const result = ObjectUtils.group(dataset, 'category') as Record<
				string,
				Array<{ category: string; name: string }>
			>;
			expect(result.A).to.have.lengthOf(2);
			expect(result.B).to.have.lengthOf(1);
		});
	});

	describe('filterObject', () => {
		it('should filter object to only include specified fields', () => {
			const obj = { a: 1, b: 2, c: 3 };
			const result = ObjectUtils.filterObject(obj, ['a', 'c']);
			expect(result).to.deep.equal({ a: 1, c: 3 });
		});
	});

	describe('copy', () => {
		it('should create deep copy of object', () => {
			const original = { nested: { value: 'test' } };
			const copied = ObjectUtils.copy(original);
			expect(copied).to.deep.equal(original);
			expect(copied).to.not.equal(original);
			expect(copied.nested).to.not.equal(original.nested);
		});
	});

	describe('clone', () => {
		it('should create deep clone of object', () => {
			const original = { nested: { value: 'test' } };
			const cloned = ObjectUtils.clone(original);
			expect(cloned).to.deep.equal(original);
			expect(cloned).to.not.equal(original);
			expect(cloned.nested).to.not.equal(original.nested);
		});
	});

	describe('toBoolean', () => {
		it('should convert truthy values to true', () => {
			expect(ObjectUtils.toBoolean(true)).to.equal(true);
			expect(ObjectUtils.toBoolean('true')).to.equal(true);
			expect(ObjectUtils.toBoolean(1)).to.equal(true);
			expect(ObjectUtils.toBoolean('any string')).to.equal(true);
		});

		it('should convert falsy values to false', () => {
			expect(ObjectUtils.toBoolean(false)).to.equal(false);
			expect(ObjectUtils.toBoolean('false')).to.equal(false);
			expect(ObjectUtils.toBoolean(0)).to.equal(false);
			expect(ObjectUtils.toBoolean('')).to.equal(false);
			expect(ObjectUtils.toBoolean(null)).to.equal(false);
			expect(ObjectUtils.toBoolean(undefined)).to.equal(false);
		});
	});

	describe('dedupe', () => {
		it('should dedupe array by property', () => {
			const dataset = [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
				{ id: 1, name: 'Charlie' }
			];
			const result = ObjectUtils.dedupe(dataset, 'id');
			expect(result).to.have.lengthOf(2);
			expect(result[0].name).to.equal('Alice');
			expect(result[1].name).to.equal('Bob');
		});
	});

	describe('simpleSort', () => {
		it('should sort object keys alphabetically', () => {
			const obj = { c: 3, a: 1, b: 2 };
			const result = ObjectUtils.simpleSort(obj);
			const keys = Object.keys(result);
			expect(keys).to.deep.equal(['a', 'b', 'c']);
		});
	});

	describe('includes', () => {
		it('should return true if array includes value', () => {
			const array = ['a', 'b', 'c'] as const;
			expect(ObjectUtils.includes(array, 'b')).to.equal(true);
		});

		it('should return false if array does not include value', () => {
			const array = ['a', 'b', 'c'] as const;
			expect(ObjectUtils.includes(array, 'd')).to.equal(false);
		});
	});

	describe('findDiffKeys', () => {
		it('should find keys in obj1 that are not in obj2', () => {
			const obj1 = { a: 1, b: 2, c: 3 };
			const obj2 = { a: 1, c: 3 };
			const result = ObjectUtils.findDiffKeys(obj1, obj2);
			expect(result).to.deep.equal({ b: 2 });
		});

		it('should return empty object if both objects are null/undefined', () => {
			expect(ObjectUtils.findDiffKeys(null, null)).to.deep.equal({});
			expect(ObjectUtils.findDiffKeys(undefined, undefined)).to.deep.equal({});
		});

		it('should return empty object if obj1 is null/undefined', () => {
			expect(ObjectUtils.findDiffKeys(null, { a: 1 })).to.deep.equal({});
		});
	});

	describe('serverToClientObj', () => {
		it('should convert server object with date metadata', () => {
			const obj = { createdAt: '2024-01-15' };
			const metadata = { createdAt: { type: 'date' } };
			const result = ObjectUtils.serverToClientObj<{ createdAt: Date | null }>(obj, metadata);
			expect(result.createdAt).to.be.instanceOf(Date);
		});

		it('should handle array of objects', () => {
			const obj = [{ createdAt: '2024-01-15' }, { createdAt: '2024-01-16' }];
			const metadata = { createdAt: { type: 'date' } };
			const result = ObjectUtils.serverToClientObj<Array<{ createdAt: Date | null }>>(obj, metadata);
			expect(result[0].createdAt).to.be.instanceOf(Date);
			expect(result[1].createdAt).to.be.instanceOf(Date);
		});
	});

	describe('clientToServerObj', () => {
		it('should convert dates without metadata', () => {
			const date = new Date('2024-01-15T12:00:00Z');
			const obj = { createdAt: date };
			const result = ObjectUtils.clientToServerObj(obj, null);
			expect(typeof result.createdAt).to.equal('string');
		});

		it('should convert boolean to 1/0 without metadata', () => {
			const obj = { active: true, disabled: false };
			const result = ObjectUtils.clientToServerObj(obj, null);
			expect(result.active).to.equal(1);
			expect(result.disabled).to.equal(0);
		});
	});

	describe('clientToServerProperty', () => {
		it('should convert boolean type to 1 or 0', () => {
			expect(ObjectUtils.clientToServerProperty(true, { type: 'boolean' })).to.equal(1);
			expect(ObjectUtils.clientToServerProperty(false, { type: 'boolean' })).to.equal(0);
		});

		it('should convert empty related type to null', () => {
			expect(ObjectUtils.clientToServerProperty('', { type: 'related' })).to.equal(null);
		});

		it('should return property unchanged for unknown type', () => {
			expect(ObjectUtils.clientToServerProperty('test', { type: 'unknown' })).to.equal('test');
		});
	});
});
