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

const text = `### 强缓存

**expires:** GMT 格式的绝对时间，比如 Expires:Mon,18 Oct 2066 23:59:59 GMT。这个时间代表着这个资源的失效时间，在此时间之前，即命中缓存。这种方式有一个明显的缺点，由于失效时间是一个绝对时间，所以当服务器与客户端时间偏差较大时，就会导致缓存混乱。

**cache-control:** 主要是利用该字段的 **max-age** 值来进行判断，它是一个**相对时间**，例如 \`Cache-Control:max-age=3600\`，代表着资源的有效期是 3600 秒。还有一些其他[常用的值](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)：

_no-cache_： 进行协商缓存，发送请求到服务器确认是否使用缓存。

_no-store_：禁止使用缓存，每一次都要重新请求数据。

_public_：可以被所有的用户缓存，包括终端用户和代理服务器。

_private_：只能被终端用户的浏览器缓存，不允许代理服务器缓存。

_s-maxage_: 覆盖 max-age 或者 Expires 头，但是仅适用于共享缓存 (比如各个代理)，私有缓存会忽略它。

### 协商缓存

**last-modified：** 标识该资源的最后修改时间。当浏览器再次请求该资源时，request 的请求头中会包含 **if-modified-since**，该值为之前返回的 **last-modified**。之后服务器会根据资源的 **last-modified** 判断是否命中缓存。

缺点：

1. 秒以下的时间内资源发生了改变，Last-Modified 并不会发生变化。
2. 某些服务器不能精确的得到文件的最后修改时间。
3. 内容未发生变化，只是最后修改时间变了，不希望重新获取

**etag：** 资源的唯一标识码，通常是根据资源内容生成的 hash 值。当浏览器再次请求该资源时，request 的请求头中会包含 **if-none-match**，该值为之前返回的 **etag**。之后服务器会根据资源的**etag**判断是否命中缓存。

#### 缓存优先级：

**cache-control** > **expires** > **etag/if-none-match** > **last-modified/if-modified-since**
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
