import { memo, useEffect } from "react"
import { createPortal } from "react-dom"
import { TOP_BAR_HEIGHT, FULLSCREEN_DURATION } from "@constants"
import { useSpring, animated } from "@react-spring/web"
import { useMemoizedFn, useAppDispatch } from "@chooks"
import { pushTopbar, removeTopbar } from "@slice/topbarSlice"
import styles from "./css/topBar.less"

function Topbar() {
  const dispatch = useAppDispatch()

  const [style, api] = useSpring(() => ({
    y: 0,
    opacity: 1,
    height: TOP_BAR_HEIGHT,
  }))

  const hideTopbar = useMemoizedFn(() => {
    api.start({
      y: -TOP_BAR_HEIGHT,
      opacity: 0,
      config: {
        duration: FULLSCREEN_DURATION,
      },
    })
  })

  const showTopbar = useMemoizedFn(() => {
    api.start({
      y: 0,
      opacity: 1,
      config: {
        duration: FULLSCREEN_DURATION,
      },
    })
  })

  useEffect(() => {
    dispatch(
      pushTopbar({
        hideTopbar,
        showTopbar,
      }),
    )
    return () => {
      dispatch(removeTopbar())
    }
  }, [dispatch, showTopbar, hideTopbar])

  return createPortal(
    <animated.div key="topBar" style={style} className={styles.topBar}>
      <div />
    </animated.div>,
    document.body,
  )
}

export default memo(Topbar)
