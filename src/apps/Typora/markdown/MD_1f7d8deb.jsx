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

const text = `### BFC（Block Formatting Context）

创建一个独立的渲染区域，并规定了 block-level box 如何布局，且与这个区域外部毫不相关。

BFC 布局规则如下(注意 BFC 只影响块儿级盒)：

- 内部 Box 按垂直方向一个接一个的放置
- Box 垂直方向的距离由 margin 值决定，并且属于同一个 BFC 的两个相邻的 box 垂直方向的 margin 值会重叠，取最大值 (margin 重叠)
- 每个元素的 margin-box 的左边与父元素 border-box 的右边相接触
- BFC 的区域不会与外部浮动盒子重叠
- BFC 就是一个隔绝的容器，容器里面的子元素不影响外面元素的布局。（margin 塌陷）
- 计算 BFC 的高度时，浮动元素也参与计算

下列方式会创建块格式化上下文：

- 根元素（\`<html>\`）
- 浮动元素（\`float\` 值不为 \`none\`）
- 绝对定位元素（\`position\` 值为 \`absolute\` 或 \`fixed\`）
- 行内块元素（\`display\` 值为 \`inline-block\`）
- 表格单元格（\`display\` 值为 \`table-cell\`，HTML 表格单元格默认值）
- 表格标题（\`display\` 值为 \`table-caption\`，HTML 表格标题默认值）
- 匿名表格单元格元素（\`display\` 值为 \`table\`、\`table-row\`、 \`table-row-group\`、\`table-header-group\`、\`table-footer-group\`（分别是 HTML table、tr、tbody、thead、tfoot 的默认值）或 \`inline-table\`）
- \`overflow\` 值不为 \`visible\`、\`clip\` 的块元素
- \`display\` 值为 \`flow-root\` 的元素
- \` contain\` 值为 \`layout\`、\`content\` 或 \`paint\` 的元素
- 弹性元素（\`display\` 值为 \`flex\` 或 \`inline-flex\` 元素的直接子元素），如果它们本身既不是 \`flex\`、\`grid\` \`table\` 容器
- 网格元素（\`display\`值为 \`grid\` 或 \`inline-grid\` 元素的直接子元素），如果它们本身既不是 \`flex\`、\`grid\` \`table\` 容器

#### BFC 的应用

- 自适应两栏布局
  - 利用的是 BFC 不与浮动元素重叠的特性
- 清除浮动
  - 利用 BFC 内浮动元素也参与 BFC 高度计算的特性
- 解决 margin 塌陷
  - 子元素的 margin-top 传递到父级
- 防止 margin 重叠
  - 因为 BFC 内相邻元素的 margin 值会重叠，如果给其中一个元素包一层，并设置为 BFC，又因为 BFC 内子元素的布局与外部元素互不影响的特性，就可以解决重叠的问题
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
