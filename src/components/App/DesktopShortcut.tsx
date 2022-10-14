import { memo } from "react"
import classNames from "classnames"
import type { DesktopShortcutProps } from "./interface"
import { Icon } from ".."
import styles from "./css/desktopShortcut.less"

function DesktopShortcut({
  title,
  icon,
  iconType,
  openApp,
}: DesktopShortcutProps) {
  // app 未启动时，shortcut 不能使用 useApp 除 openApp 之外的方法

  return (
    <div className={styles.shortcutWrapper}>
      <Icon
        icon={icon}
        className={styles.icon}
        maskClassName={classNames({
          [styles.iconMask]: iconType === "circle",
        })}
        onClick={openApp}
      />
      <div className={styles.title}>{title}</div>
    </div>
  )
}

export default memo(DesktopShortcut)
