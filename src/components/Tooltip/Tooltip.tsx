import { forwardRef, useMemo } from "react"
import classNames from "classnames"
import { isFunction } from "lodash"
import { useMemoizedFn } from "@chooks"
import type { TooltipProps } from "./interface"
import styles from "./css/tooltip.less"
import Trigger from "../Trigger"

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      text,
      children,

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
          return {
            paddingTop: distance,
          }
        default:
          return {
            paddingBottom: distance,
          }
      }
    }, [distance, placement])

    const renderPopup = useMemoizedFn(() => (
      <div style={style} key="popup">
        <div
          className={classNames(styles.tooltip, {
            [styles.tooltipTop]: arrow && placement === "top",
            [styles.tooltipBottom]: arrow && placement !== "top",
          })}
        >
          {arrow && (
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
          )}
          <div className={styles.content}>
            {isFunction(text) ? text() : text}
          </div>
        </div>
      </div>
    ))

    return (
      <Trigger
        ref={ref}
        action={trigger}
        popupPlacement={placement}
        defaultPopupVisible={defaultVisible}
        popup={renderPopup}
        {...props}
      >
        {children}
      </Trigger>
    )
  },
)

export default Tooltip
