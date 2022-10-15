import classNames from "classnames"
import { forwardRef } from "react"
import { Icon, Tooltip } from "../index"
import styles from "./css/dockShortcut.less"
import type { DockShortcutProps } from "./interface"

const DockShortcut = forwardRef<HTMLDivElement, DockShortcutProps>(
  ({ icon, iconType, title, id, openApp, ...props }, ref) => (
    <div className={styles.iconWrapper} {...props} ref={ref}>
      <Tooltip text={title} key={id}>
        <Icon
          maskClassName={classNames({
            [styles.iconMask]: iconType === "circle",
          })}
          className={styles.icon}
          onClick={openApp}
          icon={icon}
        />
      </Tooltip>
    </div>
  ),
)

export default DockShortcut
