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

const text = `**HTTP（超文本传输协议）**是一个用于传输超媒体文档（例如 HTML）的[应用层](https://en.wikipedia.org/wiki/Application_Layer)协议，通常是基于tcp/ip协议之上。HTTP 遵循[客户端 - 服务端模型](https://en.wikipedia.org/wiki/Client–server_model)，客户端发出请求，然后等待直到收到服务器端响应。

特点：

1. HTTP 是[无状态协议](http://en.wikipedia.org/wiki/Stateless_protocol)，这意味着服务器不会在两个请求之间保留任何数据（状态）。
2. 灵活：HTTP允许传输任意类型的数据对象。正在传输的类型由Content-Type加以标记。
3. 无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。 Keep-alive可保持持久连接.



**HTTPS** （安全的*HTTP*）是 [HTTP](https://developer.mozilla.org/zh-CN/docs/Glossary/HTTP) 协议的加密版本。它通常使用 [TLS](https://developer.mozilla.org/zh-CN/docs/Glossary/TLS) 来加密客户端和服务器之间所有的通信。这安全的链接允许客户端与服务器安全地交换敏感的数据，例如网上银行或者在线商城等涉及金钱的操作。



**区别：**

1. http明文传输，https加密传输。
2. http默认端口80， https默认端口443。



**请求方式：** head、get、post、put、delete、trace、options、patch



**三次握手作用: ** 第一次握手，S 只可以确认自己可以接受 C 发送的报文。第二次握手，C 可以确认 S 收到了自己发送的报文，并且可以确认自己可以接受 S 发送的报文。第三次握手，S 可以确认 C 收到了自己发送的报文



**WebSocket ** 是HTML5提出的一种在单个TCP连接上进行全双工通信的协议,允许服务端主动向客户端推送数据。在WebSocket API中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

向下兼容：

- 轮询：在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。
- 长轮询：在打开一条连接以后保持，等待服务器推送来数据再关闭的方式。
- iframe流：是在页面中插入一个隐藏的iframe，利用其src属性在服务器和客户端之间创建一条长链接，服务器向iframe传输数据（通常是HTML，内有负责插入信息的javascript），来实时更新页面。





​	`

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
