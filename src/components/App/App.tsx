import shortid from "shortid"
import { memo, useMemo, useRef, useState } from "react"
import { asyncLoadComponent } from "@utils"
import { connect } from "react-redux"
import {
  useAppDispatch,
  useMemoizedFn,
  useMount,
  useUnmount,
  useUpdateEffect,
} from "@chooks"
import { reduce } from "lodash"
import { useEventEmitter } from "@eventEmitter"
import type { Listener } from "@eventEmitter"
import Window from "./Window"
import DockShortcut from "./DockShortcut"
import DesktopShortcut from "./DesktopShortcut"
import { pushApp, removeApp } from "../../redux/appsSlice"
import { AppContext } from "./context"
import type {
  AppProps,
  AppContextProps,
  WindowRef,
  WindowEventType,
} from "./interface"
import { EventType } from "./hooks"

const windowEventTypes: WindowEventType[] = [
  "fullscreen",
  "exitFullscreen",
  "minimize",
  "expand",
  "maximize",
  "exitMaximized",
  "isMinimized",
  "isFullscreen",
  "isMaximized",
  "hideWindow",
  "showWindow",
  "isShow",
]

// todo：点击桌面图标打开app 后 ，dockShortcut 下面不显示原点
function App({
  element,
  title,
  icon,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  defaultSize,
  defaultPosition,
  iconType = "round",
}: AppProps) {
  const dispatch = useAppDispatch()

  const eventEmitter = useEventEmitter()

  const [open, setOpen] = useState(false)

  const dockShortcutRef = useRef<HTMLDivElement>(null as any)

  const listeners = useRef(new Map())

  const id = useMemo(() => shortid.generate(), [])

  const windowRef = useRef<WindowRef>(null as any)

  const children = useMemo(() => {
    if (typeof element === "function") {
      return asyncLoadComponent(element)
    }
    throw new Error(`${element} is not a function`)
  }, [element])

  const fireHandler = useMemoizedFn<(p: WindowEventType) => any>(
    (type: WindowEventType) => {
      if (windowRef.current) {
        return windowRef.current[type]()
      }
      throw new Error(`${title} 未启动，不能调用${type}`)
    },
  )

  const windowHandlers = useMemo(
    () =>
      reduce<WindowEventType, WindowRef>(
        windowEventTypes,
        (obj, type) => {
          obj[type] = () => fireHandler(type)
          return obj
        },
        {} as WindowRef,
      ),
    [fireHandler],
  )

  const getDockShortcut = useMemoizedFn(() => dockShortcutRef.current)

  const openApp = useMemoizedFn(() => {
    if (!open) {
      setOpen(true)
    }
  })

  const closeApp = useMemoizedFn(() => {
    if (open) {
      setOpen(false)
      onClose()
    }
  })

  const onShortcutClick = useMemoizedFn(() => {
    if (!open) {
      openApp()
    } else if (windowRef.current?.isMinimized() === false) {
      windowRef.current.expand()
    } else {
      windowRef.current.showWindow()
    }
  })

  const getOpen = useMemoizedFn(() => open)

  // eslint-disable-next-line arrow-body-style
  const renderDockShortcut = useMemoizedFn(() => {
    return (
      <DockShortcut
        icon={icon}
        title={title}
        iconType={iconType}
        getOpen={getOpen}
        closeApp={closeApp}
        openApp={onShortcutClick}
        ref={dockShortcutRef}
        windowHandlers={windowHandlers}
      />
    )
  })

  const onOpened = useMemoizedFn(() => {
    eventEmitter.emit(EventType.Opened, title)
  })

  const onClose = useMemoizedFn(() => {
    eventEmitter.emit(EventType.Close, title)
  })

  const onFullscreen = useMemoizedFn(() => {
    eventEmitter.emit(EventType.Fullscreen, title)
  })

  const onExitFullscreen = useMemoizedFn(() => {
    eventEmitter.emit(EventType.ExitFullScreen, title)
  })

  const onMinimize = useMemoizedFn(() => {
    eventEmitter.emit(EventType.Minimize, title)
  })
  const onExpand = useMemoizedFn(() => {
    eventEmitter.emit(EventType.Expand, title)
  })

  const subscribe = useMemoizedFn((event: EventType, listener: Listener) => {
    function l(t: string) {
      if (t === title) {
        listener()
      }
    }
    listeners.current.set(listener, { event, listener })
    eventEmitter.on(event, l)
  })

  const unSubscribe = useMemoizedFn((event: EventType, listener: Listener) => {
    const { listener: l } = listeners.current.get(listener)
    listeners.current.delete(l)
    eventEmitter.off(event, l)
  })

  const app = useMemo<AppContextProps>(
    () => ({
      subscribe,
      unSubscribe,
      ...windowHandlers,
    }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useMount(() => {
    dispatch(
      pushApp({
        key: id,
        app: {
          id,
          title,
          renderDockShortcut,
        },
      }),
    )
  })

  useUnmount(() => {
    dispatch(
      removeApp({
        key: id,
      }),
    )
  })

  useUpdateEffect(() => {
    if (open) {
      onOpened()
    }
  }, [open])

  useUnmount(() => {
    listeners.current.forEach(({ event, listener }) => {
      eventEmitter.off(event, listener)
    })
  })

  return (
    <AppContext.Provider value={app}>
      <DesktopShortcut
        icon={icon}
        iconType={iconType}
        title={title}
        openApp={onShortcutClick}
      />
      {open && (
        <Window
          id={id}
          title={title}
          ref={windowRef}
          getDockShortcut={getDockShortcut}
          minHeight={minHeight}
          minWidth={minWidth}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
          defaultSize={defaultSize}
          defaultPosition={defaultPosition}
          onFullscreen={onFullscreen}
          onMinimize={onMinimize}
          onExpand={onExpand}
          onExitFullscreen={onExitFullscreen}
        >
          {children}
        </Window>
      )}
    </AppContext.Provider>
  )
}

export default memo(connect()(App))
