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
  WindowHandlerType,
} from "./interface"
import { EventType } from "./hooks"

const handlerTypes: WindowHandlerType[] = [
  "fullscreen",
  "exitFullscreen",
  "minimize",
  "expand",
  "maximize",
  "exitMaximize",
  "isActivated",
  "isFullscreen",
  "isMaximized",
]

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

  const [visible, setVisible] = useState(false)

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

  const fireHandler = useMemoizedFn<(p: WindowHandlerType) => any>(
    (handler: WindowHandlerType) => {
      if (windowRef.current) {
        return windowRef.current[handler]()
      }
    },
  )

  const getDockShortcut = useMemoizedFn(() => dockShortcutRef.current)

  const renderDockShortcut = useMemoizedFn(() => (
    <DockShortcut
      id={id}
      key={id}
      title={title}
      icon={icon}
      iconType={iconType}
      openApp={openApp}
      ref={dockShortcutRef}
    />
  ))

  const openApp = useMemoizedFn(() => {
    if (windowRef.current?.isActivated() === false) {
      windowRef.current.expand()
    } else if (!windowRef.current) {
      setVisible(true)
    }
  })

  const closeApp = useMemoizedFn(() => {
    onClose()
    setVisible(false)
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

  const windowHandlers = useMemo(
    () =>
      reduce<WindowHandlerType, WindowRef>(
        handlerTypes,
        (obj, type) => {
          obj[type] = () => fireHandler(type)
          return obj
        },
        {} as WindowRef,
      ),
    [fireHandler],
  )

  const app = useMemo<AppContextProps>(
    () => ({
      openApp,
      closeApp,
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
    if (visible) {
      onOpened()
    }
  }, [visible])

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
        openApp={openApp}
      />
      {visible && (
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
