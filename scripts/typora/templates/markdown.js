// md 语法中的 ` 与 js 模板字符串 `` 冲突，所以替换掉
// 禁用 eslint 如果添加到 .eslintignore ， 在 commit 时 lint-stage 会警告，导致提交失败
// lint-stage 可忽略文件，但麻烦

const { PREFIX } = require("../constants")

function markdown(md) {
  return `
  // @ts-nocheck
  /* eslint-disable */

  import ReactMarkdown from 'react-markdown'
  import rehypeHighlight from 'rehype-highlight'
  import remarkGfm from 'remark-gfm'
  import "highlight.js/styles/atom-one-dark.css"

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
