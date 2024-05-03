module.exports = {
	ignorePatterns: ['dist', 'nexus-typegen.ts', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 13,
		project: './tsconfig.json',
		sourceType: 'module',
	},
	plugins: ['import', '@typescript-eslint'],
	rules: {},
};
