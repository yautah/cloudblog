module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },

  globals: {
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    wx: true,
    getApp: true,
    getCurrentPages: true,
  },

  rules: {
    'no-var': 1,
    'no-const-assign': 2,
    'no-dupe-class-members': 2,
    'no-unused-vars': 'warn',
  },
}
