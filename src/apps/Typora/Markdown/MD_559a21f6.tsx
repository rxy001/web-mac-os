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

const text = `#### merge

![通过合并操作来整合分叉了的历史。](https://git-scm.com/book/en/v2/images/basic-rebase-2.png)

\`merge\` 会把两个分支的最新快照（\`C3\` 和 \`C4\`）以及二者最近的共同祖先（\`C2\`）进行三方合并，合并的结果是生成一个新的快照（并提交）。

![将 \`C4\` 中的修改变基到 \`C3\` 上。](https://git-scm.com/book/en/v2/images/basic-rebase-3.png)

#### fast-forward

当你试图合并两个分支时， 如果顺着一个分支走下去能够到达另一个分支，那么 Git 在合并两者的时候， 只会简单的将指针向前推进（指针右移），因为这种情况下的合并操作没有需要解决的分歧——这就叫做 “快进（fast-forward）”。

\`git merge --no-ff\` 可以取消 \`fast-forward\` 模式

#### rebase

\`rebase\` 首先找到这两个分支（即当前分支 \`experiment\`、变基操作的目标基底分支 \`master\`） 的最近共同祖先 \`C2\`，然后对比当前分支相对于该祖先的历次提交，提取相应的修改并存为临时文件， 然后将当前分支指向目标基底 \`C3\`, 最后以此将之前另存为临时文件的修改依序应用。

#### rebase vs merge

\`rebase vs merge \`总的原则是，只对尚未推送或分享给别人的本地修改执行 \`rebase\` 清理历史， 从不对已推送至远程仓库特别是他人开发所基于的提交执行 \`rebase\` 操作。每次 \`push\` 之前都要先进行 \`git pull --rebase remote/master\`。

在处理冲突时，由于 \`rebase\` 是将 commit 一个一个应用到目标分支，所以在产生冲突时，需要针对 commit 一个一个去解决，而 \`merge\` 是将 commit 的最终结果合并到目标分支，所以冲突只需要解决一次即可。

参考: [git book](https://git-scm.com/book/zh/v2)
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
