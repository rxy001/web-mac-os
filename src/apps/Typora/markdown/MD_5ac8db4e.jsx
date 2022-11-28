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

const text = `通过分析webpack编译出的bundle文件，研究下webpack是如何支持\`esModules\`和\`commonjs\`

~~~
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'none'
};
// src/main.js
import a from './a.js'
const b = require('./b.js')
import c from './c.js'

console.log(a)
console.log(b)
console.log(c)
export const main = 1

// src/a.js
export default {
  a: 1
}

// src/b.js
module.exports = { b: 2 }

// src/c.js
exports.c = 3
~~~

运行\`webpack --config webpack.base.config.js\`

~~~
// dist/main.js 的大概结构：


// 数组中的函数就是导入的模块，而0, 1, 2, 3是模块的id，默认情况下，模块的 id 是这个模块在模块数组中的索引。
(function(modules){
    ...code
    return __webpack_require__(__webpack_require__.s = 0);
}(
    [
        // 0
        function (module, __webpack_exports__, __webpack_require__){
            __webpack_require__.r(__webpack_exports__)
            ...code
        }, 
        // 1
        function (module, __webpack_exports__, __webpack_require__){
            __webpack_require__.r(__webpack_exports__)
            ...code
        }, 
        // 2
        function (module, exports){},
        // 3
        function (module, exports){}
    ]  
))
~~~

如果代码中有\`import xx from 'xx.js'\` 或者\`export default (export)\` 会通过\`__webpack_require__.r(__webpack_exports__)\`将此模块标记为\`esModule\`,在\`esModule\`中是无法使用\`module.exports\`或者\`exports\`

调用\`__webpack_require__(0)\`加载id为0的模块

~~~
// The require function
 	function __webpack_require__(moduleId) {

 		// Check if module is in cache
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		// Create a new module (and put it into the cache)
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		// Execute the module function
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		// Flag the module as loaded
 		module.l = true;

 		// Return the exports of the module
 		return module.exports;
 	}
~~~

创建一个新的\`module\`，来兼容\`commonjs\`和\`esModule\`导出的数据。如何兼容，看下转译后三个模块就明白了

~~~
    /* 1 */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* harmony default export */ __webpack_exports__['default'] = {
        a: 1
      }

      /***/
    },
    /* 2 */
    /***/ function(module, exports) {
      module.exports = { b: 2 }
      /***/
    },
    /* 3 */
    /***/ function(module, exports) {
      exports.c = 1
      /***/
    }
    /******/
~~~

接上文执行\`modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)\`

~~~
function(module, __webpack_exports__, __webpack_require__) {
    'use strict'
    __webpack_require__.r(__webpack_exports__)
    
    __webpack_require__.d(__webpack_exports__, "main", function() { return main; });
    
    var _a_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1)
    var _c__WEBPACK_IMPORTED_MODULE_1__ =  __webpack_require__(3)
    var _c__WEBPACK_IMPORTED_MODULE_1___defaul= __webpack_require__.n(_c__WEBPACK_IMPORTED_MODULE_1__)
    
    const b = __webpack_require__(2)
    console.log(_a_js__WEBPACK_IMPORTED_MODULE_0__['default'])
    console.log(b)
    console.log(_c__WEBPACK_IMPORTED_MODULE_1___default.a)
    
    const main = 1
},

// define __esModule on exports
__webpack_require__.r = function(exports) {
	if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	}
	Object.defineProperty(exports, '__esModule', { value: true });
};

__webpack_require__.d = function(exports, name, getter) {
	if(!__webpack_require__.o(exports, name)) {
		Object.defineProperty(exports, name, { enumerable: trueget: getter });	
	}
};
~~~

\`main.js\`使用\`export\`导出 \`const main = 1\`，webpack通过\`__webpack_require__.d\`给\`main\`属性添加了\`getter\`, 以符合\`esModule\`输出的是值引用的规定

这里有个问题，如果是用\`import\`引入\`commonjs\`导出的模块，就会再调用\`__webpack_require__.n\`函数， 其他都是直接调用\`__webpack_require__\`，包括\`require\`.

~~~js
// getDefaultExport function for compatibility with non-harmony modules

__webpack_require__.n = function(module) {
	var getter = module && module.__esModule ?
		function getDefault() { return module['default']; } :
		function getModuleExports() { return module; };
	__webpack_require__.d(getter, 'a', getter);
	return getter;
};
~~~

然而\`_b_js__WEBPACK_IMPORTED_MODULE_1___default.a ===_b_js__WEBPACK_IMPORTED_MODULE_1__ // true\` 完全相等，调用函数n不是多此一举吗？ 而且，使用import引入es模块也未调用函数n，在下面直接访问了\`_a_js__WEBPACK_IMPORTED_MODULE_0__['default']\`，那这个函数是历史遗留问题嘛？？？

ES标准中，\`import\`输入的变量都是只读的，如果在代码中赋值给他会报错。webpack的实现是将引入的变量名都改变了，如果代码中去改变变量的值就会报错\`XX is not defined\`。\`commonjs\`并未有此限制

另外commonjs和esModule是存在差异的，具体可参考[阮一峰ES6](http://es6.ruanyifeng.com/#docs/module-loader#ES6-模块与-CommonJS-模块的差异)`

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
