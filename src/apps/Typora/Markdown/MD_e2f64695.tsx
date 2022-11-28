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

const text = `#### 首屏加载时性能优化

1. [DNS 预解析](https://developer.mozilla.org/zh-CN/docs/Web/Performance/dns-prefetch)、[OSS](https://help.aliyun.com/document_detail/31817.html)、[CDN](https://developer.mozilla.org/zh-CN/docs/Glossary/CDN)。
2. 静态资源的压缩及本地缓存。
3. CSS 放在 Head 标签中，因为 CSS 的加载解析不会影响 DOM Tree 的构建，但会影响 Layout Tree 的构建，以及后续 JS 脚本的执行，阻塞页面的渲染。
4. JS 脚本的加载和执行都会影响到 DOM Tree 的构建因此放在 BODY 底部。另外可添加 Async Defer 属性，异步脚本的加载不会阻塞页面的渲染。 Defer 适用于 具有相关依赖、操作 DOM 等脚本。
5. 图片使用懒加载，WebP 代替 PNG、JPEG 格式。WebP 的优势体现在它具有更优的图像数据压缩算法，能带来更小的图片体积，而且拥有肉眼识别无差异的图像质量；同时具备了无损和有损的压缩模式、Alpha 透明以及动画的特性，在 JPEG 和 PNG 上的转化效果都相当优秀、稳定和统一。
6. 像字体、外联 CSS、脚本、首屏内的图片等优先级较高或体积较大的资源，可以通过 Link 标签的 Prefetch Preload As 属性优化加载。
7. Webpack、Vite 等构建工具实现代码分离，降低包体积。Tree Shaking，删除未引用的代码。异步加载组件实现路由及组件的懒加载，
8. 对于第三方库如 Lodash、Antd 等的按需加载。
9. 骨架屏。
10. SSR。

#### 运行时性能优化

1. 减少重排重绘。
2. 使用事件委托。
3. JavaScript 实现动画时使用 requestAnimationFrame ，保证 JavaScript 在下一帧开始运行。
4. 降低复杂性或使用 Web Worker，将长时间运行的 JavaScript 从主线程移到 Web Worker。
5. 尽量使用 Flex 或 Grid 解决布局问题，因为他们具备更好的性能。
6. 防抖、节流。

[性能优化参考](https://web.dev/learn/)

首次内容绘制 (FCP) 指标测量页面从开始加载到页面内容的任何部分在屏幕上完成渲染的时间。对于该指标，"内容"指的是文本、图像（包括背景图像）、\`<svg>\`元素或非白色的\`<canvas>\`元素。部分内容已完成渲染，但并非所有内容都已经完成渲染。

像[First Contentful Paint 首次内容绘制 (FCP)](https://web.dev/fcp/)这类以用户为中心的较新性能指标只会捕获加载体验最开始的部分。如果某个页面显示的是一段启动画面或加载指示，那么这些时刻与用户的关联性并不大。

最大内容绘制 (LCP) 指标会根据页面[首次开始加载](https://w3c.github.io/hr-time/#timeorigin-attribute)的时间点来报告可视区域内可见的最大[图像或文本块](https://web.dev/lcp/#what-elements-are-considered)完成渲染的相对时间。
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
