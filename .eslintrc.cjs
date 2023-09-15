/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  overrides: [
    {
      files: [
        '**/__tests__/*.spec.ts',
        'cypress/e2e/**/*.spec.ts'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ],
      rules: {
        'cypress/no-unnecessary-waiting': 'off',
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
