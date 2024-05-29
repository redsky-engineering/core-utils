module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['<rootDir>/tests/**/*.(spec|test).[jt]s?(x)'], // Look inside the tests folder
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	}
};
