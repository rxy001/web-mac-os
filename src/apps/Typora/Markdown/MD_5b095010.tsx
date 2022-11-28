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

const text = `**标签**

- 新建标签：command + t
- 关闭标签：command + w
- 切换标签：command + 数字 / command + 左右方向键
- 切换全屏：command + enter
- 查找：command + f

---

**分屏**

- 垂直分屏：command + d
- 水平分屏：command + shift + d
- 切换屏幕：command + option + 方向键 command + [ 或 command + ]
- 查看历史命令：command + ;
- 查看剪贴板历史：command + shift + h

---

**其他**

- 清除当前行：ctrl + u
- 到行首：ctrl + a
- 到行尾：ctrl + e
- 前进后退：ctrl + f/b (相当于左右方向键)
- 上一条命令：ctrl + p
- 搜索命令历史：ctrl + r
- 删除当前光标的字符：ctrl + d
- 删除光标之前的字符：ctrl + h
- 删除光标之前的单词：ctrl + w
- 删除到文本末尾：ctrl + k
- 交换光标处文本：ctrl + t
- 清屏 1：command + r
- 清屏 2：ctrl + l
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
