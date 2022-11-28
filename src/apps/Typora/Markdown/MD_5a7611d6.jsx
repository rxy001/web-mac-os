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

const text = `#### 1. 术语

1. "prmoise" 是一个拥有符合本规范的 then 方法的对象或者函数。
2. "thenable" 是一个定义了 then 方法的对象或者函数。
3. "value" 是 JavaScript 的任意合法值(包括 undefined, thenable, promise)。
4. "exception" 是一个用 throw 语句抛出的 value 。
5. "reason" 是一个表示 promise 被 rejected 的 value 。

#### 2. 要求

1. **promise 的状态**

   pormise 必须是以下三个状态之一: pending, fulfilled, rejected.

   1. 当 promise 处于 pending 状态时:
      1. 可以转换到 fulfilled 或 rejected 状态。
   2. 当 promise 处于 fulfilled 状态时:
      1. 不能转换到其他状态。
      2. 必须有一个 value ，并且不能改变。
   3. 当 promise 处于 rejected 状态时：
      1. 不能转换到其他状态。
      2. 必须有 reason ，并且不能改变。

2. **then 方法**

   promise 必须提供一个 then 方法，能由此去访问当前或最终的 value 或者 reason 。

   pormise 的 then 方法， 接受两个参数：

   \`promise.then(onFulfilled, onRejected)\`

   1. \`onFulfilled\` 和 \`onRejected\` 都是可选参数。

      1. 如果 \`onFulfilled\` 不是函数，则忽略。
      2. 如果 \`onRejected\` 不是函数，则忽略。

   2. 如果 \`onFulfilled\` 是一个函数:

      1. 它必须在 \`promise\` 被 \`fulfilled\` 后，以 \`promise\` 的 \`value\` 作为第一个参数调用。
      2. 它不能在 \`promise\` 被 \`fulfilled\` 之前调用。
      3. 它不能被调用多次。

   3. 如果 \`onRejected\` 是一个函数:

      1. 它必须在 \`promise\` 被 \`rejected\` 后，以 \`promise\` 的 \`reason\` 作为第一个参数调用。
      2. 它不能能在 \`promise\` 被 \`rejected\` 之前调用。
      3. 它不能被调用多次。

   4. 当执行上下文栈只包含平台代码， \`onFulfilled\` 或者 \`onRejected\` 不能被调用[^1]

   5. \`onFulfilled\` 或者 \`onRejected\` 必须以函数形式调用（即不能有\`this\`值）[^2]

   6. \`then\` 方法可以被同一个 \`promise\` 调用多次。

      1. 如果或者当 \`promise\` 处于 \`fulfilled\` 状态， 所有各自的 \`onFulfilled\` 回调函数，必须要按照 \`then\` 注册的顺序被调用。
      2. 如果或者当 \`promise\` 处于 \`rejected\` 状态， 所有各自的 \`onRejected\` 回调函数，必须要按照 \`then\` 注册的顺序被调用。

   7. \`then\` 方法必须要返回 \`promise\` [^3]:

      \`promise2 = promise1.then(onFulfilled, onRejected);\`

      1. 如果 \`onFulfilled\` 或者 \`onRejected\` 返回一个值 \`x\` ，则执行 **Promise Resolution Procedure** \`[[Resolve]](promise2, x)\`.
      2. 如果 \`onFulfilled\` 或者 \`onRejected\` 抛出异常 \`e\` ， \`promise2\` 必须以 \`e\` 作为 reason ，转到 rejected 状态。
      3. 如果 \`onFulfilled\` 不是函数，并且 \`promise1\` 处于 fulfilled 状态 ，则 \`promise2\` 必须以与 \`promise1\` 同样的 value 被 fulfilled 。
      4. 如果 \`onRejected\` 不是函数，并且 \`promise1\` 处于 rejected 状态 ，则 \`promise2\` 必须以与 \`promise1\` 同样的 reason 被 rejected 。

3. **Promise Resolution Procedure**

   Promise Resolution Procedure 是一个抽象操作。它以一个 promise 和一个 value 作为输入，记作：\`[[Resolve]](promise, x)\` 。 如果 \`x\` 是一个 thenable , 它会尝试让 promise 变成与 x 的一样状态 ，前提 x 是一个类似的 promise 对象。否则，它会让 promise 以 \`x\` 作为 value 转为 fulfilled 状态。

   这种对 thenables 的处理允许不同的 promise 进行互操作，只要它们暴露一个符合 Promises/A+ 的 then 方法。它还允许 Promises/A+ 实现使用合理的 then 方法“同化”不一致的实现。

   \`[[Resolve]](promise, x)\` 执行以下步骤:

   1. 如果 \`promise\` 和 \`x\` 引用的是同一个对象，则以一个 \`TypeError\` 作为 reason 让 \`promise\` 转为 rejeted 状态。

   2. 如果 \`x\` 也是一个 promise ，则让 \`promise\` 接受它的状态[^4]:

      1. 如果 \`x\` 处于 pending 状态，\`promise\` 必须保持 pending 状态，直到 \`x\` 变成 fulfilled 或者 rejected 状态，\`promise\` 才同步改变。
      2. 如果或者当 \`x\` 处于 fulfilled 状态， 以同样的 value 让 \`promise\` 也变成 fulfilled 状态。
      3. 如果或者当 \`x\` 处于 rejected 状态， 以同样的 reason 让 \`promise\` 也变成 rejected 状态。

      ~~~js
      const promise1 = new Promise(function (res, rej) {
        setTimeout(() => {
          rej("error");
        }, 3000);
      });

      const promise2 = new Promise((res, rej) => {
        setTimeout(() => {
          res(promise1);
        }, 1000);
      });

      // promise2 <rejected>: error
      ~~~

   3. 如果 \`x\` 是一个对象或者函数。

      1. 令 \`then\` 等于 \`x.then\`。[^5]

      2. 如果读取 \`x.then\` 抛出异常 \`e\` ， 以 \`e\` 作为 reason 让 \`promise\` 变成 rejected 状态。

         ~~~js
         const obj = {};

         Object.defineProperty(obj, "then", {
           get: () => {
             throw "error";
           },
         });

         const promise = new Promise((res, rej) => {
           res(obj);
         });

         // promise <rejected>: 'error'
         ~~~

      3. 如果 \`then\` 是一个函数，以 \`x\` 作为 \`this\` 调用它，传入第一个参数 \`resolvePromise\` ， 第二个参数 \`rejectPromise\` 。

         1. 如果 \`resolvePromise\` 被传入 \`y\` 调用， 则执行 \`[[Resolve]](promise, y)\`。
         2. 如果 \`rejectedPromise\` 被传入 \`r\` 调用，则用，\`r\` 作为 reason 让 \`promise\` 变成 rejected 状态。
         3. 如果 \`resolvePromise\` 和 \`rejectPromise\` 都被调用了，或者被调用多次了。只有第一次调用生效，其余会被忽略。
         4. 如果调用 \`then\` 抛出异常 \`e\` ,
            1. 如果 \`resolvepromise\` 或 \`rejectPromise\` 已经被调用过了，则忽略它。
            2. 否则, 以 \`e\` 作为 reason 让 \`promise\` 变成 rejected 状态。

         ~~~js
         // 可分别测试 1、2、3、4 情况

         const obj = {
           then(res, rej) {
             console.log(this);
             res("value1");
             res("value2");
             rej("reason");
             throw "error";
           },
         };

         const promise = new Promise((res, rej) => {
           res(obj);
         });
         ~~~

      4. 如果 \`then\` 不是一个函数，以 \`x\` 作为 value 让 \`promise\` 变成 fulfilled 状态。

   4. 如果 \`x\` 不是对象或函数， 以 \`x\` 作为 value 让 \`promise\` 变成 fulfilled 状态。

如果一个 promise 被一个循环的 thenable 链中的对象 resolved，而 \`[[Resolve]](promise, thenable)\` 的递归性质又使得其被再次调用，根据上述的算法将会陷入无限递归之中。算法虽不强制要求，但也鼓励实现者检测这样的递归是否存在，并且以 \`TypeError\` 作为 reason 拒绝 promise [^6]。

#### 3. 备注

[^1]: 这里的**平台代码**指的是引擎、环境以及 promise 实现代码。实践中要确保 \`onFulfilled\` 和 \`onRejected\` 方法异步执行，且应该在 \`then\` 方法被调用的事件循环之后及新执行栈中执行。这可以通过 “macro-task” 或者 “micro-task” 来实现。由于 promise 的实现本身就是平台代码，因此 handler 在调用时可能包含一个任务调度队列。
[^2]: 也就是说在**严格模式（strict）**中，函数 \`this\` 的值为 \`undefined\` ；在非严格模式中其为全局对象。
[^3]: 代码实现在满足所有要求的情况下可以允许 \`promise2 === promise1\` 。每个实现都要文档说明其是否允许以及在何种条件下允许 \`promise2 === promise1\` 。
[^4]: 总体来说，只有 \`x\` 符合当前实现，我们才认为它是真正的 promise 。这一规则允许使用特殊实现来接受符合已知要求的 promises 状态。
[^5]: 这步我们先是存储了一个指向 \`x.then\` 的引用，然后测试并调用该引用，以避免多次访问 \`x.then\` 属性。这样的预防措施在面对访问器属性的确保一致性很重要，访问器属性的值可能会在检索期间发生变化。
[^6]: 实现不应该对 _thenable_ 链的深度随意设限，并假定超出该限制的递归就是无限循环。只有真正的循环递归才应能导致 \`TypeError\` 异常；如果无限长的链上 _thenable_ 均不相同，循环永远是正确的行为。
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
