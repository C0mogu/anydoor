module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
    mocha: true
  },
  extends: [
    'eslint:recommended'
  ],
  globals: {
    // window: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {"no-console": [2,{
    "allow": ["erro", "warn", "info"]
  }]
  }
}
