import classNames from "classnames"
import { useState, useEffect, forwardRef, useMemo, isValidElement } from "react"
import { useMemoizedFn } from "@chooks"
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
      onMouseDown: propsOnMouseDown,
      onMouseUp: propsOnMouseUp,
      onMouseEnter: propsOnMouseEnter,
      onMouseLeave: propsOnMouseLeave,
      onContextMenu: propsOnContextMenu,
      ...props
    },
    ref,
  ) => {
    const [maskVisible, setMaskVisible] = useState(false)
    const [isPress, setIsPress] = useState(false)

    const onMouseDown = useMemoizedFn((e) => {
      if (mask) {
        setIsPress(true)
        setMaskVisible(true)
      }
      propsOnMouseDown?.(e)
    })

    const onMouseUp = useMemoizedFn((e) => {
      if (mask) {
        setIsPress(false)
        setMaskVisible(false)
      }
      propsOnMouseUp?.(e)
    })

    const onMouseEnter = useMemoizedFn((e) => {
      mask && isPress && setMaskVisible(true)
      propsOnMouseEnter?.(e)
    })

    const onMouseLeave = useMemoizedFn((e) => {
      mask && isPress && setMaskVisible(false)
      propsOnMouseLeave?.(e)
    })

    const onContextMenu = useMemoizedFn((e) => {
      propsOnContextMenu?.(e)
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
