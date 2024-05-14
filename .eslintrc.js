module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
  ],
  globals: {
    Atomics: "readonly",
    Cypress: true,
    React: true,
    ReactDOM: true,
    SharedArrayBuffer: "readonly",
    TestUtils: true,
    after: true,
    afterEach: true,
    before: true,
    beforeEach: true,
    context: true,
    cy: true,
    describe: true,
    document: true,
    expect: true,
    it: true,
    sinon: true,
    window: true,
    module: true,
    require: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: [
    "react",
    "react-hooks",
    "prettier",
    "standard",
    "import",
    "cypress",
  ],
  rules: {},
  settings: {
    extensions: [".js", ".jsx", ".gql", ".graphql"],
  },
  parser: "babel-eslint",
  rules: {
    "prettier/prettier": "error",
    "comma-dangle": 0,
    "no-cond-assign": [2, "always"],
    "no-extra-boolean-cast": 0,

    curly: 2,
    "default-case": 2,
    eqeqeq: 2,
    "no-case-declarations": 2,
    "no-else-return": 2,
    "no-fallthrough": 2,
    "no-redeclare": 2,
    "no-warning-comments": [
      1,
      {
        terms: ["todo"],
        location: "start",
      },
    ],

    "no-undef": 2,
    "no-undef-init": 2,
    "no-undefined": 2,
    "no-unused-vars": 1,

    "linebreak-style": [2, "unix"],
    quotes: [1, "double"],

    "no-var": 2,
    "prefer-const": 2,

    "reactdisplay-name": 0,
    "react/display-name": [
      0,
      {
        ignoreTranspilerName: false,
      },
    ],
    "import/no-unresolved": [
      2,
      {
        commonjs: true,
        amd: true,
      },
    ],
    "import/named": 2,
    "import/namespace": 2,
    "import/default": 2,
    "import/export": 2,

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  env: {
    es6: true,
    node: true,
    browser: true,
    jquery: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: [
    "react",
    "react-hooks",
    "prettier",
    "standard",
    "import",
    "cypress",
  ],
  settings: {
    extensions: [".js", ".jsx", ".gql", ".graphql"],
    "import/resolver": {
      webpack: {
        config: "./config/webpack/shared.js",
      },
    },
  },
};
