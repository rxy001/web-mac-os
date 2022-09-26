import { App, BottomBar } from "brc"
import styles from "./css"

const importTypora = () => import("../Typora")

function Desktop() {
  return (
    <div className={styles.desktop}>
      <div className={styles.apps}>
        <App iconType="icontype" title="typora" element={importTypora} />
      </div>
      <BottomBar />
    </div>
  )
}

export default Desktop
