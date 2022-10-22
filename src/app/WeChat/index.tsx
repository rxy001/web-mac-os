import { App } from "@brc"
import { memo } from "react"
import wechatImg from "@assets/wechat.png"

const importWeChat = () => import("./WeChat")

const defaultSize = {
  width: 400,
  height: 200,
}

function Application() {
  return (
    <App
      defaultSize={defaultSize}
      icon={wechatImg}
      title="WeChat"
      element={importWeChat}
    />
  )
}

export default memo(Application)
