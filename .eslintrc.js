module.exports = {
  env: {
    browser: true,
    es6: true,
    webextensions: true
  },

  plugins: ["prettier"],

  rules: {
    "prettier/prettier": "error"
  },

  parserOptions: {
    sourceType: "module",
    ecmaVersion: 8
  }
};
