import classNames from "classnames"
import { useState, useEffect, forwardRef, useMemo, isValidElement } from "react"
import { useMemoizedFn, useDebounceFn } from "@chooks"
import type { IconProps } from "./interface"
import styles from "./css/icon.less"

const reg = /\.(png|jpe?g|gif|svg)(\?.*)?$/

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
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

    const onMouseDown = useDebounceFn(() => {
      if (mask) {
        setIsPress(true)
        setMaskVisible(true)
      }
    }, 30)

    const onMouseUp = useMemoizedFn(() => {
      if (mask) {
        onMouseDown.cancel()
        setIsPress(false)
        setMaskVisible(false)
      }
    })

    const onMouseEnter = useMemoizedFn(() => {
      mask && isPress && setMaskVisible(true)
    })

    const onMouseLeave = useMemoizedFn(() => {
      mask && isPress && setMaskVisible(false)
    })

    const onContextMenu = useMemoizedFn((e) => {
      e.preventDefault()
    })

    const component = useMemo(() => {
      let type = ""

      if (typeof icon === "string") {
        type = reg.test(icon) ? "img" : "icon"
      } else if (isValidElement(icon)) {
        type = "ReactElement"
      } else {
        throw new Error(`不支持 ${type}`)
      }

      switch (type) {
        case "img":
          return (
            <img
              alt="img"
              src={icon as string}
              className={classNames(styles.icon, "icon")}
            />
          )
        case "icon":
          return (
            <svg aria-hidden="true" className={classNames(styles.icon, "icon")}>
              <use xlinkHref={`#${icon}`} />
            </svg>
          )
        case "ReactElement":
          return <div className={classNames(styles.icon, "icon")}>{icon}</div>
        default:
          return null
      }
    }, [icon])

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
        onContextMenu={onContextMenu}
        {...props}
      >
        {component}
        {mask && (
          <div
            style={maskStyle}
            className={classNames(
              {
                [styles.mask]: maskVisible,
              },
              maskClassName,
            )}
          />
        )}
      </span>
    )
  },
)

export default Icon
