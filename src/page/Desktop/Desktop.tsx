import { App, Dock } from "@brc"
import { memo } from "react"
import styles from "./css/desktop.less"
import typoraImg from "../../assets/typora.png"
import wechatImg from "../../assets/wechat.png"
import SplashScreen from "./SplashScreen"

const importTypora = () => import("../../app/Typora")

function Desktop() {
  return (
    <div className={styles.desktop}>
      <SplashScreen />
      <div className={styles.apps}>
        <App icon={typoraImg} title="typora" element={importTypora} />
        <App icon={wechatImg} title="wechat" element="wechat" />
      </div>
      <Dock />
    </div>
  )
}

export default memo(Desktop)
