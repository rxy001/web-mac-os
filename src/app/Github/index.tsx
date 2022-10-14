import { App } from "@brc"
import { memo } from "react"
import githubImg from "@assets/github.svg"

const importTypora = () => import("./Github")

const defaultSize = {
  width: 500,
  height: 300,
}

function Application() {
  return (
    <App
      defaultSize={defaultSize}
      icon={githubImg}
      iconType="circle"
      title="View Github"
      element={importTypora}
    />
  )
}

export default memo(Application)
