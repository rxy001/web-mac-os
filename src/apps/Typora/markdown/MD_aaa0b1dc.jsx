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

const text = `> ⇧⌥↓ / ⇧⌥↑ Copy line down/up
>
> ⇧⌘K Delete line
>
> ⌘Enter / ⇧⌘Enter Insert line below/above
>
> ⇧⌘\ Jump to matching bracket
>
> ⌘] / ⌘[ Indent/outdent line
>
> ⌘/ Toggle line comment
>
> ⇧⌥A Toggle block comment
>
> ⌃H delete left
>
> ⌥Backspace delete word left
>
> ⌘Backspace delete left all comment
>
> ⌃D delete right
>
> ⌥FnBackspace delete word right
>
> ⌃K delete right all comment
>
> ⇧⌘↓  cursor bottom select
>
> ⇧⌥⌘↓  cursor Column Select Down`

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
