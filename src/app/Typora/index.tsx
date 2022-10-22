import { App } from "@brc"
import { memo } from "react"
import typoraImg from "@assets/typora.png"

const importTypora = () => import("./Typora")

const defaultSize = {
  width: 500,
  height: 200,
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
