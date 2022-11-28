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

const text = `\`any\`类型是任何类型的子类型，当一个变量声明未指定其类型且 ts 不能根据上下文推断出其类型时，它的类型就是\`any\`.

\`unknow\` 类型表示任意值。它和 \`any\` 类型很相似，但更加安全，因为对 \`unknown\` 类型的值执行任何操作都是不合法的.

\`never\`类型是任何类型的子类型，也可以赋值给任何类型；然而，*没有*类型是\`never\`的子类型或可以赋值给\`never\`类型（除了\`never\`本身之外）， 即使\`any\`也不可以赋值给\`never\`。通常可以使用 \`never\` 类型抛出异常。

~~~js
function error(message: string): never {
  throw new Error(message);
}

function get(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
~~~

#### 接口 VS 类型别名

- 接口只能声明对象的形状，无法为原始类型命名。
- 类型别名无法进行声明合并，但接口可以。
- 在报错信息中，接口的名字将始终以原始形式出现，但只限于它们作为名字被使用的时候。
- 接口会创建一个单一扁平对象类型来检测属性冲突，当有属性冲突时会提示，而交叉类型只是递归的进行属性合并，在某种情况下可能产生 \`never\` 类型
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
