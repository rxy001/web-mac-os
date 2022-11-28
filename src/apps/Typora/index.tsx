import { App } from "@brc"
import { memo } from "react"
import typoraImg from "@assets/typora.png"

const importMarkdown = () => import("./Markdown")

const defaultSize = {
  width: 800,
  height: 400,
}

function Application() {
  return (
    <App
      defaultSize={defaultSize}
      icon={typoraImg}
      title="Typora"
      element={importMarkdown}
    />
  )
}

export default memo(Application)
