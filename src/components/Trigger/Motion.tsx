import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo,
  useLayoutEffect,
  useContext,
} from "react"
import { useUnmount, useDebounceFn, useMemoizedFn } from "@chooks"
import { useSpring, animated } from "@react-spring/web"
import type { MotionProps, CurrentMotion } from "./interface"
import { GroupContext } from "./context"

const Motion = forwardRef<HTMLDivElement, MotionProps>(
  ({ visible, children, style, className }, ref) => {
    const groupContext = useContext(GroupContext)

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
    }, 300)

    const Motion = useMemo<CurrentMotion>(
      () => ({
        cancel: () => {
          api.start({
            cancel: true,
          })
          api.start({
            opacity: 0,
            immediate: true,
            onRest: () => {
              delaySetDisplay("none")
            },
          })
        },
      }),
      [delaySetDisplay, api],
    )

    const onMotionFinished = useMemoizedFn(({ finished }) => {
      // 新的动画会导致旧的动画提前调用 onRest
      // finished 当为true时，动画既不会提前取消也不会提前停止。
      if (finished) {
        delaySetDisplay("none")
        if (groupContext) {
          groupContext.setCurrentMotion(null)
        }
      }
    })

    useLayoutEffect(() => {
      if (groupContext && visible) {
        // 当上个隐藏动画还未完成时，快速隐藏
        if (groupContext.currentMotion !== Motion) {
          groupContext.currentMotion?.cancel()
        }
        groupContext.setCurrentMotion(Motion)
      }
    }, [visible, Motion, groupContext])

    useLayoutEffect(() => {
      if (visible) {
        delaySetDisplay.cancel()
        nodeRef.current.style.display = "block"
        api.start({
          opacity: 1,
          immediate: true,
        })
      } else {
        api.start({
          opacity: 0,
          config: {
            duration: 200,
          },
          onRest: onMotionFinished,
        })
      }
    }, [api, visible, delaySetDisplay, onMotionFinished])

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
