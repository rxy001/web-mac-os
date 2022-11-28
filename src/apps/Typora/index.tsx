import { App } from "@brc"
import { memo } from "react"
import typoraImg from "@assets/typora.png"

const importTypora = () => import("./markdown")

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
      element={importTypora}
    />
  )
}

export default memo(Application)
