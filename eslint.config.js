import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	ts.configs.strict,
	ts.configs.stylistic,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['**/*.svelte'],

		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		ignores: ['build/', 'dist/', 'functions/render', 'nexus-typegen.ts'],
	},
);
