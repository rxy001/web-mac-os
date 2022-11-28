import { forwardRef, useMemo, useRef } from "react"
import classNames from "classnames"
import { isFunction } from "lodash"
import type { TooltipProps } from "./interface"
import styles from "./css/tooltip.less"
import Trigger from "../Trigger"

// 此值为 arrowSize 的 1/2
const BASE_DIST = 6

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      text,
      children,
      className,
      defaultVisible,
      placement = "top",
      arrow = true,
      trigger = "hover",
      distance = 0,
      ...props
    },
    ref,
  ) => {
    const style = useMemo(() => {
      switch (placement) {
        case "bottom":
        case "bottomLeft":
        case "bottomRight":
          return {
            paddingTop: BASE_DIST + distance,
          }
        default:
          return {
            paddingBottom: BASE_DIST + distance,
          }
      }
    }, [distance, placement])

    const container = useRef<HTMLDivElement>(null as any)

    // todo: popup 如果通过 getPopupContainer 挂载到 dock 容器里， backdrop-filter 不生效. body 中可行
    const popup = useMemo(
      () => (
        <div style={style} key="popup">
          <div ref={container} className={classNames(styles.tooltip)}>
            {arrow && (
              <div
                className={classNames(styles.arrow, {
                  [styles.arrowTop]: placement === "bottom",
                  [styles.arrowTopLeft]: placement === "bottomLeft",
                  [styles.arrowTopRight]: placement === "bottomRight",
                  [styles.arrowBottom]: placement === "top",
                  [styles.arrowBottomLeft]: placement === "topLeft",
                  [styles.arrowBottomRight]: placement === "topRight",
                })}
              >
                <span
                  className={classNames(styles.arrowContent, {
                    [styles.arrowContentTop]: placement.startsWith("bottom"),
                    [styles.arrowContentBottom]: placement.startsWith("top"),
                  })}
                />
              </div>
            )}
            <div className={classNames(styles.content, className)}>
              {isFunction(text) ? text() : text}
            </div>
          </div>
        </div>
      ),
      [arrow, className, placement, style, text],
    )

    return (
      <Trigger
        ref={ref}
        action={trigger}
        popupPlacement={placement}
        defaultPopupVisible={defaultVisible}
        popup={popup}
        {...props}
      >
        {children}
      </Trigger>
    )
  },
)

export default Tooltip
