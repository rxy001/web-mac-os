// @ts-nocheck
/* eslint-disable */

import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import "highlight.js/styles/atom-one-dark.css"

const components = {
  img: ({ node, ...props }) => <img className="typora-img" {...props} />,
  td: ({ node, isHeader, ...props }) => <td {...props} className="typora-td" />,
  th: ({ node, isHeader, ...props }) => <th {...props} className="typora-th" />,
  table: ({ node, ...props }) => <table {...props} className="typora-table" />,
  code: ({ node, inline, ...props }) => (
    <code {...props} className={`${props.className ?? ""} typora-code`} />
  ),
  li: ({ node, ordered, inline, ...props }) => (
    <li {...props} className="typora-li" />
  ),
}

const text = `~~~json
module.exports = {
  env: {
    // Browser global variables like \`window\` etc.
    browser: true,
    // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    commonjs: true,
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like \`it\` etc.
    node: true, // Defines things like process.env when generating through node
  },
  extends: [
    // Our default export contains most of our ESLint rules,
    // including ECMAScript 6+ and React. It requires eslint, eslint-plugin-import, eslint-plugin-react, 		   eslint-plugin-react-hooks, and eslint-plugin-jsx-a11y.
    "airbnb",
    "airbnb/hooks",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  // 处理器可以从另一种文件中提取 JavaScript 代码，然后让 ESLint 检测 JavaScript 代码。
  // 或者处理器可以在预处理中转换 JavaScript 代码。
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  settings: {
    react: {
      version: "detect", // Detect react version
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },

    // 解决 typescript alias 的问题
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  root: true, // For configuration cascading.
  rules: {
    semi: 0,
    quotes: 0,
    "comma-dangle": 0,
    "no-shadow": 0,
    "no-plusplus": 0,
    "no-unused-vars": 0,
    "no-param-reassign": 0,
    "consistent-return": 0,
    "no-restricted-exports": 0,
    "no-use-before-define": 0,
    "no-return-assign": 0,
    "import/extensions": 0,
    "import/no-cycle": 0,
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
  // 要禁用一组文件的配置文件中的规则，请使用 overrides 和 file
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": 0,
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-unused-expressions": "off",
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unused-vars": 1,
        "@typescript-eslint/no-unused-expressions": 0,
        "@typescript-eslint/consistent-type-imports": 2,
        "@typescript-eslint/no-empty-function": 1,
      },
    },
  ],
}

~~~

~~~json
//devDependencies
{
  // ts rules
  "@typescript-eslint/eslint-plugin": "^5.38.0",
  // ts parser
  "@typescript-eslint/parser": "^5.38.0",
  "eslint": "^8.24.0",
  // js rules 包含 eslint, eslint-plugin-import, eslint-plugin-react, eslint-plugin-react-hooks, and eslint-plugin-jsx-a11y
  "eslint-config-airbnb": "^19.0.4",
  // 禁用 eslint 于 prettier 冲突 ruels
  "eslint-config-prettier": "^8.5.0",
  // ts import/export rules
  "eslint-import-resolver-typescript": "^3.5.1",
  // js import/export rules
  "eslint-plugin-import": "^2.26.0",
  // react rules
  "eslint-plugin-react": "^7.31.8",
  // react/hooks rules
  "eslint-plugin-react-hooks": "^4.6.0"
}
~~~
`

export default function Markdown() {
  return (
    <ReactMarkdown
      children={text}
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
      components={components}
    />
  )
}
