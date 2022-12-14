import classNames from "classnames"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import {
  useAppDispatch,
  useMemoizedFn,
  useMount,
  useUnmount,
  useLocalStorage,
} from "@chooks"
import { reduce } from "lodash"
import { useEventEmitter } from "@eventEmitter"
import { DockShortcut } from "../Dock"
import DesktopShortcut from "./DesktopShortcut"
import { pushApp, removeApp } from "../../redux/appsSlice"
import { AppContext } from "./context"
import type { AppProps, AppContextProps } from "./interface"
import { AppEmitEventType } from "./interface"
import { Window } from "../index"
import type { WindowRef, WindowHandlerEventType } from "../index"
import styles from "./css/app.less"
import { useEventSubscribe } from "../helper"

const windowEventTypes: WindowHandlerEventType[] = [
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

const storagePrefix = "__App__"

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

  const windowRef = useRef<WindowRef>(null as any)

  const fireHandler = useMemoizedFn<(p: WindowHandlerEventType) => any>(
    (type) => {
      if (windowRef.current) {
        return windowRef.current[type]()
      }
      throw new Error(`${title} 未启动，不能调用${type}`)
    },
  )

  const windowHandlers = useMemo(
    () =>
      reduce<WindowHandlerEventType, WindowRef>(
        windowEventTypes,
        (obj, type) => {
          obj[type] = () => fireHandler(type)
          return obj
        },
        {} as WindowRef,
      ),
    [fireHandler],
  )

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
    } else if (windowRef.current?.isMinimized()) {
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

      eventEmitter.emit(AppEmitEventType.APP_KEEP_IN_DOCK, title)
    }
  })

  const removeInDock = useMemoizedFn(() => {
    if (isKeepInDock) {
      const prev = storage.getItem(storageKey) ?? {}
      storage.setItem(storageKey, {
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
      openApp={onShortcutClick}
      closeApp={closeApp}
      keepInDock={keepInDock}
      removeInDock={removeInDock}
      hideWindow={windowHandlers.hideWindow}
      showWindow={onShortcutClick}
    />
  ))

  const pushToRedux = useMemoizedFn(() => {
    dispatch(
      pushApp({
        appName: title,
        renderDockShortcut,
      }),
    )
  })

  const removeAppFromRedux = useMemoizedFn(() => {
    // 为了先隐藏 popup
    setTimeout(() => {
      dispatch(removeApp(title))
    }, 200)
  })

  const onAppOpened = useMemoizedFn(() => {
    if (!isKeepInDock) {
      pushToRedux()
    }
    eventEmitter.emit(AppEmitEventType.APP_OPENED, title)
  })

  const onAppClosed = useMemoizedFn(() => {
    if (!isKeepInDock) {
      removeAppFromRedux()
    }

    eventEmitter.emit(AppEmitEventType.APP_CLOSE, title)
  })

  const onAppRemoveInDock = useMemoizedFn(() => {
    if (!open) {
      removeAppFromRedux()
    }

    eventEmitter.emit(AppEmitEventType.APP_REMOVE_IN_DOCK, title)
  })

  const [subscribe, unSubscribe] = useEventSubscribe<AppEmitEventType>(title)

  const app = useMemo<AppContextProps>(
    () => ({
      ...windowHandlers,
      subscribe,
      unSubscribe,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useMount(() => {
    if (isKeepInDock) {
      pushToRedux()
    }
  })

  useEffect(() => {
    if (open) {
      onAppOpened()
      return onAppClosed
    }
  }, [onAppClosed, onAppOpened, open])

  useUnmount(() => {
    removeAppFromRedux()
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
          minHeight={minHeight}
          minWidth={minWidth}
          maxHeight={maxHeight}
          maxWidth={maxWidth}
          defaultSize={defaultSize}
          defaultPosition={defaultPosition}
          element={element}
        />
      )}
    </AppContext.Provider>
  )
}

export default memo(App)
