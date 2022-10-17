import { memo, useMemo, useRef, useEffect } from "react"
import { useAppSelector, useMemoizedFn } from "@chooks"
import { map, size } from "lodash"
import { useSpring, animated } from "@react-spring/web"
import {
  ICON_WRAPPER_SIZE,
  DOCK_HEIGHT,
  FULLSCREEN_DURATION,
  ICON_WRAPPER_PADDING,
} from "@constants"
import { createPortal } from "react-dom"
import { selectApps } from "@slice/appsSlice"
import { App, Tooltip } from "../index"
import styles from "./css/dock.less"

const iconWrapperStyle = {
  width: ICON_WRAPPER_SIZE,
  height: DOCK_HEIGHT - ICON_WRAPPER_PADDING * 2,
  padding: ICON_WRAPPER_PADDING,
  flex: "none",
  marginBottom: 5,
}

function Dock() {
  const runningApps = useAppSelector(selectApps)

  const visible = useRef(true)

  const [springStyle, api] = useSpring(() => ({
    width: 0,
    y: 0,
    paddingLeft: 0,
    paddingRight: 0,
    x: "-50%",
    opacity: 1,
  }))

  const mergedStyle = useMemo(
    () => ({
      ...springStyle,
      height: DOCK_HEIGHT,
    }),
    [springStyle],
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
      const config = {
        duration: 200,
      }
      if (length > 0) {
        api.start({
          width: ICON_WRAPPER_SIZE * length,
          paddingLeft: ICON_WRAPPER_PADDING,
          paddingRight: ICON_WRAPPER_PADDING,
          config,
        })
      } else if (!length) {
        api.start({
          width: 0,
          paddingLeft: 0,
          paddingRight: 0,
          config,
        })
      }

      prevAppCount.current = length
    }
  }, [runningApps, api])

  return createPortal(
    <animated.div key="dock" style={mergedStyle} className={styles.dockWrapper}>
      <Tooltip.Group>
        {map(runningApps, ({ id, renderDockShortcut }) => (
          <div key={id} style={iconWrapperStyle}>
            {renderDockShortcut()}
          </div>
        ))}
      </Tooltip.Group>
    </animated.div>,
    document.body,
  )
}

export default memo(Dock)
