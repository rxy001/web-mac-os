import classNames from "classnames"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { asyncLoadComponent } from "@utils"
import { connect } from "react-redux"
import {
  useAppDispatch,
  useMemoizedFn,
  useMount,
  useUnmount,
  useLocalStorage,
} from "@chooks"
import { reduce } from "lodash"
import { useEventEmitter } from "@eventEmitter"
import type { Listener } from "@eventEmitter"
import Window from "./Window"
import { DockShortcut } from "../Dock"
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
import styles from "./css/app.less"

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

const storagePrefix = "__app__"

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

  const storageKey = `${storagePrefix}${title}`

  const storage = useLocalStorage()

  const eventEmitter = useEventEmitter()

  const [open, setOpen] = useState(false)

  const [isKeepInDock, setIsKeepInDock] = useState(() => {
    const local = storage.getItem(storageKey) ?? {}
    return local.keepInDock ?? true
  })

  const dockShortcutRef = useRef<HTMLDivElement>(null as any)

  const listeners = useRef(new Map())

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

  const keepInDock = useMemoizedFn(() => {
    if (!isKeepInDock) {
      const prev = storage.getItem(storageKey) ?? {}
      storage.setItem(storageKey, {
        ...prev,
        keepInDock: true,
      })
      setIsKeepInDock(true)
      onAppKeepInDock()
    }
  })

  const removeInDock = useMemoizedFn(() => {
    if (isKeepInDock) {
      const key = `${storagePrefix}${title}`
      const prev = storage.getItem(storageKey) ?? {}
      storage.setItem(key, {
        ...prev,
        keepInDock: false,
      })
      setIsKeepInDock(false)
      onAppRemoveInDock()
    }
  })

  const iconMaskClassName = useMemo(
    () =>
      classNames({
        [styles.iconMask]: iconType === "circle",
      }),
    [iconType],
  )

  const renderDockShortcut = useMemoizedFn(() => (
    <DockShortcut
      icon={icon}
      title={title}
      defaultIsKeepInDock={isKeepInDock}
      iconMaskClassName={iconMaskClassName}
      ref={dockShortcutRef}
      openApp={onShortcutClick}
      closeApp={closeApp}
      keepInDock={keepInDock}
      removeInDock={removeInDock}
      hideWindow={windowHandlers.hideWindow}
      showWindow={windowHandlers.showWindow}
    />
  ))

  const onAppOpened = useMemoizedFn(() => {
    if (!isKeepInDock) {
      dispatch(
        pushApp({
          key: title,
          app: {
            title,
            renderDockShortcut,
          },
        }),
      )
    }

    eventEmitter.emit(EventType.APP_OPENED, title)
  })

  const onAppClosed = useMemoizedFn(() => {
    if (!isKeepInDock) {
      dispatch(
        removeApp({
          key: title,
        }),
      )
    }

    eventEmitter.emit(EventType.APP_CLOSE, title)
  })

  const onAppKeepInDock = useMemoizedFn(() => {
    eventEmitter.emit(EventType.APP_KEEP_IN_DOCK, title)
  })

  const onAppRemoveInDock = useMemoizedFn(() => {
    if (!open) {
      dispatch(
        removeApp({
          key: title,
        }),
      )
    }

    eventEmitter.emit(EventType.APP_REMOVE_IN_DOCK, title)
  })

  const onWindowFullscreen = useMemoizedFn(() => {
    eventEmitter.emit(EventType.WINDOW_FULLSCREEN, title)
  })

  const onWindowExitFullscreen = useMemoizedFn(() => {
    eventEmitter.emit(EventType.WINDOW_EXIT_FULLSCREEN, title)
  })

  const onWindowMinimize = useMemoizedFn(() => {
    eventEmitter.emit(EventType.WINDOW_MINIMIZE, title)
  })
  const onWindowExpand = useMemoizedFn(() => {
    eventEmitter.emit(EventType.WINDOW_EXPAND, title)
  })

  const onWindowShowed = useMemoizedFn(() => {
    eventEmitter.emit(EventType.WINDOW_SHOWED, title)
  })

  const onWindowHidden = useMemoizedFn(() => {
    eventEmitter.emit(EventType.WINDOW_HIDDEN, title)
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
    if (isKeepInDock) {
      dispatch(
        pushApp({
          key: title,
          app: {
            title,
            renderDockShortcut,
          },
        }),
      )
    }
  })

  useEffect(() => {
    if (open) {
      onAppOpened()
      return onAppClosed
    }
  }, [onAppClosed, onAppOpened, open])

  useUnmount(() => {
    listeners.current.forEach(({ event, listener }) => {
      eventEmitter.off(event, listener)
    })
  })

  return (
    <AppContext.Provider value={app}>
      <DesktopShortcut
        icon={icon}
        title={title}
        openApp={onShortcutClick}
        iconMaskClassName={iconMaskClassName}
      />
      {open && (
        <Window
          title={title}
          ref={windowRef}
          getDockShortcut={getDockShortcut}
          minHeight={minHeight}
          minWidth={minWidth}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
          defaultSize={defaultSize}
          defaultPosition={defaultPosition}
          onFullscreen={onWindowFullscreen}
          onMinimize={onWindowMinimize}
          onExpand={onWindowExpand}
          onExitFullscreen={onWindowExitFullscreen}
          onShowed={onWindowShowed}
          onHidden={onWindowHidden}
        >
          {children}
        </Window>
      )}
    </AppContext.Provider>
  )
}

export default memo(connect()(App))
