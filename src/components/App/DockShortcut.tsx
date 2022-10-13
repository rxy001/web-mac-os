import { forwardRef, useMemo } from "react"
import { Icon } from "../index"
import styles from "./css/app.less"
import type { DockShortcutProps } from "./interface"

const DockShortcut = forwardRef<HTMLDivElement, DockShortcutProps>(
  ({ icon, iconWrapperWidth, iconSize, openApp, ...props }, ref) => {
    const iconStyle = useMemo(
      () => ({
        width: iconSize,
        height: iconSize,
      }),
      [iconSize],
    )

    const iconWrapperStyle = useMemo(
      () => ({ width: iconWrapperWidth }),
      [iconWrapperWidth],
    )

    return (
      <div
        className={styles.iconWrapper}
        style={iconWrapperStyle}
        {...props}
        ref={ref}
      >
        <Icon image style={iconStyle} onClick={openApp} icon={icon} />
      </div>
    )
  },
)

export default DockShortcut
