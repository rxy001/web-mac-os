import classNames from "classnames"
import { memo, useState, useEffect, forwardRef } from "react"
import { useMemoizedFn } from "@chooks"
import type { IconProps } from "./interface"
import styles from "./css/icon.less"

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      image,
      icon,
      style,
      onClick,
      className,
      maskStyle,
      maskClassName,
      mask = true,
      ...props
    },
    ref,
  ) => {
    const [maskVisible, setMaskVisible] = useState(false)
    const [isPress, setIsPress] = useState(false)

    const onMouseDown = useMemoizedFn(() => {
      if (mask) {
        setIsPress(true)
        setMaskVisible(true)
      }
    })

    const onMouseUp = useMemoizedFn(() => {
      if (mask) {
        setIsPress(false)
        setMaskVisible(false)
      }
    })

    const onMouseLeave = useMemoizedFn(() => {
      mask && isPress && setMaskVisible(false)
    })

    const onMouseEnter = useMemoizedFn(() => {
      mask && isPress && setMaskVisible(true)
    })

    useEffect(() => {
      if (mask) {
        document.addEventListener("mouseup", onMouseUp)
        return () => document.removeEventListener("mouseup", onMouseUp)
      }
    }, [onMouseUp, mask])

    return (
      <span
        ref={ref}
        style={style}
        className={classNames(styles.iconWrapper, className)}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        {...props}
      >
        {image ? (
          <img
            src={icon}
            alt="img"
            className={classNames(styles.icon, "icon")}
          />
        ) : (
          <svg aria-hidden="true" className={classNames(styles.icon, "icon")}>
            <use xlinkHref={`#${icon}`} />
          </svg>
        )}
        {mask && (
          <div
            style={maskStyle}
            className={classNames(
              maskVisible ? styles.mask : "",
              maskClassName,
            )}
          />
        )}
      </span>
    )
  },
)

export default Icon
