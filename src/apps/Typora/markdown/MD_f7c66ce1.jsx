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

const text = `浅拷贝是复制目标对象的第一层属性的新对象，而非是 "="。“=”是赋值。

~~~js
const a = { a: 1 }

const b = a

b === a // true

//  这是赋值，而非浅拷贝
~~~

~~~js
// 浅拷贝简单实现

    function shallowCopy(src) {
        var dst = {};
        for (var prop in src) {
            if (src.hasOwnProperty(prop)) {
                dst[prop] = src[prop];
            }
        }
        return dst;
    }

const a = { a: 1 }
const b = shallowCopy(a)

a === b // false

~~~

在 js 中，浅拷贝引用类型的方法, 例如

对象：
- 扩展运算符 \`...\`
- \`Object.assign\`

数组:

- \`Array.prototype.slice\`
- \`Array.prototyoe.concat\`
- 扩展运算符 \`...\`


深拷贝就是将目标对象中所有引用类型的值，进行浅拷贝。

深拷贝可以使用 \`JSON.parse(JSON.stringify())\`，但该方法存在些问题：

- 无法拷贝 Function, Symbol, RegExp，Date 等内置对象
~~~js
const a = { a(){}, b: Symbol('b'), c: /\d/, d: new Date() }

JSON.parse(JSON.stringify(a)) // {"c":{},"d":"2018-11-07T11:03:35.109Z"}
~~~

- 不支持 NaN，Infinity, undefined 
~~~js
const a = { a: NaN, b: Infinity }  // {"a":null,"b":null}
~~~

- 循环引用报错

~~~js

const a = {}
const b = {}

a.c = b
b.e = a

// Uncaught TypeError: Converting circular structure to JSON

~~~

- 重写对象的 constructor 为 \`function Object() {}\`

  

#### \`JSON.stringify(value, replacer?, space?)\`

可选参数： 
replacer：是一个过滤函数或则一个数组包含要被 stringify 的属性名。如果没有定义，默认所有属性都被 stringify 。
space：转化后，插入每个键值对之间的分隔符。 [具体可参照](https://blog.fundebug.com/2017/08/17/what-you-didnt-know%20about-json-stringify/)

深拷贝代码 可参考 [此仓库](https://github.com/rxy001/clone)`

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
