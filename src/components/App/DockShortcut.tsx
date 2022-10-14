import classNames from "classnames"
import { forwardRef, useMemo } from "react"
import { Icon } from "../index"
import styles from "./css/dockShortcut.less"
import type { DockShortcutProps } from "./interface"

const DockShortcut = forwardRef<HTMLDivElement, DockShortcutProps>(
  ({ icon, iconType, iconWrapperWidth, iconSize, openApp, ...props }, ref) => {
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
        <Icon
          maskClassName={classNames({
            [styles.iconMask]: iconType === "circle",
          })}
          style={iconStyle}
          onClick={openApp}
          icon={icon}
        />
      </div>
    )
  },
)

export default DockShortcut
