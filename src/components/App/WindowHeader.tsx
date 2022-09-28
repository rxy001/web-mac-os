import classNames from "classnames"
import { useState, useContext } from "react"
import { useMemoizedFn } from "@chooks"
import styles from "./css/window.less"
import { Icon } from "../index"
import type { WindowHeaderProps } from "./interface"
import { AppContext } from "./context"

function WindowHeader({
  title,
  className,
  windowHandler,
  ...props
}: WindowHeaderProps) {
  const { closeApp } = useContext(AppContext)

  const [isHover, setIsHover] = useState(false)

  const onMouseOver = useMemoizedFn(() => setIsHover(true))

  const onMouseOut = useMemoizedFn(() => setIsHover(false))

  const fullscreen = useMemoizedFn(() => {
    if (windowHandler.isFullscreen) {
      windowHandler.exitFullscreen()
    } else {
      windowHandler.fullscreen()
    }
  })

  const expandToViewport = useMemoizedFn(() => {
    if (windowHandler.isExpandToViewport) {
      windowHandler.exitViewport()
    } else {
      windowHandler.expandToViewport()
    }
  })

  const renderButtonGroup = useMemoizedFn(() => (
    <div
      className={styles.operation}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <div className={styles.closeIcon} onClick={closeApp}>
        {isHover && (
          <Icon
            icon="iconclose1"
            className={styles.icon}
            maskClassName={styles.maskClassName}
          />
        )}
      </div>
      <div className={styles.collapseIcon} onClick={windowHandler.collapse}>
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
            icon={windowHandler.isFullscreen ? "iconnarrow" : "iconfullscreen"}
            className={styles.icon}
            maskClassName={styles.maskClassName}
          />
        )}
      </div>
    </div>
  ))

  return windowHandler.isFullscreen ? (
    renderButtonGroup()
  ) : (
    <div className={classNames(styles.header)}>
      <span
        {...props}
        onDoubleClick={expandToViewport}
        className={classNames(styles.title, className)}
      >
        {title}
      </span>
      {renderButtonGroup()}
    </div>
  )
}

// 不需要 memo， windowHandler 引用不会变，可能会获取不到最新的状态值
export default WindowHeader
