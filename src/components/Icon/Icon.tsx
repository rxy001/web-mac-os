import classNames from "classnames"
import { memo, useCallback, useState, useEffect } from "react"
import type { IconProps } from "./interface"
import styles from "./css"

function Icon({ onClick, className, type, mask = true, ...props }: IconProps) {
  const [maskVisible, setMaskVisible] = useState(false)
  const [isPress, setIsPress] = useState(false)

  const onMouseDown = useCallback(() => {
    if (mask) {
      setIsPress(true)
      setMaskVisible(true)
    }
  }, [mask])

  const onMouseUp = useCallback(() => {
    if (mask) {
      setIsPress(false)
      setMaskVisible(false)
    }
  }, [mask])

  const onMouseLeave = useCallback(() => {
    mask && isPress && setMaskVisible(false)
  }, [mask, isPress])

  const onMouseEnter = useCallback(() => {
    mask && isPress && setMaskVisible(true)
  }, [mask, isPress])

  useEffect(() => {
    if (mask) {
      document.addEventListener("mouseup", onMouseUp)
      return () => document.removeEventListener("mouseup", onMouseUp)
    }
  }, [onMouseUp, mask])

  return (
    <span
      className={classNames(styles.iconWrapper, className)}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      {...props}
    >
      <svg aria-hidden="true" className={classNames(styles.icon, "icon")}>
        <use xlinkHref={`#${type}`} />
      </svg>
      {mask && <div className={maskVisible ? styles.mask : ""} />}
    </span>
  )
}
export default memo(Icon)
