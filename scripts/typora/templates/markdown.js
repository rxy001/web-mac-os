// md 语法中的 ` 与 js 模板字符串 `` 冲突，所以替换掉
const { PREFIX } = require("../constants")

function markdown(md) {
  return `
  import ReactMarkdown from 'react-markdown'
  import rehypeHighlight from 'rehype-highlight'
  import remarkGfm from 'remark-gfm'
  import "highlight.js/styles/atom-one-dark.css"

  /* eslint-disable */
  const components = {
    img: ({node, ...props}) => (<img className="${PREFIX}-img" {...props} />),
    td: ({node, isHeader, ...props}) => (<td {...props} className="${PREFIX}-td" />),
    th: ({node, isHeader, ...props}) => (<th {...props} className="${PREFIX}-th" />),
    table: ({node, ...props}) => (<table {...props}  className="${PREFIX}-table" />),
    code: ({node,inline, ...props}) => (<code {...props} className={\`\${props.className?? ""} ${PREFIX}-code\`} />),
    li: ({node, ordered, inline, ...props}) => (<li {...props} className="${PREFIX}-li" />),
  }

  const text = \`${md
    .replace(/```/g, "~~~")
    .replace(/`/g, "\\`")
    .replace(/\$/g, "\\$")}\`
  
  export default function Markdown() {
    return  <ReactMarkdown 
              children={text}
              rehypePlugins={[rehypeHighlight]}
              remarkPlugins={[remarkGfm]}
              components={components}
            />
  }
  `
}

module.exports = markdown
