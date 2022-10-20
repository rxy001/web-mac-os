import { memo, useRef } from "react"
import { createPortal } from "react-dom"
import { TOP_BAR_HEIGHT, FULLSCREEN_DURATION } from "@constants"
import { useSpring, animated } from "@react-spring/web"
import { useMemoizedFn } from "@chooks"
import { App } from "../index"
import styles from "./css/topBar.less"
import type { TopbarProps } from "./interface"
import { Clock, Bluetooth, Wifi, Volume, ActionCenter } from "./Widgets"

function Topbar({ left, right }: TopbarProps) {
  const visible = useRef(true)

  const [style, api] = useSpring(() => ({
    y: 0,
    opacity: 1,
    height: TOP_BAR_HEIGHT,
  }))

  const hideTopbar = useMemoizedFn(() => {
    if (visible.current) {
      visible.current = false

      api.start({
        y: -TOP_BAR_HEIGHT,
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

  App.useAppSubscribe(App.EventType.WINDOW_FULLSCREEN, (appName) => {
    if (!fullscreenApps.current.size) {
      hideTopbar()
    }
    fullscreenApps.current.add(appName)
  })

  App.useAppSubscribe(App.EventType.WINDOW_EXIT_FULLSCREEN, (appName) => {
    fullscreenApps.current.delete(appName)
    if (!fullscreenApps.current.size) {
      showTopbar()
    }
  })

  App.useAppSubscribe(App.EventType.WINDOW_MINIMIZE, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      showTopbar()
    }
  })

  App.useAppSubscribe(App.EventType.WINDOW_EXPAND, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      hideTopbar()
    }
  })

  App.useAppSubscribe(App.EventType.APP_CLOSE, (appName) => {
    if (fullscreenApps.current.delete(appName)) {
      showTopbar()
    }
  })

  return createPortal(
    <animated.div key="topBar" style={style} className={styles.topBar}>
      <div className={styles.topBarLeft}>{left}</div>
      <div className={styles.topBarRight}>
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
