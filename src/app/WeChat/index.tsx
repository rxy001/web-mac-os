import { App } from "@brc"
import wechatImg from "../../assets/wechat.png"

const importWeChat = () => import("./WeChat")

const defaultSize = {
  width: 400,
  height: 200,
}

export default function WeChat() {
  return (
    <App
      defaultSize={defaultSize}
      icon={wechatImg}
      title="wechat"
      element={importWeChat}
    />
  )
}
