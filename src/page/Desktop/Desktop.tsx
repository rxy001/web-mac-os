import { Dock, Topbar } from "@brc"
import { memo } from "react"
import styles from "./css/desktop.less"
import SplashScreen from "./SplashScreen"
import Typora from "../../apps/Typora"
import WeChat from "../../apps/WeChat"
import Github from "../../apps/Github"
import SystemMenu from "./SystemMenu"

const isEnvDevelopment = process.env.NODE_ENV === "development"

function Desktop() {
  return (
    <div className={styles.desktop}>
      {!isEnvDevelopment && <SplashScreen />}
      <Topbar left={<SystemMenu />} />
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
