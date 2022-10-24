import classNames from "classnames"
import { memo, useState } from "react"
import { useMemoizedFn } from "@chooks"
import styles from "./css/header.less"
import { Icon } from "../index"
import type { WindowHeaderProps } from "./interface"

function WindowHeader({
  title,
  dragBind,
  className,
  isFullscreen,
  isMaximized,
  minimize,
  exitMaximized,
  exitFullscreen,
  hideWindow,
  maximize: propsMaximize,
  fullscreen: propsFullscreen,
}: WindowHeaderProps) {
  const [isHover, setIsHover] = useState(false)

  const onMouseOver = useMemoizedFn(() => setIsHover(true))

  const onMouseOut = useMemoizedFn(() => setIsHover(false))

  const fullscreen = useMemoizedFn(() => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      propsFullscreen()
    }
  })

  const maximize = useMemoizedFn(() => {
    if (isMaximized) {
      exitMaximized()
    } else {
      propsMaximize()
    }
  })

  const renderButtonGroup = useMemoizedFn(() => (
    <div
      className={styles.operation}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <div className={styles.closeIcon} onClick={hideWindow}>
        {isHover && (
          <Icon
            icon="iconclose1"
            className={styles.icon}
            maskClassName={styles.maskClassName}
          />
        )}
      </div>
      <div className={styles.minimizeIcon} onClick={() => minimize()}>
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
            icon={isFullscreen ? "iconnarrow" : "iconfullscreen"}
            className={styles.icon}
            maskClassName={styles.maskClassName}
          />
        )}
      </div>
    </div>
  ))

  return isFullscreen ? (
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

export default memo(WindowHeader)
