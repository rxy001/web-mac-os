import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useMemoizedFn, useResizeObserver, useUnmount } from "@chooks"
import { ceil, isEqual } from "lodash"
import { isDOMVisible } from "@utils"
import styles from "./css/trigger.less"
import Motion from "./Motion"
import type { PopupProps } from "./interface"

const Popup = forwardRef<HTMLDivElement, PopupProps>(
  ({ visible, children, getTriggerDOMNode, placement = "top" }, ref) => {
    const [position, setPosition] = useState({
      left: 0,
      top: 0,
    })

    const prevPosition = useRef(position)

    const triggerRef = useRef<HTMLElement>()

    const motionRef = useRef<HTMLDivElement>(null as any)

    const calcPosition = useMemoizedFn(() => {
      if (triggerRef.current && motionRef.current) {
        const {
          width: triggerWidth,
          height: triggerHeight,
          top: triggerTop,
          left: triggerLeft,
        } = triggerRef.current.getBoundingClientRect()

        const { width: popupWidth, height: popupHeight } =
          motionRef.current.getBoundingClientRect()

        const newPosition = {
          left: 0,
          top: 0,
        }

        switch (placement) {
          case "top":
            newPosition.top = ceil(triggerTop - popupHeight)
            newPosition.left = triggerLeft + (triggerWidth - popupWidth) / 2
            break

          case "topLeft":
            newPosition.top = ceil(triggerTop - popupHeight)
            newPosition.left = triggerLeft
            break

          case "topRight":
            newPosition.top = ceil(triggerTop - popupHeight)
            newPosition.left = triggerLeft - (popupWidth - triggerWidth)
            break

          case "bottom":
            newPosition.top = ceil(triggerTop + triggerHeight)
            newPosition.left = triggerLeft + (triggerWidth - popupWidth) / 2
            break

          case "bottomLeft":
            newPosition.top = ceil(triggerTop + triggerHeight)
            newPosition.left = triggerLeft
            break

          case "bottomRight":
            newPosition.top = ceil(triggerTop + triggerHeight)
            newPosition.left = triggerLeft - (popupWidth - triggerWidth)
            break

          default:
            throw new Error(`not support placement ${placement}`)
        }

        const overflow =
          popupWidth + newPosition.left - document.body.clientWidth
        if (overflow > 0) {
          newPosition.left -= overflow
        }

        if (newPosition.left < 0) {
          newPosition.left = 0
        }

        if (isEqual(prevPosition.current, newPosition)) {
          return prevPosition.current
        }
        prevPosition.current = newPosition
        return newPosition
      }
      return position
    })

    useResizeObserver(getTriggerDOMNode, () => {
      isDOMVisible(motionRef.current) && setPosition(calcPosition())
    })

    useResizeObserver(motionRef, () => {
      isDOMVisible(motionRef.current) && setPosition(calcPosition())
    })

    useImperativeHandle(ref, () => motionRef.current, [])

    useLayoutEffect(() => {
      triggerRef.current = getTriggerDOMNode()
    })

    // 如果是初次显示 useResizeObserver 调用时机太慢，导致闪烁
    useLayoutEffect(() => {
      if (visible) {
        setPosition(calcPosition)
      }
    }, [calcPosition, visible])

    useUnmount(() => {
      triggerRef.current = null as any
    })

    return (
      <div className={styles.popup} key="popup">
        <Motion
          className={styles.popupWrapper}
          ref={motionRef}
          style={position}
          visible={visible}
        >
          {children}
        </Motion>
      </div>
    )
  },
)

export default Popup
