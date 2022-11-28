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

const text = `#### Float

\`float\` CSS 属性指定一个元素应沿其容器的左侧或右侧放置，并从网页的文档流中移除。同时\`float\` 意味着使用块布局，在某种情况下会修改\`display\` 值的计算值：

| 指定值               | 计算值  |
| :------------------- | :------ |
| \`inline\`             | \`block\` |
| \`inline-block\`       | \`block\` |
| \`inline-table\`       | \`table\` |
| \`table-row\`          | \`block\` |
| \`table-row-group\`    | \`block\` |
| \`table-column\`       | \`block\` |
| \`table-column-group\` | \`block\` |
| \`table-cell\`         | \`block\` |
| \`table-caption\`      | \`block\` |
| \`table-header-group\` | \`block\` |
| \`table-footer-group\` | \`block\` |
| \`inline-flex\`        | \`flex\`  |
| \`inline-grid\`        | \`grid\`  |

\`float\`带来的问题：

1. 在父元素中所占的面积的有效高度为 0。
2. 非浮动元素的外边距不能用于它们和浮动元素之间来创建空间。
3. 脱离了文档流，但还占据空间。

清除\`float\`导致高度塌陷的方法：

1. 浮动元素最后添加 \`<div style="clear: both"></div>\`

2. 父元素添加 \`overflow: auto\` 或者其它除默认的 \`overflow: visible\` 以外的值（BFC）

3. ~~~css
   .clearfix::after {
     content: "";
     display: block;
     clear: both;
   }
   ~~~
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
