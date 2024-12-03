import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	...tseslint.configs.recommended,
	prettier,
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{
		ignores: ['dist/']
	},
	{
		languageOptions: {
			globals: globals.browser
		}
	},
	{
		rules: {
			// Allow unused variables starting with exactly one underscore.
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_[^_].*$|^_$',
					varsIgnorePattern: '^_[^_].*$|^_$',
					caughtErrorsIgnorePattern: '^_[^_].*$|^_$'
				}
			],
			// Allow namespace usage
			'@typescript-eslint/no-namespace': 'off'
		}
	}
];
