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
import { Window, Tooltip } from "../index"
import styles from "./css/dock.less"

const THUMBNAIL_WIDTH = 60

const iconWrapperStyle = {
  padding: ICON_WRAPPER_PADDING,
  height: ICON_WRAPPER_SIZE,
  width: ICON_WRAPPER_SIZE,
  marginBottom: 5,
}

const thumbnailStyle = {
  padding: ICON_WRAPPER_PADDING,
  height: 40,
  width: THUMBNAIL_WIDTH,
  marginBottom: 5,
}

const dividerStyle = {
  height: ICON_WRAPPER_SIZE,
  margin: `0 ${ICON_WRAPPER_PADDING}px`,
}

const springConfig = (width: number) => ({
  key: (item: any) => item.appName,
  from: {
    width: 0,
    opacity: 0,
    overflow: "hidden",
  },
  enter: { width, opacity: 1 },
  leave: {
    width: 0,
    opacity: 0,
  },
  config: {
    duration: 150,
  },
})

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

  const minimizedTransitions = useTransition(
    minimizedApps,
    springConfig(THUMBNAIL_WIDTH),
  )

  const keepInDockTransitions = useTransition(
    appsInDock,
    springConfig(ICON_WRAPPER_SIZE),
  )

  const fullscreenApps = useRef(new Set<string>())

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

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_FULLSCREEN, (appName) => {
    if (!fullscreenApps.current.size) {
      hideDock()
    }
    fullscreenApps.current.add(appName)
  })

  Window.useAppSubscribe(
    Window.EmitEventType.WINDOW_EXIT_FULLSCREEN,
    (appName) => {
      fullscreenApps.current.delete(appName)
      if (!fullscreenApps.current.size) {
        showDock()
      }
    },
  )

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_MINIMIZE, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      showDock()
    }
  })

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_EXPAND, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      hideDock()
    }
  })

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_HIDDEN, (appName) => {
    if (fullscreenApps.current.delete(appName)) {
      showDock()
    }
  })

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

    const config = {
      duration: 200,
    }

    if (
      (prevAppCount.current > 0 && appCount === 0) ||
      (prevAppCount.current === 0 && appCount > 0)
    ) {
      if (appCount > 0) {
        api.start({
          paddingLeft: ICON_WRAPPER_PADDING,
          paddingRight: ICON_WRAPPER_PADDING,
          config,
        })
      } else if (!appCount) {
        api.start({
          paddingLeft: 0,
          paddingRight: 0,
          config,
        })
      }
    }

    prevAppCount.current = appCount
  }, [appsInDock, api, minimizedApps])

  return createPortal(
    <animated.div key="dock" style={mergedStyle} className={styles.dockWrapper}>
      <Tooltip.Group>
        {keepInDockTransitions((style, item) => (
          // iconWrapperStyle 的宽高是固定了， animated.div 宽度在变化时要隐藏掉 iconWrapper 溢出的宽度，
          // 所以 animated.div 使用了 overflow:hidden， 但也因此导致 DockShortcut 的 popover 被隐藏掉。
          // 这里的 id 就是为了 DockShortcut 获取到 popupContainer，方式相比传递ref简单但不可靠。
          // 另外宽度变化的动画无法在 DockShortcut 实现，动画还未执行 DockShortcut 就被卸载掉了。
          // todo: 使用其他方法替换 id
          <div className={styles.position} id={item.id}>
            <animated.div style={style}>
              <div style={iconWrapperStyle}>{item.renderDockShortcut()}</div>
            </animated.div>
          </div>
        ))}
        {!!(size(minimizedApps) && size(appsInDock)) && (
          <div style={dividerStyle} className={styles.divider} />
        )}
        {minimizedTransitions((style, item) => (
          <div className={styles.position}>
            <animated.div style={style}>
              <div style={thumbnailStyle}>{item.renderThumbnail()}</div>
            </animated.div>
          </div>
        ))}
      </Tooltip.Group>
    </animated.div>,
    document.body,
  )
}

export default memo(Dock)
