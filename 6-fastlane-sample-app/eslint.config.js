const prettierConfig = require('./.prettierrc.json');

module.exports = {
  files: [
    "paypal/server/node/**/*.js",
    "braintree-sdk/server/node/**/*.js",
    "braintree-graphql/server/node/**/*.js",
    "paypal/client/**/*.js",
    "braintree-sdk/client/**/*.js",
    "braintree-graphql/client/**/*.js"
  ],
  ignores: ["node_modules/**"],
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: {
    prettier: require("eslint-plugin-prettier"),
  },
  rules: {
    "prettier/prettier": ["error", prettierConfig],
    "indent": ["error", 2],
    "semi": ["error", "always"],
    "quotes": ["error", "single"],
    "no-unused-vars": ["error"],
  },
};
