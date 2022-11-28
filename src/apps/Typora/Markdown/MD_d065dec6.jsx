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

const text = `1. 关于 \`webpackPreload wepbackPrefetch\` 在 webpack 4 中已支持， 但是 htmlWebpackPlugin 并不支持此功能，此 webpack api 影响性能，导致无法生成 link tag。通过 htmlWebpackPlugin 的 plugin [@vue/preload-webpack-plugin](https://www.npmjs.com/package/@vue/preload-webpack-plugin) 可解决。

   ~~~js
   // preload image
   addWebpackPlugin(
     new PreloadWebpackPlugin({
       rel: "preload",
       as: "image",
       include: "allChunks",
       fileWhitelist: [/\.bmp\$|\.gif\$|\.jpe?g\$|\.png\$/],
     })
   ),
     // prefetch async js css
     addWebpackPlugin(
       new PreloadWebpackPlugin({
         rel: "prefetch",
         include: "asyncChunks",
         fileWhitelist: [/\.js\$|\.css\$/],
         as(entry) {
           if (/\.css\$/.test(entry)) return "style";
           return "script";
         },
       })
     );

   // preload initial asset
   addWebpackPlugin(
     new PreloadWebpackPlugin({
       rel: "preload",
       include: "initial",
       as(entry) {
         if (/\.css\$/.test(entry)) return "style";
         if (/\.woff\$/.test(entry)) return "font";
         if (/\.bmp\$|\.gif\$|\.jpe?g\$|\.png\$/.test(entry)) return "image";
         return "script";
       },
     })
   );
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
