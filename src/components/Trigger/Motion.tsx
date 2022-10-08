import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo,
  useLayoutEffect,
} from "react"
import { useUnmount, useDebounceFn } from "@chooks"
import { useSpring, animated } from "@react-spring/web"
import type { MotionProps, PrevMotion } from "./interface"

let prevMotion: PrevMotion = null

const Motion = forwardRef<HTMLDivElement, MotionProps>(
  ({ visible, children, style, className, startDelay, finishDelay }, ref) => {
    const [springStyle, api] = useSpring(() => ({
      opacity: 0,
    }))

    const nodeRef = useRef<HTMLDivElement>(null as any)

    const mergedStyle = useMemo(
      () => ({ ...springStyle, ...style }),
      [springStyle, style],
    )

    const delaySetDisplay = useDebounceFn((display) => {
      if (nodeRef.current) {
        nodeRef.current.style.display = display
      }
    }, 1000)

    const Motion = useMemo(
      () => ({
        cancel: () => {
          api.start({
            immediate: true,
            opacity: 0,
            onRest() {
              delaySetDisplay("none")
            },
          })
        },
      }),
      [delaySetDisplay, api],
    )

    useLayoutEffect(() => {
      if (visible) {
        // 当上个隐藏动画还未完成时，快速隐藏
        if (prevMotion !== Motion) {
          prevMotion?.cancel()
        }
        prevMotion = Motion
      }
    }, [visible, Motion])

    useLayoutEffect(() => {
      if (visible) {
        delaySetDisplay.cancel()
        nodeRef.current.style.display = "block"
        api.start({
          opacity: 1,
          immediate: true,
          delay: startDelay,
        })
      } else {
        api.start({
          opacity: 0,
          delay: finishDelay,
          config: {
            duration: 200,
          },
          onRest: ({ finished }) => {
            if (finished) {
              delaySetDisplay("none")
              prevMotion = null
            }
          },
        })
      }
    }, [visible, delaySetDisplay, finishDelay, startDelay, api])

    useImperativeHandle(ref, () => nodeRef.current, [])

    useUnmount(() => {
      delaySetDisplay.cancel()
    })

    return (
      <animated.div ref={nodeRef} style={mergedStyle} className={className}>
        {children}
      </animated.div>
    )
  },
)

export default Motion
