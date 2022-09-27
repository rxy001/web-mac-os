import { App, BottomBar } from "brc"
import { memo } from "react"
import styles from "./css/desktop.less"

const importTypora = () => import("../Typora")

function Desktop() {
  return (
    <div className={styles.desktop}>
      <div className={styles.apps}>
        <App iconType="icontype" title="typora" element={importTypora} />
        <App iconType="iconweixin" title="wechat" element="wechat" />
      </div>
      <BottomBar />
    </div>
  )
}

export default memo(Desktop)
