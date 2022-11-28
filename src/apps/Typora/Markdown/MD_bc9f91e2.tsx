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

const text = `~~~js
// webpack.config.js
const path = require("path");
const H = require("html-webpack-plugin");
const C = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "[name].chunk.js",
  },
  mode: "development",
  devtool: "source-map",
  resolve: {
    mainFiles: ["index"],
  },
  plugins: [new H(), new C()],
};

// src/index.js

function component() {
  var element = document.createElement("pre");

  // lodash 是由当前 script 脚本 import 进来的
  element.innerHTML = ["Hello webpack!", "webpack Code Splitting"].join("\n\n");
  element.onclick = () => {
    import(/* webpackChunkName: "my-chunk-name" */ "./click.js").then(
      ({ onClick }) => {
        onClick();
      }
    );
  };
  return element;
}

document.body.appendChild(component());

// click.js
export const onClick = (x) => {
  console.log("onclick");
};

// main.js

function component() {
  var element = document.createElement("pre");

  // lodash 是由当前 script 脚本 import 进来的
  element.innerHTML = [
    "main.js",
    "Hello webpack!",
    "webpack Code Splitting",
  ].join("\n\n");
  element.onclick = () => {
    import(/* webpackChunkName: "child" */ "./child.js").then(({ onClick }) => {
      onClick();
    });
  };
  return element;
}

document.body.appendChild(component());

console.log("main");

// child.js
export const onClick = (x) => {
  console.log("onclick,child");
};
~~~

异步模块的加载是通过\`__webpack_require__.e\`方法实现的

~~~js
/******/ __webpack_require__.e = function requireEnsure(chunkId) {
  /******/ var promises = [];
  /******/
  /******/
  /******/ // JSONP chunk loading for javascript
  /******/
  /******/ var installedChunkData = installedChunks[chunkId];
  /******/ if (installedChunkData !== 0) {
    // 0 means "already installed".
    /******/
    /******/ // a Promise means "currently loading".
    /******/ if (installedChunkData) {
      /******/ promises.push(installedChunkData[2]);
      /******/
    } else {
      /******/ // setup Promise in chunk cache
      /******/ var promise = new Promise(function (resolve, reject) {
        /******/ installedChunkData = installedChunks[chunkId] = [
          resolve,
          reject,
        ];
        /******/
      });
      /******/ promises.push((installedChunkData[2] = promise));
      /******/
      /******/ // start chunk loading
      /******/ var script = document.createElement("script");
      /******/ var onScriptComplete;
      /******/
      /******/ script.charset = "utf-8";
      /******/ script.timeout = 120;
      /******/ if (__webpack_require__.nc) {
        /******/ script.setAttribute("nonce", __webpack_require__.nc);
        /******/
      }
      /******/ script.src = jsonpScriptSrc(chunkId);
      /******/
      /******/ onScriptComplete = function (event) {
        /******/ // avoid mem leaks in IE.
        /******/ script.onerror = script.onload = null;
        /******/ clearTimeout(timeout);
        /******/ var chunk = installedChunks[chunkId];
        /******/ if (chunk !== 0) {
          /******/ if (chunk) {
            /******/ var errorType =
              event && (event.type === "load" ? "missing" : event.type);
            /******/ var realSrc = event && event.target && event.target.src;
            /******/ var error = new Error(
              "Loading chunk " +
                chunkId +
                " failed.\n(" +
                errorType +
                ": " +
                realSrc +
                ")"
            );
            /******/ error.type = errorType;
            /******/ error.request = realSrc;
            /******/ chunk[1](error);
            /******/
          }
          /******/ installedChunks[chunkId] = undefined;
          /******/
        }
        /******/
      };
      /******/ var timeout = setTimeout(function () {
        /******/ onScriptComplete({ type: "timeout", target: script });
        /******/
      }, 120000);
      /******/ script.onerror = script.onload = onScriptComplete;
      /******/ document.head.appendChild(script);
      /******/
    }
    /******/
  }
  /******/ return Promise.all(promises);
  /******/
};
~~~

具体逻辑也很简单，当\`script\`标签添加 html 后，就去加载对应的 chunk,例如加载 child.chunk.js

~~~js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["child"],{'./src/child.js': function(){...code}])
~~~

关键点在\`window["webpackJsonp"].push\`方法，我们可以在 main.bundle.js 中找到这样一段代码:

~~~js
var jsonpArray = (window["webpackJsonp"] = window["webpackJsonp"] || []);
var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
jsonpArray.push = webpackJsonpCallback;
jsonpArray = jsonpArray.slice();
for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
var parentJsonpFunction = oldJsonpFunction;

function webpackJsonpCallback(data) {
  var chunkIds = data[0];
  var moreModules = data[1];

  // add "moreModules" to the modules object,
  // then flag all "chunkIds" as loaded and fire callback
  var moduleId,
    chunkId,
    i = 0,
    resolves = [];
  for (; i < chunkIds.length; i++) {
    chunkId = chunkIds[i];
    if (installedChunks[chunkId]) {
      resolves.push(installedChunks[chunkId][0]);
    }
    installedChunks[chunkId] = 0;
  }
  for (moduleId in moreModules) {
    if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
      modules[moduleId] = moreModules[moduleId];
    }
  }
  if (parentJsonpFunction) parentJsonpFunction(data);

  while (resolves.length) {
    resolves.shift()();
  }
}
~~~

每个\`entry chunk\`都会有 webpack runtime 代码，且都有独立的 chunk cache 和 module cache， 为了确保异步 chunk 仅加载一次且每个\`entry chunk\`要知道已经加载过的 chunk,webpack 通过以上方法同步每个\`entry chunk\`的 chunk cache

当执行 chunk 代码时，\`window["webpackJsonp"].push\`指向的是最后一个\`entry chunk\`的\`webpackJsonpCallback\`，通过\`webpackJsonpCallback\`将 chunkId，moduleId 添加到 chunk cache 中。

\`if(parentJsonpFunction) parentJsonpFunction(data);\`中\`parentJsonpFunction\` 实际是指向上一个\`entry chunk\`的\`webpackJsonpCallback\`，因此可以一直递归同步 cache，直到第一个\`entry chunk\`停止，因为第一个\`entry chunk\`的\`parentJsonpFunction\`实际上是\`window["webpackJsonp"]\`数组内置的 push 方法。
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
