import { expect } from 'chai';
import { MiscUtils } from '../src/index.js';

describe('MiscUtils', () => {
	it('should SHA-256 encode a value', async function () {
		const sha256Value = await MiscUtils.sha256Encode('hello world');
		expect(sha256Value).to.equal('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
	});
});
