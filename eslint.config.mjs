export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      // sensible defaults for small projects
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'error'
    }
  }
];