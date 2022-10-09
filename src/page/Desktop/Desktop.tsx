import { App, Dock, Topbar } from "@brc"
import { memo } from "react"
import { useOnAppFullScreen } from "@chooks"
import styles from "./css/desktop.less"
import typoraImg from "../../assets/typora.png"
import wechatImg from "../../assets/wechat.png"
import SplashScreen from "./SplashScreen"

const importTypora = () => import("../../app/Typora")

function Desktop() {
  useOnAppFullScreen()

  return (
    <div className={styles.desktop}>
      <SplashScreen />
      <Topbar />
      <div className={styles.apps}>
        <App icon={typoraImg} title="typora" element={importTypora} />
        <App icon={wechatImg} title="wechat" element="wechat" />
      </div>
      <Dock />
    </div>
  )
}

export default memo(Desktop)
