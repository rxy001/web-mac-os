const fs = require("fs")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent")
const {
  override,
  overrideDevServer,
  addWebpackAlias,
  addWebpackResolve,
  addWebpackPlugin,
  setWebpackOptimizationSplitChunks,
} = require("customize-cra")
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin")

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
const webpackEnv = process.env.NODE_ENV
const isEnvProduction = webpackEnv === "production"
const isEnvDevelopment = webpackEnv === "development"

const paths = {
  appSrc: resolveApp("src"),
  brc: resolveApp("src/components"), // basic components
  utils: resolveApp("src/utils"),
  axios: resolveApp("src/axios"),
  less: resolveApp("src/less"),
  chooks: resolveApp("src/chooks"), // custom Hooks,
  slice: resolveApp("src/redux"),
  constants: resolveApp("src/constants"),
  eventEmitter: resolveApp("src/eventEmitter"),
  assets: resolveApp("src/assets"),
}

module.exports = {
  webpack: override(
    addLessLoader(),
    addWebpackResolve({
      extensions: [".mjs", ".js", ".ts", ".tsx", ".json", ".jsx"],
    }),
    addWebpackAlias({
      "@src": paths.appSrc,
      "@brc": paths.brc,
      "@utils": paths.utils,
      "@request": paths.axios,
      "@less": paths.less,
      "@chooks": paths.chooks,
      "@slice": paths.slice,
      "@constants": paths.constants,
      "@eventEmitter": paths.eventEmitter,
      "@assets": paths.assets,
    }),
    modifyHtmlWebpackPlugin(),
    addWebpackPlugin(
      new PreloadWebpackPlugin({
        rel: "preload",
        include: "initial",
        as(entry) {
          if (/\.css$/.test(entry)) return "style"
          if (/\.woff$/.test(entry)) return "font"
          if (/\.bmp$|\.gif$|\.jpe?g$|\.png$|\.svg$/.test(entry)) return "image"
          return "script"
        },
      }),
    ),
    setWebpackOptimizationSplitChunks(
      isEnvProduction && {
        chunks: "all",
        name: false,
      },
    ),
  ),
  devServer: overrideDevServer(addServerConfig()),
}

function modifyHtmlWebpackPlugin() {
  return (config) => {
    config.plugins[0].userOptions.inject = "body"
    return config
  }
}

function addServerConfig() {
  return function addServerConfigImpl(config) {
    config.proxy = {
      "/api/v1": "http://localhost:3000",
    }
    return config
  }
}

function addLessLoader() {
  return function addLessLoaderImpl(config) {
    const lessRegex = /\.less$/

    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false"
    const { publicPath } = config.output
    const shouldUseRelativeAssetPaths = publicPath === "./"

    // copy from react-scripts
    const getStyleLoaders = () => {
      const loaders = [
        isEnvDevelopment && require.resolve("style-loader"),
        isEnvProduction && {
          loader: MiniCssExtractPlugin.loader,
          options: shouldUseRelativeAssetPaths ? { publicPath: "../../" } : {},
        },
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 3,
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            modules: {
              mode: "local",
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
        },
        {
          loader: require.resolve("postcss-loader"),
          options: {
            postcssOptions: {
              ident: "postcss",
              config: false,
              plugins: [
                "postcss-flexbugs-fixes",
                [
                  "postcss-preset-env",
                  {
                    autoprefixer: {
                      flexbox: "no-2009",
                    },
                    stage: 3,
                  },
                ],
                "postcss-normalize",
              ],
              sourceMap: isEnvProduction
                ? shouldUseSourceMap
                : isEnvDevelopment,
            },
          },
        },
        {
          loader: require.resolve("resolve-url-loader"),
          options: {
            sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
            root: paths.appSrc,
          },
        },
        {
          loader: require.resolve("less-loader"),
          options: {
            sourceMap: true,
          },
        },
      ].filter(Boolean)
      return loaders
    }

    const loaders = config.module.rules.find((rule) =>
      Array.isArray(rule.oneOf),
    ).oneOf

    // Insert less-loader as the penultimate item of loaders (before file-loader)
    loaders.splice(loaders.length - 1, 0, {
      test: lessRegex,
      use: getStyleLoaders(),
    })

    return config
  }
}
