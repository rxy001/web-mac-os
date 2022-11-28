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

const text = `#### fiber

\`fiber\` 架构可以提升复杂React 应用的可响应性和性能。其最重要的特性是增量渲染，将渲染工作拆分成多块并设置优先级，分散到多个帧去执行。一个 fiber 代表了一个 **任务单元**， fiber.flags 表示任务类型， 比如更新、挂载、删除等操作。其他的核心特性还包括当新的更新到来时暂停、中止或恢复工作的能力，以及新的并发模式。

fiber 架构是 react-reconciler 的核心算法，包括 reconciliation 和 commit 两个阶段。 fiber 在这是一种数据结构，有三个指针 return child sibling，通过相互引用形成链表。在 reconcilation 阶段，存在两个 fiber 链表，current 和 workInProgress，进行 diff 找出异同，复用更新或创建新的 fiber。 在 commit 阶段会将挂载、更新、删除等应用到真实的 DOM 节点上。

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
