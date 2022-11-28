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

const text = `#### 层叠规则

- 选择器优先级：\`!important\` > 内联样式 > id选择器> 类选择器 > 元素选择器
- 当应用两条同级别的规则到一个元素的时候，写在后面的就是实际使用的规则

在计算选择器的权重时，不允许进行进位。也就是说，无论多少个类选择器的权重叠加，都不会超过一个 ID 选择器。



#### 属性选择器

| 选择器                | 描述                                                         |
| --------------------- | :----------------------------------------------------------- |
| \`selector[attr]\`      | 选择selector所匹配的元素，且该元素拥有attr属性。             |
| \`selector[attr=val]\`  | 选择selector所匹配的元素，且该元素attr属性为val。            |
| \`selector[attr~=val]\` | 选择selector所匹配的元素，且该元素attr属性值具有多个空格分隔的值，其中一个值等于val。 |
| \`selector[attr*=val]\` | 选择selector所匹配的元素，且该元素attr属性值的任意位置包含val。 |
| \`selector[attr^=val]\` | 选择selector所匹配的元素，且该元素attr属性值以val开头。      |
| \`selector[attr\$=val]\` | 选择selector所匹配的元素，且该元素attr属性值以val结尾。      |
| \`selector[attr|=val]\` | 选择selector所匹配的元素，且该元素attr属性值为val或val-开头。 |



#### 关系选择器

子代选择器： \`div > p\`

后代选择器：\`div p\`

紧邻兄弟选择器： \`p + img\`

兄弟选择器： \` p ~ img \`



#### CSS属性值：inherit initial unset revert

**inherit: ** 继承父元素的属性值。

**initial:** css属性恢复为初始值，且去掉浏览器默认样式。

**unset:** 当前元素浏览器或用户设置的CSS忽略，然后如果是具有继承特性的CSS，如\`color\`, 则使用继承值；如果是没有继承特性的CSS属性，如\`background-color\`, 则使用初始值。

**revert:** 可以重置CSS属性为浏览器默认的样式。`

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
