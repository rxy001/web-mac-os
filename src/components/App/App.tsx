import { memo, useMemo, useRef, useState } from "react"
import { asyncLoadComponent } from "@utils"
import { connect } from "react-redux"
import { useAppDispatch, useMemoizedFn } from "@chooks"
import shortid from "shortid"
import Shortcut from "./Shortcut"
import Window from "./Window"
import { push, remove } from "../../redux/appsSlice"
import { AppContext } from "./context"
import type { AppProps, AppContextProps, WindowHandler } from "./interface"

function App({
  element,
  title,
  icon,
  defaultSize,
  defaultPosition,
  onOpened: propsOnOpened,
  onClosed: propsOnClosed,
  onFullscreen: propsOnFullscreen,
  onMinimized: propsOnMinimized,
  onExpanded: propsOnExpanded,
  onExitedFullscreen: propsOnExitedFullscreen,
}: AppProps) {
  const dispatch = useAppDispatch()

  const id = useMemo(() => shortid.generate(), [])

  const [visible, setVisible] = useState(false)

  const windowRef = useRef<WindowHandler>(null as any)

  const children = useMemo(() => {
    if (typeof element === "function") {
      return asyncLoadComponent(element)
    }
    return element
  }, [element])

  const pushAppInfoToStore = useMemoizedFn(() => {
    dispatch({
      type: push.type,
      payload: {
        key: id,
        app: {
          id,
          title,
          icon,
          ...windowRef.current,
        },
      },
    })
  })

  const openApp = useMemoizedFn(() => {
    if (windowRef.current?.activated === false) {
      windowRef.current.expand()
    } else if (!windowRef.current) {
      setVisible(true)
    }
  })

  const closeApp = useMemoizedFn(() => {
    setVisible(false)
  })

  const onOpened = useMemoizedFn(() => {
    pushAppInfoToStore()
    propsOnOpened?.()
  })

  const onFullscreen = useMemoizedFn(() => {
    pushAppInfoToStore()
    propsOnFullscreen?.()
  })

  const onExitedFullscreen = useMemoizedFn(() => {
    pushAppInfoToStore()
    propsOnExitedFullscreen?.()
  })

  const onMinimized = useMemoizedFn(() => {
    pushAppInfoToStore()
    propsOnMinimized?.()
  })

  const onExpanded = useMemoizedFn(() => {
    pushAppInfoToStore()
    propsOnExpanded?.()
  })

  const onClosed = useMemoizedFn(() => {
    dispatch({
      type: remove.type,
      payload: {
        key: id,
      },
    })
    propsOnClosed?.()
  })

  const methods = useRef<AppContextProps>({ openApp, closeApp })

  return (
    <AppContext.Provider value={methods.current}>
      <Shortcut icon={icon} title={title} />
      {visible && (
        <Window
          id={id}
          ref={windowRef}
          title={title}
          defaultSize={defaultSize}
          defaultPosition={defaultPosition}
          onOpened={onOpened}
          onClosed={onClosed}
          onFullscreen={onFullscreen}
          onMinimized={onMinimized}
          onExpanded={onExpanded}
          onExitedFullscreen={onExitedFullscreen}
        >
          {children}
        </Window>
      )}
    </AppContext.Provider>
  )
}

export default memo(connect()(App))
