import { memo, useMemo, useRef, useEffect, useState } from "react"
import type { ReactElement } from "react"
import { useAppSelector, useMemoizedFn } from "@chooks"
import { findIndex, size, some } from "lodash"
import { useSpring, animated, useTransition } from "@react-spring/web"
import {
  ICON_WRAPPER_SIZE,
  DOCK_HEIGHT,
  FULLSCREEN_DURATION,
  ICON_WRAPPER_PADDING,
} from "@constants"
import { createPortal } from "react-dom"
import { selectApps } from "@slice/appsSlice"
import { useToggleVisible } from "../helper"
import { Window, Tooltip } from "../index"
import styles from "./css/dock.less"

const config = {
  duration: 200,
}

function Dock() {
  const prevAppCount = useRef(0)

  const visible = useRef(true)

  const appsInDock = useAppSelector(selectApps)

  const [springStyle, api] = useSpring(() => ({
    y: 0,
    paddingLeft: 0,
    paddingRight: 0,
    opacity: 1,
    x: "-50%",
  }))

  const mergedStyle = useMemo(
    () => ({
      ...springStyle,
      height: DOCK_HEIGHT,
      boxShadow: size(appsInDock) > 0 ? undefined : "none",
    }),
    [springStyle, appsInDock],
  )

  const [minimizedApps, setMinimizedApps] = useState<
    { appName: string; renderThumbnail: () => ReactElement }[]
  >([])

  const keepInDockTransition = useTransition(appsInDock, {
    config,
    key: (item: any) => item.appName,
    from: {
      width: 0,
      opacity: 0,
      padding: 0,
      marginBottom: 2,
    },
    enter: {
      opacity: 1,
      width: ICON_WRAPPER_SIZE,
      padding: ICON_WRAPPER_PADDING,
    },
    leave: {
      width: 0,
      opacity: 0,
      padding: 0,
    },
  })

  const minimizedTransition = useTransition(minimizedApps, {
    key: (item: any) => item.appName,
    from: {
      width: 0,
      opacity: 0,
      height: 30,
      margin: ICON_WRAPPER_PADDING,
    },
    enter: [
      {
        width: ICON_WRAPPER_SIZE,
      },

      { opacity: 1 },
    ],
    leave: [
      {
        opacity: 0,
      },
      { width: 0 },
    ],
    config: {
      duration: 150,
    },
  })

  const isShowDivider = useMemo(
    () => !!(size(minimizedApps) && size(appsInDock)),
    [appsInDock, minimizedApps],
  )

  const dividerStyle = useSpring({
    from: {
      height: 40,
    },
    to: isShowDivider
      ? {
          borderWidth: 1,
          margin: 5,
        }
      : {
          borderWidth: 0,
          margin: 0,
        },
    config: {
      duration: 150,
    },
  })

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
  useToggleVisible({ hide: hideDock, show: showDock })

  Window.useAppSubscribe(
    Window.EmitEventType.WINDOW_RENDER_THUMBNAIL,
    (appName: string, renderThumbnail: () => ReactElement) => {
      if (!some(minimizedApps, (v) => v.appName === appName)) {
        setMinimizedApps([...minimizedApps, { appName, renderThumbnail }])
      }
    },
  )

  Window.useAppSubscribe(
    Window.EmitEventType.WINDOW_REMOVE_THUMBNAIL,
    (appName: string) => {
      const index = findIndex(minimizedApps, ["appName", appName])
      if (index !== -1) {
        const temp = [...minimizedApps]
        temp.splice(index, 1)
        setMinimizedApps(temp)
      }
    },
  )

  useEffect(() => {
    const appCount = size(appsInDock)

    if (
      (prevAppCount.current > 0 && appCount === 0) ||
      (prevAppCount.current === 0 && appCount > 0)
    ) {
      if (appCount > 0) {
        api.start({
          config,
          paddingLeft: ICON_WRAPPER_PADDING,
          paddingRight: ICON_WRAPPER_PADDING,
        })
      } else if (!appCount) {
        api.start({
          config,
          paddingLeft: 0,
          paddingRight: 0,
        })
      }
    }

    prevAppCount.current = appCount
  }, [appsInDock, api, minimizedApps])

  return createPortal(
    <animated.div key="dock" style={mergedStyle} className={styles.dockWrapper}>
      <Tooltip.Group>
        {keepInDockTransition((style, item) => (
          <animated.div style={style}>{item.renderDockShortcut()}</animated.div>
        ))}
        <animated.div style={dividerStyle} className={styles.divider} />
        {minimizedTransition((style, item) => (
          <animated.div style={style}>{item.renderThumbnail()}</animated.div>
        ))}
      </Tooltip.Group>
    </animated.div>,
    document.body,
  )
}

export default memo(Dock)
