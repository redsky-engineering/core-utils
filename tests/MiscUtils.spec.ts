import { expect } from 'chai';
import { MiscUtils } from '../src/index.js';

describe('MiscUtils', () => {
	it('should SHA-256 encode a value', async function () {
		const sha256Value = await MiscUtils.sha256Encode('hello world');
		expect(sha256Value).to.equal('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
	});

	it('should SHA-256 encode an empty string', async function () {
		const sha256Value = await MiscUtils.sha256Encode('');
		expect(sha256Value).to.equal('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
	});

	it('should SHA-256 encode multi-byte characters as utf-8', async function () {
		const sha256Value = await MiscUtils.sha256Encode('héllo wörld 🌍');
		expect(sha256Value).to.equal('701aea0197ece166311a45663e52d5d580e3b5ff116dfda2724ad928e51a834a');
	});

	it('should always produce 64 lower case hex characters', async function () {
		const sha256Value = await MiscUtils.sha256Encode('a');
		expect(sha256Value).to.match(/^[0-9a-f]{64}$/);
	});
});
