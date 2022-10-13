import { memo, useMemo } from "react"
import classNames from "classnames"

import type { TooltipProps } from "./interface"
import styles from "./css/tooltip.less"
import Trigger from "../Trigger"

function Tooltip({
  children,
  text,
  placement,
  trigger = "hover",
  distance = 20,
}: TooltipProps) {
  const style = useMemo(() => {
    switch (placement) {
      case "bottom":
        return {
          paddingTop: distance,
        }
      default:
        return {
          paddingBottom: distance,
        }
    }
  }, [distance, placement])

  return (
    <Trigger
      actions={trigger}
      popupPlacement={placement}
      popup={
        <div style={style}>
          <div className={styles.tooltip}>
            <div
              className={classNames(styles.arrow, {
                [styles.arrowTop]: placement === "bottom",
                [styles.arrowBottom]: placement !== "bottom",
              })}
            >
              <span
                className={classNames(styles.arrowContent, {
                  [styles.arrowContentTop]: placement === "bottom",
                  [styles.arrowContentBottom]: placement !== "bottom",
                })}
              />
            </div>
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
