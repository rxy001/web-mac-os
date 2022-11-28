import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"
import "highlight.js/styles/atom-one-dark.css"

/* eslint-disable */
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

const text = `~~~js
// webpack.configs.js
const paths = require("./paths");
const HtmlWebpackPlugin = require("html-webpack-plugin");

function config(webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  return {
    // 由于 JavaScript 既可以编写服务端代码也可以编写浏览器代码，所以 webpack 提供了多种部署 target
    // 如 node es web
    // browserslist 从 browserslist-config 中推断出平台和 ES 特性
    target: ["browserslist"],
    /*
     * development 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development. 为模块和 chunk 	   * 启用有效的名。
     * production 设置环境变量为 production，为模块和 chunk 启用确定性的混淆名称。
     * FlagIncludedChunksPlugin 为当前块中包含的所有块添加块 id 。
     * ModuleConcatenationPlugin 在过去，webpack在打包时的一个权衡是，包中的每个模块都要包装在单独的函数闭		  * 包中。这些包装器函数降低了JavaScript在浏览器中的执行速度。相比之下，像Closure Compiler和RollupJS这   	 		* 样的工具“提升”或将所有模块的作用域连接到一个闭包中，并允许你的代码在浏览器中有更快的执行时间。这个插件将在		 * webpack 中启用相同的连接行为。
     * NoEmitOnErrorsPlugin 当出现错误信息时避免发出。
     * TerserPlugin 压缩 javaScript
     */
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    // 在第一个错误出现时抛出失败结果，而不是容忍它。默认情况下，当使用 HMR 时，webpack
    // 会将在终端以及浏览器控制台中，以红色文字记录这些错误，但仍然继续进行打包。
    bail: isEnvProduction,
    // stats 选项让你更精确地控制 bundle 信息该怎么显示。
    stats: "errors-warnings",
    // 此选项控制是否生成，以及如何生成 source map。
    devtool: isEnvDevelopment ? "eval-cheap-module-source-map" : false,
    // 入口文件路径
    entry: paths.appIndexJs,
    output: {
      // 资源模块的名称
      assetModuleFilename: "static/media/[name].[hash][ext]",
      // 输出目录路径
      path: paths.appBuild,
      // 告知 webpack 在 bundle 中引入「所包含模块信息」的相关注释。
      // 此选项在 development 模式时的默认值为 true，而在 production 模式时的默认值为 false。
      pathinfo: isEnvDevelopment,
      // 资源加载的路径，基本上都为相对路径。
      publicPath: "/",
      // 每次构建清理输出目录
      clean: true,
      // 此选项不会影响那些「按需加载 chunk」的输出文件。它只影响最初加载的输出文件。
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/bundle.js",
      // 此选项决定了非初始（non-initial）chunk 文件的名称。
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : isEnvDevelopment && "static/js/[name].chunk.js",
    },
    devServer: {
      static: paths.appBuild,
    },
    optimization: {
      // 告知 webpack 当选择模块 id 时需要使用哪种算法，有易于缓存。
      // module id 会默认地基于解析顺序进行增量。
      // 默认值: deterministic 被哈希转化成的小位数值模块名。
      moduleIds: "deterministic",
      // 代码分割
      splitChunks: {
        chunks: "all",
      },
      // 提取 webpack runtime 为单个 chunk
      // https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk
      runtimeChunk: "single",
      // 告知 webpack 去辨识 package.json 中的 副作用 标记或规则，
      // 以跳过那些当导出不被使用且被标记不包含副作用的模块。
      // https://webpack.docschina.org/configuration/optimization/#optimizationsideeffects
      sideEffects: true,
      // usedExports providedExports: tree shaking 相关的属性
      // https://webpack.docschina.org/guides/tree-shaking/
      usedExports: true,
      providedExports: true,
      // 压缩代码
      minimize: true,
      // 指定压缩器
      minimizer: [
        new TerserPlugin({
          parallel: true,
        }),
      ],
    },
    resolve: {
      // 创建 import 或 require 的别名，来确保模块引入变得更简单。
      alias: {
        src: "./src",
      },
      // 解析目录时要使用的文件名。
      mainFiles: ["index"],
      // 当从 npm 包中导入模块时（例如，import * as D3 from 'd3'），此选项将决定在 package.json 中使用哪			// 个字段导入模块。
      mainFields: ["browser", "module", "main"],
      // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的			// 文件 并跳过其余的后缀。
      extensions: [".js", ".json", ".wasm"],
      // 告诉 webpack 解析模块时应该搜索的目录。
      modules: ["node_modules"],
    },
    // https://webpack.docschina.org/configuration/externals/
    externals: {},
    // https://webpack.docschina.org/configuration/cache/
    cache: {
      type: "memory",
    },
    module: {
      // 使用 loader
      rules: [],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "管理输出",
      }),
    ],
  };
}
module.exports = config("development");
~~~

~~~js
// paths.js
const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(\`\${filePath}.\${extension}\`))
  );

  if (extension) {
    return resolveFn(\`\${filePath}.\${extension}\`);
  }

  return resolveFn(\`\${filePath}.js\`);
};

module.exports = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appBuild: resolveApp("build"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appIndexJs: resolveModule(resolveApp, "src/index"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  appTsConfig: resolveApp("tsconfig.json"),
  appJsConfig: resolveApp("jsconfig.json"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveModule(resolveApp, "src/setupTests"),
  proxySetup: resolveApp("src/setupProxy.js"),
  appNodeModules: resolveApp("node_modules"),
  appWebpackCache: resolveApp("node_modules/.cache"),
  appTsBuildInfoFile: resolveApp("node_modules/.cache/tsconfig.tsbuildinfo"),
  swSrc: resolveModule(resolveApp, "src/service-worker"),
  // publicUrlOrPath,
};
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
