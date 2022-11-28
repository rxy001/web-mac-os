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

const text = `#### 块级盒子(block box) 和 内联盒子(inline box)

这两种盒子会在**页面流**（page flow）和**元素之间的关系**方面表现出不同的行为：

块级盒子（block）：

- 继承父元素的宽。
- 每个盒子都会换行。
- \`width\`和 \`height\`属性可以发挥作用。
- padding，margin，border 会将其他元素从当前盒子周围“推开”。

内联盒子（inline）：

- 盒子不会产生换行。
- \`width\`和 \`height\` 属性将不起作用。
- 垂直方向的 padding，margin，border 会被应用但是不会把其他处于 \`inline\` 状态的盒子推开。
- 水平方向的 padding，margin，border 会被应用且会把其他处于 \`inline\` 状态的盒子推开。

#### css 盒模型

完整的 CSS 盒模型应用于块级盒子，内联盒子只使用盒模型中定义的部分内容。模型定义了盒的每个部分：**margin, border, padding, and content** ，盒模型分标准 \`(content-box)\` 和 ie \`(border-box)\` 两种。

CSS 中组成一个块级盒子需要：

- **Content box**: 这个区域是用来显示内容，大小可以通过设置 \`width\`和 \`height\`.
- **Padding box**: 包围在内容区域外部的空白区域； 大小通过 \`padding\` 相关属性设置。
- **Border box**: 边框盒包裹内容和内边距。大小通过 \`border\` 相关属性设置。
- **Margin box**: 这是最外面的区域，是盒子和其他元素之间的空白区域。大小通过 \`margin\` 相关属性设置。

![盒模型](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model/box-model.png)

在标准模型中，如果你给盒设置 \`width\` 和 \`height\`，实际设置的是 \`content box\`。 \`padding + border + margin + width/height \` 等于盒子真实的宽高。而 ie 模型中， 设置的 \`width\` 和 \`height\`就等于真实宽高， \`content box = width/height - margin - border - padding\` 。
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
