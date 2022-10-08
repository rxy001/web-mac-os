import {
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useMemoizedFn, useMount, useForceUpdate } from "@chooks"
import { ceil, isEqual, max } from "lodash"
import { isDOMVisible } from "@utils"
import useResizeObserver from "./useResizeObserver"
import styles from "./css/trigger.less"
import Motion from "./Motion"
import type { PopupProps } from "./interface"

const Popup = forwardRef<HTMLDivElement, PopupProps>(
  ({ visible, children, getTriggerDOMNode, placement = "top" }, ref) => {
    const forceUpdate = useForceUpdate()

    const [position, setPosition] = useState({
      left: 0,
      top: 0,
    })

    const prevPosition = useRef(position)

    const triggerRef = useRef(getTriggerDOMNode())

    const popupRef = useRef<HTMLDivElement>(null as any)

    const calcPosition = useMemoizedFn(() => {
      if (triggerRef.current && popupRef.current) {
        const {
          width: triggerWidth,
          height: triggerHeight,
          top: triggerTop,
          left: triggerLeft,
        } = triggerRef.current.getBoundingClientRect()

        const { width: popupWidth, height: popupHeight } =
          popupRef.current.getBoundingClientRect()

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

    useResizeObserver(triggerRef.current, () => {
      isDOMVisible(popupRef.current) && setPosition(calcPosition())
    })

    useResizeObserver(popupRef.current, () => {
      isDOMVisible(popupRef.current) && setPosition(calcPosition())
    })

    // 当 trigger 发生位移时需重新计算 position
    // ResizeObserver 只能监测 size 的变化
    useLayoutEffect(() => {
      setPosition(calcPosition())
    }, [visible, calcPosition])

    useImperativeHandle(ref, () => popupRef.current, [])

    useMount(forceUpdate)

    return (
      <div className={styles.popup} key="popup">
        <Motion
          className={styles.popupWrapper}
          ref={popupRef}
          style={position}
          visible={visible}
          finishDelay={200}
        >
          {children}
        </Motion>
      </div>
    )
  },
)

export default Popup
