import { memo, useEffect, useMemo, useState, useRef } from "react"
import { useAppSelector, useMemoizedFn } from "@chooks"
import { map, size } from "lodash"
import { useSpring, animated } from "@react-spring/web"
import {
  ICON_SIZE,
  ICON_WRAPPER_WIDTH,
  DOCK_HEIGHT,
  FULLSCREEN_DURATION,
} from "@constants"
import { createPortal } from "react-dom"
import { selectApps } from "@slice/appsSlice"
import { App, Tooltip } from "../index"
import styles from "./css/dock.less"

function Dock() {
  const runningApps = useAppSelector(selectApps)

  const visible = useRef(true)

  const [springStyle, api] = useSpring(() => ({
    width: 0,
    y: 0,
    x: "-50%",
    opacity: 1,
  }))

  const [padding, setPadding] = useState("0")

  const mergedStyle = useMemo(
    () => ({ ...springStyle, padding, height: DOCK_HEIGHT }),
    [springStyle, padding],
  )

  const fullscreenApps = useRef(new Set<string>())

  const prevAppCount = useRef(0)

  const hideDock = useMemoizedFn(() => {
    if (visible.current) {
      visible.current = false
      api.start({
        y: DOCK_HEIGHT,
        opacity: 0,
        config: {
          duration: FULLSCREEN_DURATION,
        },
      })
    }
  })

  const showDock = useMemoizedFn(() => {
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

  App.useAppSubscribe(App.EventType.Fullscreen, (appName) => {
    if (!fullscreenApps.current.size) {
      hideDock()
    }
    fullscreenApps.current.add(appName)
  })

  App.useAppSubscribe(App.EventType.ExitFullScreen, (appName) => {
    fullscreenApps.current.delete(appName)
    if (!fullscreenApps.current.size) {
      showDock()
    }
  })

  App.useAppSubscribe(App.EventType.Minimize, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      showDock()
    }
  })

  App.useAppSubscribe(App.EventType.Expand, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      hideDock()
    }
  })

  App.useAppSubscribe(App.EventType.Close, (appName) => {
    if (fullscreenApps.current.delete(appName)) {
      showDock()
    }
  })

  useEffect(() => {
    const length = size(runningApps)

    if (prevAppCount.current !== length) {
      if (length > 0) {
        setPadding(`0 ${(ICON_WRAPPER_WIDTH - ICON_SIZE) / 2}px`)
      } else if (!length) {
        setPadding("0")
      }

      api.start({
        width: ICON_WRAPPER_WIDTH * length,
        config: {
          duration: 100,
        },
      })

      prevAppCount.current = length
    }
  }, [runningApps, api])

  return createPortal(
    <animated.div key="dock" style={mergedStyle} className={styles.dockWrapper}>
      <Tooltip.Group>
        {map(runningApps, ({ title, id, renderDockShortcut }) => (
          <Tooltip text={title} key={id}>
            {renderDockShortcut(ICON_WRAPPER_WIDTH, ICON_SIZE)}
          </Tooltip>
        ))}
      </Tooltip.Group>
    </animated.div>,
    document.body,
  )
}

export default memo(Dock)
