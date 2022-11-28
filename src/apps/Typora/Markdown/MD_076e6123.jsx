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

const text = `#### 语言类型

js 规定了 7 中语言类型：基础类型和复杂类型。

- 基础类型： String，Number, Null, Undefined, Boolean, Symbol
- 复杂类型： Object (Array, Function 都属于 Object)

undefined 并非一个关键字，只是个全局变量（值不可修改）。 因此在局部作用域中，是可被修改的。

~~~js
(function () {
  const undefined = 1;
  console.log(undefined); // 1
})();
~~~

#### 类型转换

js 属于弱类型语音，在运算中大部分会进行类型转换。 例如：使用 "==" 进行比较时，当两个操作数类型不一样时，双等号会进行一个隐式转换，转换成相同类型再比较, 规则如下：

- 如果 x 或 y 中有一个为 NaN，则返回 false；
- 如果 x 与 y 皆为 null 或 undefined 中的一种类型，则返回 true（null == undefined // true）；否则返回 false（null == 0 // false）；
- 如果 x,y 类型不一致，且 x,y 为 String、Number、Boolean 中的某一类型，则将 x,y 使用 toNumber 函数转化为 Number 类型再进行比较；
- 如果 x，y 中有一个为 Object，会通过 valueOf()与 toString()方法转换成基础类型，在进行比较。

~~~js
var a = [];
a.valueOf(); //[]
a.toString(); //''

var a = {};
a.valueOf(); //{}
a.toStirng(); // [object Object]
~~~

其它运算，如加减乘除大于小于，也都会涉及类型转换。实际上大部分类型转换规则是非常简单的，

![image](https://static001.geekbang.org/resource/image/71/20/71bafbd2404dc3ffa5ccf5d0ba077720.jpg?ynotemdtimestamp=1656499694983)

##### StringToNumber

字符串到数字的类型转换，存在一个语法结构，类型转换支持二进制，八进制，十进制， 十六进制：

- 0b111；
- 0o13；
- 30；
- 0xFF。

JavaScript 支持的字符串语法还包括正负号科学计数法，可以使用大写或者小写的 e 表示：

- 1e3
- 1e-2

[parseInt](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseInt)和 [parseFloat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/parseFloat) 并不适用这个转换。

##### 装箱转换

装箱转换是指将基础类型转换为对应的对象（String, Number, Boolean, Symbol）。可以通过 new 或者 Object 函数进行转换。

例如

~~~js
new String("123"); // String {"123"}
Object(Symbol("abc")); // Symbol {Symbol(abc)}
~~~

在 ES6 之前，每一类装箱对象皆有私有的 Class 属性，可以通过 \`Object.prototype.toString\` 获取

~~~js
Object.prototype.toString.call([]); // '[object Array]'
~~~

但在 ES6 中，\`Symbol.toStringTag\`属性代替 Class 属性, 且可以修改此属性的值

~~~js
var a = {};

a[Symbol.toStringTag] = "xxx";

Object.prototype.toString.call(a); // '[object xxx]'
~~~

##### 拆箱转换

在 JavaScript 标准中，规定了 \`ToPrimitive\` 函数，它是对象类型到基本类型的转换（即，拆箱转换）。

在将对象转换为 String 和 Number 时候，会尝试先调用对象的 \`valueOf\` 和 \`toString\` , 如果这两种方法都不存在或者没有返回基本类型，则会报错。

在拆箱转换为 String 时候先调用 \`toString\`，Number 时先调用 \`valueOf\`

~~~js
var a = {
  valueOf() {
    console.log("valueOf");
    return 0;
  },
  toString() {
    console.log("toString");
    return "a";
  },
};

Number(a); // 'valueOf'  0
String(a); // 'toString'  'a'
~~~

在 ES6 中还可以通过修改\`Symbol.toPrimitive\`覆盖原先的默认行为。

在\`+ - * / % > < \`等运算中， 会先调用 \`valueOf \`方法
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
