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

const text = `#### 执行上下文

执行上下文：指代码执行所需的所有信息的集合。在任何时间点，最多只有一个运行中的执行上下文。

执行上下文栈（即调用栈）用于追踪执行上下文，运行的执行上下文总是位于栈的顶端。每当控制从与当前运行的执行上下文关联的可执行代码转移到与该执行上下文不关联的可执行代码时，就会创建一个新的执行上下文。新创建的执行上下文就会推到栈中成为运行中的执行上下文。当可执行代码运行结束后，执行上下文就会被销毁，但是闭包所产生的变量依然会存储在内存中。通常有三种方式创建执行上下文：

1. 全局上下文是为运行代码主体而创建的执行上下文，也就是说它是为那些存在于 JavaScript 函数之外的任何代码而创建的。
2. 每个函数会在执行的时候创建自己的执行上下文。
3. 使用 \`eval()\` 函数也会创建一个新的执行上下文。

执行上下文通常由以下信息所组成：

1. LexicalEnvironment：保存除 \`var\` 声明之外的变量。
2. VariableEnvironment：保存\`var\`声明的变量。
3. PrivateEnvironment：保存类创建的私有属性。
4. code evaluation state：执行、挂起和恢复与此执行上下文相关的代码求值所需的任何状态。
5. Function：执行代码是函数时，值为当前执行的函数。
6. ScriptOrModule：产生关联代码的是脚本记录还是模块记录。
7. Realm：使用的基础库和内置对象实例。
8. Generator：仅生成器上下文有这个属性，表示当前生成器。

LexicalEnvironment 和 VariableEnvironment 本质上都是 EnvironmentRecords。

EnvironmentRecords 包含了 \`this\`，\`class\` 、变量、函数等声明，以及 [[OuterEnv]] 字段，指向外部的 EnvironmentRecords。 如果当前执行代码使用了外部执行上下文中的变量，即可通过 OuterEnv 来访问。

[参考规范](https://tc39.es/ecma262/#sec-execution-contexts)

#### 作用域

作用域规定了变量访问的规则，只能访问当前作用域及外部作用域的变量。当访问未在当前作用域声明的变量时，会沿着作用域链查找(即 EnvironmentRecords.[[OuterEnv]])。另外作用域链 (scope chain) 是 es3 执行上下文的内容，在后来的 ECMA 标准中废弃了。

在 JS 中，作用域采用的是词法作用域，与之对应的是动态作用域。词法作用域是指作用域由代码中函数声明的位置来决定的，在编译阶段已经决定了，与函数调用位置无关。

~~~js
const name = "ZhangSan";
function getName() {
  console.log(name);
}

function fn() {
  const name = "LiSi";

  getName();
}

fn(); // ZhangSan
~~~

#### 变量提升

通过 \`var\` 声明的变量和函数声明会存在变量提升，即在声明之前，就可访问。这是因为在编译阶段，所有 \`var\` 声明的变量都会保存在 VariableEnvironment 中，并初始化为 **undefined**（当使用\`let const\` 时，代码在未执行到变量声明处时是不会初始化为 **undefined**）。函数声明比变量声明先提升，且重复的声明会被忽略。

~~~js
fn();
var fn = 1;
function fn() {
  console.log("fn");
}
// fn
~~~

\`var\` 缺陷：

1. 声明的全局变量会保存在 \`global\` 对象中。

2. 变量提升。

3. 本应销毁的变量没有被销毁。

   ~~~js
   for (var idx = 0; idx < 10; idx++) {}
   // 全局变量 idx: 10
   ~~~

es6 为了解决这些问题，便引入了块级作用域，即通过 \`{} let const\`便可创建块级作用域。有关块级作用域可看[此教程](https://es6.ruanyifeng.com/#docs/let)。

#### JavaScript 是如何支持块级作用域的

~~~js
var a = 1;
let b = 2;
const c = 3;
const d = 7;
{
  console.log(b); // error
  var a = 4;
  let b = 5;
  const c = 6;

  console.log(a); // 4
  console.log(b); // 5
  console.log(c); // 6
  console.log(d); // 7
}
~~~

\`var\` 变量声明保存在执行上下文的 VariableEnvironment，其他的变量声明保存在 LexicalEnvironment。在进入块级作用域时，会创建一个新的 LexicalEnvironment ，并且在块中声明的每个块作用域变量、常量、函数或类的绑定在环境记录中被实例化，[[OuterEnv]] 指向之前的 LexicalEnvironment，执行上下文的 LexicalEnvironment 会指向新的 LexicalEnvironment。因此在块级作用域内可访问外部作用域的值，并声明重复的变量名。

NOTE：无论控件如何离开块，LexicalEnvironment 总是恢复到以前的状态。

> ##### 14.2.2 Runtime Semantics: Evaluation
>
> [Block](https://tc39.es/ecma262/#prod-Block) : { }
>
> 1. Return empty.
>
> [Block](https://tc39.es/ecma262/#prod-Block) : { [StatementList](https://tc39.es/ecma262/#prod-StatementList) }
>
> 1. Let oldEnv be the [running execution context](https://tc39.es/ecma262/#running-execution-context)'s LexicalEnvironment.
> 2. Let blockEnv be [NewDeclarativeEnvironment](https://tc39.es/ecma262/#sec-newdeclarativeenvironment)(oldEnv).
> 3. Perform [BlockDeclarationInstantiation](https://tc39.es/ecma262/#sec-blockdeclarationinstantiation)([StatementList](https://tc39.es/ecma262/#prod-StatementList), blockEnv).
> 4. Set the [running execution context](https://tc39.es/ecma262/#running-execution-context)'s LexicalEnvironment to blockEnv.
> 5. Let blockValue be the result of evaluating [StatementList](https://tc39.es/ecma262/#prod-StatementList).
> 6. Set the [running execution context](https://tc39.es/ecma262/#running-execution-context)'s LexicalEnvironment to oldEnv.
> 7. Return blockValue.
>
> No matter how control leaves the [Block](https://tc39.es/ecma262/#prod-Block) the LexicalEnvironment is always restored to its former state.
>
> ##### 14.2.3 BlockDeclarationInstantiation
>
> When a [Block](https://tc39.es/ecma262/#prod-Block) or [CaseBlock](https://tc39.es/ecma262/#prod-CaseBlock) is evaluated a new [declarative Environment Record](https://tc39.es/ecma262/#sec-declarative-environment-records) is created and bindings for each block scoped variable, constant, function, or class declared in the block are instantiated in the [Environment Record](https://tc39.es/ecma262/#sec-environment-records).
>
> ##### 9.1.2.2 NewDeclarativeEnvironment ( E )
>
> The abstract operation NewDeclarativeEnvironment takes argument E (an [Environment Record](https://tc39.es/ecma262/#sec-environment-records)) and returns a [declarative Environment Record](https://tc39.es/ecma262/#sec-declarative-environment-records). It performs the following steps when called:
>
> 1. Let env be a new [declarative Environment Record](https://tc39.es/ecma262/#sec-declarative-environment-records) containing no bindings.
> 2. Set env.[[OuterEnv]] to E.
> 3. Return env.
>
> [参考规范](https://tc39.es/ecma262/#sec-block-static-semantics-early-errors)
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
