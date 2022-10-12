import { memo } from "react"
import type { DesktopShortcutProps } from "./interface"
import { Icon } from ".."
import styles from "./css/desktopShortcut.less"

function DesktopShortcut({ title, icon, openApp }: DesktopShortcutProps) {
  // app 未启动时，shortcut 不能使用 useApp 除 openApp 之外的方法

  return (
    <div className={styles.shortcutWrapper}>
      <Icon image icon={icon} className={styles.icon} onClick={openApp} />
      <div className={styles.title}>{title}</div>
    </div>
  )
}

export default memo(DesktopShortcut)
