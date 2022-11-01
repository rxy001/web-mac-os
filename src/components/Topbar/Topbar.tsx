import { memo, useRef } from "react"
import { createPortal } from "react-dom"
import { TOPBAR_HEIGHT, FULLSCREEN_DURATION } from "@constants"
import { useSpring, animated } from "@react-spring/web"
import { useMemoizedFn } from "@chooks"
import { Window } from "../index"
import type { TopbarProps } from "./interface"
import { Clock, Bluetooth, Wifi, Volume, ActionCenter } from "./widgets"
import styles from "./css/topbar.less"

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

  const fullscreenApps = useRef(new Set<string>())

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_FULLSCREEN, (appName) => {
    if (!fullscreenApps.current.size) {
      hideTopbar()
    }
    fullscreenApps.current.add(appName)
  })

  Window.useAppSubscribe(
    Window.EmitEventType.WINDOW_EXIT_FULLSCREEN,
    (appName) => {
      fullscreenApps.current.delete(appName)
      if (!fullscreenApps.current.size) {
        showTopbar()
      }
    },
  )

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_MINIMIZE, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      showTopbar()
    }
  })

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_EXPAND, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      hideTopbar()
    }
  })

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_HIDDEN, (appName) => {
    if (fullscreenApps.current.delete(appName)) {
      showTopbar()
    }
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
