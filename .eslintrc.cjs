module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:@typescript-eslint/strict',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 13,
		project: './tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['import', '@typescript-eslint'],
	rules: {},
};
