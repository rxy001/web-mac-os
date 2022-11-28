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

const text = `#### 从输入 url 到页面展示，中间发生了什么

首先由网络进程检查浏览器本地资源缓存，如果缓存(缓存策略有强缓存和协商缓存)可用则直接使用，没有则通过 dns 获取 ip 地址，与目的服务器经过三次握手构建 tcp 连接，然后发送 http 请求，接收数据，4 次挥手断开连接。之后网络进程会解析响应头，状态码为 301 或者 302，会重定向到新的地址。content-type 是字节流类型则交给下载管理器，如果是 text/html，则把数据传给渲染进程，渲染进程会去解析 html.css.js，生成 dom tree，然后计算节点的样式和几何位置，再生成 layout tree。由于页面中有很多复杂的动画效果或者 z-index 层叠顺序或者裁剪滚动等，渲染进程还会为特定的节点生成专用的图层，结合形成 layer tree。之后开始对图层树中的每个图层生成绘制指令，生成位图，再由浏览器主进程显示到页面中。

dns 解析： 1.浏览器缓存 2.系统缓存 3.路由器缓存 4.运营商缓存 5.根域名服务器

#### css js 阻塞

1. css 加载不会阻塞 dom 树的构建。

2. css 加载会阻塞页面渲染。

3. css 加载会阻塞后面 js 语句的执行。

4. js 执行和非异步的外联 Js 文件加载会阻塞 dom 树的构建。

#### \`async defer\` 区别

\`defer async\` 类型脚本的加载不会阻塞页面渲染。\`defer\`是在 dom 树构建完成之后，\`DOMContentLoaded\` 事件之前执行。 当有多个脚本设置\`defer\`时，将按照文档中的顺序执行。 \` async\`只要加载完成就立即执行，不会等待其他脚本或者 dom 树构建之后。

#### DOMContentLoaded 触发时机

1. 如果页面中同时存在 css 和 js，并且存在 js 在 css 后面，则 DOMContentLoaded 事件会在 css 加载完后才执行。
2. 其他情况下，DOMContentLoaded 都不会等待 css 加载，并且 DOMContentLoaded 事件也不会等待图片、视频等其他资源加载。

#### 原型链

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84d8810caa3349e989a3a6c1de44f52a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

每个实例都具有原型，实例的 \`__proto__\` 为构造函数的 \`prototype\`, 原型都为对象，因此原型的 \`__proto__\` 都为 \`Object.prototype\`，而\`Object.prototype.__proto__\` 为 \`null\`。当访问对象上某个不存在的属性时，会沿着对象的原型链查找，原型链上的原型都没有此属性则返回 \`undefined\` 。

#### CommonJS vs ES Module

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。

- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

- CommonJS 模块的\`require()\`是同步加载模块，ES6 模块的\`import\`命令是异步加载，有一个独立的模块依赖的解析阶段。

#### 闭包

在 JavaScript 中，根据词法作用域的规则，内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但是内部函数引用外部函数的变量依然保存在内存中，我们就把这些变量的集合称为闭包。

浏览器内部闭包的实现：

1. 当 JavaScript 引擎执行到函数 \`outer_fn\`时，首先会编译，并创建一个空执行上下文。
2. 在编译过程中，遇到内部函数 \`inner_fn\`，JavaScript 引擎还要对 \`inner_fn\`做一次快速的词法扫描，发现\`inner_fn\`引用了 \`outer_fn\`中的变量，所以 JavaScript 引擎判断这是一个闭包，于是在堆空间创建换一个“\`closure(outer_fn)\`”的对象（这是一个内部对象，JavaScript 是无法访问的，但在 \`chrome_devtool\`的 \`source\` 可访问），用来保存被引用的变量。
3. \`outer_fn\`执行结束，\`closure(outer_fn)\`依然存在堆空间里。当\`inner_fn\`调用时，创建的执行上下文中变量对象就包含了 \`closure(outer_fn)\` 。

使用场景：模块化、自调用函数、私有变量 (防抖、节流、柯里化)。

#### This

this，函数不同调用方式其值也会不同。箭头函数会继承其所在作用域的\`this\`。

1. \`call(obj)、bind(obj)、apply(obj) this === obj\`。

2. 通过对象调用 \`obj.fn() this === obj\`。

3. 普通调用 \`fn() this === global\` 严格模式下 \` this === undefined\`。

4. 构造函数 \`this\`指向新建的对象。

#### New

**\`new\`** 关键字会进行如下的操作：

1. 创建一个空的简单 JavaScript 对象（即\`{}\`）；

2. 为步骤 1 新创建的对象添加属性\`__proto__\`，将该属性链接至构造函数的原型对象 ；

3. 将步骤 1 新创建的对象作为\`this\`的上下文 ；

4. 如果该函数没有返回对象，则返回\`this\`。

#### 箭头函数与普通函数的区别

1. 箭头函数继承其所在作用域的\`this\`, 与其调用方式无关。\`.call()、.apply()、.bind()\` 无法改变箭头函数中 \`this\` 的指向。

   ~~~js
   function fn() {
     let arrowFn = () => {
       console.log(this);
     };
     arrowFn();
     return arrowFn;
   }
   let obj = {};

   fn.call(obj); // this === obj
   let arrowFn = fn(); // this === global

   obj.arrowFn = arrowFn;
   obj.arrowFn(); // this === global
   ~~~

2. 因为自身没有\`prototype \`与内置的 [[Construct]] 方法，箭头函数不能作为构造函数使用。

3. 箭头函数没有 \`arguments\`。

4. 箭头函数不能用作 Generator 函数。

#### 柯里化函数

~~~js
  function curry(fn) {
    return function curried(...args1) {
      if (args1.length >= fn.length) {
        return fn.apply(this, args1);
      } else {
        return function (...args2) {
          return curried.apply(this, args1.concat(args2));
        };
      }
    };
  }·
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
