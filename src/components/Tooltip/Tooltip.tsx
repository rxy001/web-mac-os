import { memo } from "react"
import type { TooltipProps } from "./interface"
import styles from "./css/tooltip.less"
import Trigger from "../Trigger"

function Tooltip({ children, text }: TooltipProps) {
  return (
    <Trigger
      actions="hover"
      popup={
        <div style={{ paddingBottom: 20 }}>
          <div className={styles.tooltip}>
            <div className={styles.arrow} />
            <div className={styles.content}>{text}</div>
          </div>
        </div>
      }
    >
      {children}
    </Trigger>
  )
}

export default memo(Tooltip)
