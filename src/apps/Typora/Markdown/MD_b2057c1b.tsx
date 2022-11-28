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

const text = `### 事件循环 （Event Loop）

#### 1、浏览器环境

**事件循环** 是浏览器用于协调事件，用户交互，脚本，渲染，网络等行为的一种机制。一个事件循环可有一个或多个 task queues（任务队列）和一个 microtask queue（微任务队列）。task queue 是任务的 set ，而非 queue。

任务封装算法负责以下工作：

1. Events（事件）: 在一个特定的 EventTarget 对象上分派一个事件对象通常由一个专门的任务来完成。

2. Parsing（解析）: HTML 解析器对一个或多个字节进行标记，然后处理结果标记，这通常是一项任务。

3. Callbacks（回调）: 调用回调通常是由一个专门的任务来完成的。

4. Using a resource（加载资源）: 当算法获取资源时，如果获取是以非阻塞的方式进行的，那么一旦部分或全部资源可用，则执行任务对资源进行处理。

5. Reacting to DOM manipulation（响应操作 DOM）: DOM 操作而触发的任务，例如当该元素被插入到文档中时。

同时任务具备以下属性的结构：

1. Steps：任务要完成工作的一系列步骤。
2. Source：每个任务都有任务源，用于对相关任务进行分组和序列化。
3. Document: 与任务相关联的文档，对于不在 window 事件循环中的任务，则为空。
4. 脚本执行环境设置对象集合（A script evaluation environment settings object set）: 用于在任务期间跟踪脚本执行的环境设置对象。

本质上，任务源是用来区分不同类型的任务，每一个任务都来自一个特定的任务源 。在事件循环中，每个任务源必须关联特定的任务队列。例如，有一个管理鼠标和键盘事件的任务队列，以及另一个其他所有任务源关联的任务队列，然后在一次事件循环中，可以优先处理键盘和鼠标事件，保证 UI 可响应，但同时也要保证所有任务都会执行。

**Macrotask（宏任务）** 是由宿主发起的，并放入到 task queue 中。Macrotask 的任务源包括：

1. DOM 操作任务源: 此任务源被用来响应 DOM 操作(页面渲染)，例如一个元素以非阻塞的方式插入文档。

2. 用户交互任务源:此任务源用于对用户交互作出反应，例如键盘或鼠标输入。

3. 网络任务源: 此任务源被用来响应网络活动，例如 Ajax 请求。

4. 历史穿越任务源（The history traversal task source）: 例如调用 \`history.back()\`等类似 api。

**Microtask（微任务）** 是由 JavaScript 引擎发起的，并放入到 microtask queue 中。Microtask 的任务源包括：

1. [MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver)。
2. Promise。
3. [QueueMicroTask](https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide)。

##### 事件循环流程：

1. 从任务队列中取出一个**宏任务**并执行。

2. 检查微任务队列，执行并清空**微任务**队列，如果在微任务的执行中又加入了新的微任务，也会在这一步一起执行。

3. 进入更新渲染阶段，判断是否需要渲染，这里有一个 rendering opportunity 的概念，也就是说不一定每一轮 event loop 都会对应一次浏览器渲染，要根据屏幕刷新率、页面性能、页面是否在后台运行等来共同决定。

   - 浏览器会尽可能的保持帧率稳定。如果浏览器试图达到 60Hz 刷新率，那么每秒最多 60 次渲染机会（大约 16.6ms），当浏览器发现维持不了此速率，那么可能会下降到更可持续的每秒 30 次渲染机会，而不是偶尔丢帧。如果浏览器上下文不可见，那么页面会降低到每秒 4 次甚至更少的渲染机会。

   - 当某些任务相继执行，但中间可能只会穿插着微任务的执行 （没有 requestAnimationFrame ），那么任务执行中间可能不需要重新渲染。

   - 如果满足以下条件，也会跳过渲染：

     1. 浏览器判断更新渲染不会带来视觉上的改变。

     2. map of animation frame callbacks 为空，也就是帧动画回调为空，可以通过 \`requestAnimationFrame 来请求帧动画。

4. 对于需要渲染的文档，如果窗口的大小发生了变化，触发 \`onresize\` 。
5. 对于需要渲染的文档，如果页面发生了滚动，触发 \`onscroll\` 。
6. 对于需要渲染的文档，评估媒体查询并报告该文档的修改。
7. 对于需要渲染的文档，更新动画 ( web-animations ) 并发送事件。
8. 对于需要渲染的文档，如果页面进入或退出全屏，触发 \`onfullscreenchange\`。
9. 对于需要渲染的文档，执行帧动画回调，也就是 **\`requestAnimationFrame\`** 的回调。
10. 对于需要渲染的文档，执行 \`IntersectionObserver\` 的回调。
11. 对于需要渲染的文档，重新渲染文档和用户界面。
12. 判断任务队列和微任务队列是否都为空，如果是的话，则进行 \`Idle\` 空闲周期的算法，判断是否要执行 **\`requestIdleCallback\`** 的回调函数。
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
