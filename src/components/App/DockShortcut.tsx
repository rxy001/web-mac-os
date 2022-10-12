import { forwardRef, useMemo } from "react"
import { Tooltip, Icon } from "../index"
import styles from "./css/app.less"
import type { DockShortcutProps } from "./interface"

const DockShortcut = forwardRef<HTMLDivElement, DockShortcutProps>(
  ({ id, title, icon, iconWrapperWidth, iconSize, openApp }, ref) => {
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
      <Tooltip text={title} key={id}>
        <div className={styles.iconWrapper} style={iconWrapperStyle} ref={ref}>
          <Icon image style={iconStyle} onClick={openApp} icon={icon} />
        </div>
      </Tooltip>
    )
  },
)

export default DockShortcut
