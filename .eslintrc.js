module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb-base', 'plugin:flowtype/recommended'],
  env: {
    browser: true,
  },
  plugins: ['compat', 'prettier', 'flowtype'],
  rules: {
    'compat/compat': 'error',
    'prettier/prettier': 'error',
  },
};
