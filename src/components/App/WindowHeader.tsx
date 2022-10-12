import classNames from "classnames"
import { useState } from "react"
import { useMemoizedFn } from "@chooks"
import styles from "./css/window.less"
import { Icon } from "../index"
import type { WindowHeaderProps } from "./interface"
import { useApp } from "./hooks"

function WindowHeader({ title, className, dragBind }: WindowHeaderProps) {
  const app = useApp()

  const [isHover, setIsHover] = useState(false)

  const onMouseOver = useMemoizedFn(() => setIsHover(true))

  const onMouseOut = useMemoizedFn(() => setIsHover(false))

  const fullscreen = useMemoizedFn(() => {
    if (app.isFullscreen()) {
      app.exitFullscreen()
    } else {
      app.fullscreen()
    }
  })

  const maximize = useMemoizedFn(() => {
    if (app.isMaximized()) {
      app.exitMaximize()
    } else {
      app.maximize()
    }
  })

  const renderButtonGroup = useMemoizedFn(() => (
    <div
      className={styles.operation}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <div className={styles.closeIcon} onClick={app.closeApp}>
        {isHover && (
          <Icon
            icon="iconclose1"
            className={styles.icon}
            maskClassName={styles.maskClassName}
          />
        )}
      </div>
      <div className={styles.minimizeIcon} onClick={app.minimize}>
        {isHover && (
          <Icon
            icon="iconsubtract"
            className={styles.icon}
            maskClassName={styles.maskClassName}
          />
        )}
      </div>
      <div className={styles.fullscreenIcon} onClick={fullscreen}>
        {isHover && (
          <Icon
            icon={app.isFullscreen() ? "iconnarrow" : "iconfullscreen"}
            className={styles.icon}
            maskClassName={styles.maskClassName}
          />
        )}
      </div>
    </div>
  ))

  return app.isFullscreen() ? (
    renderButtonGroup()
  ) : (
    <div className={classNames(styles.header)}>
      <span
        {...dragBind()}
        onDoubleClick={maximize}
        className={classNames(styles.title, className)}
      >
        {title}
      </span>
      {renderButtonGroup()}
    </div>
  )
}

// memo 没用，dragBind 引用在变
export default WindowHeader
