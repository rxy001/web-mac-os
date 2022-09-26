import classNames from "classnames"
import { useState, useCallback, useContext, memo } from "react"
import { useGesture } from "@use-gesture/react"
import styles from "./css/window.less"
import { Icon } from "../index"
import type { WindowHeaderProps } from "./interface"
import { AppContext } from "./context"

function WindowHeader({
  title,
  className,
  isFullscreen,
  collapse,
  fullscreen,
  ...props
}: WindowHeaderProps) {
  const { closeApp } = useContext(AppContext)

  const [isHover, setIsHover] = useState(false)

  const dragBing = useGesture({
    onDrag({ event }) {
      event.stopPropagation()
    },
    onDragStart({ event }) {
      event.stopPropagation()
    },
    onDragEnd({ event }) {
      event.stopPropagation()
    },
  })

  const onMouseOver = useCallback(() => setIsHover(true), [])

  const onMouseOut = useCallback(() => setIsHover(false), [])

  const renderButtonGroup = useCallback(
    () => (
      <div
        className={styles.operation}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        {...dragBing()}
      >
        <div className={styles.closeIcon} onClick={closeApp}>
          {isHover && <Icon type="iconclose1" className={styles.icon} />}
        </div>
        <div className={styles.collapseIcon} onClick={collapse}>
          {isHover && <Icon type="iconsubtract" className={styles.icon} />}
        </div>
        <div className={styles.fullscreenIcon} onClick={fullscreen}>
          {isHover && (
            <Icon
              type={isFullscreen ? "iconnarrow" : "iconfullscreen"}
              className={styles.icon}
            />
          )}
        </div>
      </div>
    ),
    [
      isHover,
      collapse,
      fullscreen,
      onMouseOut,
      onMouseOver,
      closeApp,
      dragBing,
      isFullscreen,
    ],
  )

  return isFullscreen ? (
    renderButtonGroup()
  ) : (
    <div className={classNames(styles.header)} {...props}>
      <span className={classNames(styles.title, className)}>{title}</span>
      {renderButtonGroup()}
    </div>
  )
}

export default memo(WindowHeader)
