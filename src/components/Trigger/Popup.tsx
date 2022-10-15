import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
  useState,
} from "react"
import { useMemoizedFn, useMount, useResizeObserver, useUnmount } from "@chooks"
import { ceil, isEqual, max } from "lodash"
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
          left: max([triggerLeft + (triggerWidth - popupWidth) / 2, 0]) as any,
          top: triggerTop,
        }

        switch (placement) {
          case "top":
            newPosition.top = ceil(triggerTop - popupHeight)
            break

          case "bottom":
            newPosition.top = ceil(triggerTop + triggerHeight)
            break

          default:
            throw new Error(`not support placement ${placement}`)
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

    useMount(() => {
      triggerRef.current = getTriggerDOMNode()
    })

    // 如果是初次显示 useResizeObserver 调用时机太慢，导致闪烁
    useEffect(() => {
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
