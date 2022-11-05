import { memo, useRef } from "react"
import { createPortal } from "react-dom"
import { TOPBAR_HEIGHT, FULLSCREEN_DURATION } from "@constants"
import { useSpring, animated } from "@react-spring/web"
import { useMemoizedFn } from "@chooks"
import type { TopbarProps } from "./interface"
import { Clock, Bluetooth, Wifi, Volume, ActionCenter } from "./widgets"
import styles from "./css/topbar.less"
import { useToggleVisible } from "../helper"

function Topbar({ left, right }: TopbarProps) {
  const visible = useRef(true)

  const [style, api] = useSpring(() => ({
    y: 0,
    opacity: 1,
    height: TOPBAR_HEIGHT,
  }))

  const hideTopbar = useMemoizedFn(() => {
    if (visible.current) {
      visible.current = false

      api.start({
        y: -TOPBAR_HEIGHT,
        opacity: 0,
        config: {
          duration: FULLSCREEN_DURATION,
        },
      })
    }
  })

  const showTopbar = useMemoizedFn(() => {
    if (!visible.current) {
      visible.current = true

      api.start({
        y: 0,
        opacity: 1,
        config: {
          duration: FULLSCREEN_DURATION,
        },
      })
    }
  })

  useToggleVisible({
    hide: hideTopbar,
    show: showTopbar,
  })

  return createPortal(
    <animated.div style={style} className={styles.topbar}>
      <div className={styles.topbarLeft}>{left}</div>
      <div className={styles.topbarRight}>
        {right}
        <Volume />
        <Bluetooth />
        <Wifi />
        <ActionCenter />
        <Clock />
      </div>
    </animated.div>,
    document.body,
  )
}

export default memo(Topbar)
