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

    const popupRef = useRef<HTMLDivElement>(null as any)

    const calcPosition = useMemoizedFn(() => {
      if (triggerRef.current && motionRef.current) {
        const {
          width: triggerWidth,
          height: triggerHeight,
          top: triggerTop,
          left: triggerLeft,
        } = triggerRef.current.getBoundingClientRect()

        const { width: motionWidth, height: motionHeight } =
          motionRef.current.getBoundingClientRect()

        const { top: popupTop, left: popupLeft } =
          popupRef.current.getBoundingClientRect()

        const newPosition = {
          left: 0,
          top: 0,
        }

        const top = () => ceil(triggerTop - motionHeight - popupTop)
        const bottom = () => ceil(triggerTop + triggerHeight - popupTop)
        const left = () =>
          ceil(triggerLeft + (triggerWidth - motionWidth) / 2 - popupLeft)
        const right = () =>
          ceil(triggerLeft + triggerWidth - motionWidth - popupLeft)

        switch (placement) {
          case "top":
            newPosition.top = top()
            newPosition.left = left()
            break

          case "topLeft":
            newPosition.top = top()
            newPosition.left = triggerLeft
            break

          case "topRight":
            newPosition.top = top()
            newPosition.left = right()
            break

          case "bottom":
            newPosition.top = bottom()
            newPosition.left = left()
            break

          case "bottomLeft":
            newPosition.top = bottom()
            newPosition.left = triggerLeft
            break

          case "bottomRight":
            newPosition.top = bottom()
            newPosition.left = right()
            break

          default:
            throw new Error(`not support placement ${placement}`)
        }

        // const overflow =
        //   motionWidth + newPosition.left - document.body.clientWidth
        // if (overflow > 0) {
        //   newPosition.left -= overflow
        // }

        // if (newPosition.left < 0) {
        //   newPosition.left = 0
        // }

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
      <div ref={popupRef} className={styles.popup} key="popup">
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
