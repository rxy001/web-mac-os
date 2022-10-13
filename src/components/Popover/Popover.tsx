import { memo, useMemo } from "react"
import { Trigger } from "../index"
import type { PopoverProps } from "./interface"
import styles from "./css/popover.less"

function Popover({
  children,
  visible,
  trigger,
  placement,
  content,
  onVisibleChange,
}: PopoverProps) {
  const popup = useMemo(
    () => <div className={styles.popup}>{content}</div>,
    [content],
  )

  return (
    <Trigger
      visible={visible}
      onVisibleChange={onVisibleChange}
      popup={popup}
      popupPlacement={placement}
      actions={trigger}
    >
      {children}
    </Trigger>
  )
}

export default memo(Popover)
