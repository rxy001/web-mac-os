module.exports = {
  env: {
    // Browser global variables like `window` etc.
    browser: true,
    // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    commonjs: true,
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  // Our default export contains most of our ESLint rules,
  // including ECMAScript 6+ and React. It requires eslint, eslint-plugin-import, eslint-plugin-react, eslint-plugin-react-hooks, and eslint-plugin-jsx-a11y.
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  // 处理器可以从另一种文件中提取 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码。
  // 或者处理器可以在预处理中转换 JavaScript 代码。
  parser: "@typescript-eslint/parser",
  plugins: ["react", "react-hooks", "import", "@typescript-eslint"],
  root: true, // For configuration cascading.
  rules: {
    semi: 0,
    quotes: "double",
    "comma-dangle": 0,
    "no-shadow": 0,
    "no-plusplus": 0,
    "no-unused-vars": 0,
    "no-param-reassign": 0,
    "consistent-return": 0,
    "no-restricted-exports": 0,
    "no-use-before-define": 0,
    "no-return-assign": 0,
    "import/no-cycle": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": 0,
    "import/prefer-default-export": 0,
    "react-hooks/exhaustive-deps": 1,
    "react/react-in-jsx-scope": 0,
    "react/jsx-filename-extension": 0,
    "react/jsx-props-no-spreading": 0,
    "react/button-has-type": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/anchor-has-content": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/mouse-events-have-key-events": 0,
  },
  settings: {
    react: {
      version: "detect", // Detect react version
    },
  },
  // 要禁用一组文件的配置文件中的规则，请使用 overrides 和 file
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": 1,
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": 0,
        "@typescript-eslint/consistent-type-imports": 2,
        "@typescript-eslint/no-empty-function": 1,
      },
    },
  ],
}