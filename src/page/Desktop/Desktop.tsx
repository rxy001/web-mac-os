import { Dock, Topbar } from "@brc"
import { memo } from "react"
import styles from "./css/desktop.less"
import SplashScreen from "./SplashScreen"
import Typora from "../../app/Typora"
import WeChat from "../../app/WeChat"
import Github from "../../app/Github"

function Desktop() {
  return (
    <div className={styles.desktop}>
      <SplashScreen />
      <Topbar />
      <div className={styles.apps}>
        <Github />
        <Typora />
        <WeChat />
      </div>
      <Dock />
    </div>
  )
}

export default memo(Desktop)
