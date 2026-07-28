/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['../../.eslintrc.js', 'next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    // Next.js specific overrides
    '@next/next/no-html-link-for-pages': 'error',
    'react/display-name': 'off',
  },
};
