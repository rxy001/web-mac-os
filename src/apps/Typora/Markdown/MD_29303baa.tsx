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

const text = `#### 函数式组件 vs 类组件

1. 编写方式：类组件继承 React.Component，函数式组件是个函数。
2. 状态管理：类组件 this.state 和 this.SetState，函数式组件 useState。
3. 生命周期：类组件有多个生命周期 ( static getDerivedStateFromProps、render、componentDidMount、shouldComponentUpdate、getSnapshotBeforeUpdate、componentDidUpdate、componentWillUnMount )，函数式组件可通过 useEffect 模拟 didMount、didUpdate、willUnMount 生命周期。
4. 渲染时调用方式：类组件需先实例化，每次渲染调用 this.render，函数式组件每次渲染都会重新调用函数。
5. [state 和 props 的值](https://overreacted.io/zh-hans/how-are-function-components-different-from-classes/)：类组件通过 this 捕获了最新的值，而函数式组件捕获了渲染所使用的值。
6. 使用 hooks 更容易复用组件的状态逻辑，以往 class 组件是通过 renderProps hoc 解决这个问题，但过多的使用会使得代码结构变得复杂难以理解。
7. class 组件的副作用大多都是写在生命周期函数中，完全不相关的代码却在同一个方法中组合在一起。而 Hooks 可以将这些副作用拆分成多个函数，代码结构清晰。

#### 函数式组件性能优化

1. React.memo
2. 避免使用匿名函数，而使用 useCallback 去缓存函数的引用。
3. 避免使用内联对象，而使用 useMemo 去缓存对象的引用。
4. useMemo 缓存计算结果。
5. 使用 key。
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
