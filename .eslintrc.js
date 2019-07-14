module.exports = {
  'extends': 'airbnb',
  'parser': 'babel-eslint',
  'env': {
    'jest': true,
  },
  'rules': {
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'func-names': 'off',
    'react/no-unused-state': 'off'
  },
  'globals': {
    "fetch": false
  }
}
