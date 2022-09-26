import { memo, useCallback, useMemo, useRef, useState } from "react"
import { asyncLoadComponent } from "utils"
import { connect } from "react-redux"
import { useAppDispatch } from "chooks"
import shortid from "shortid"
import Shortcut from "./Shortcut"
import Window from "./Window"
import { push, remove } from "../../redux/appsSlice"
import { AppContext } from "./context"
import type { AppProps, AppContextProps, WindowHandler } from "./interface"

function App({ element, title, iconType }: AppProps) {
  const dispatch = useAppDispatch()

  const id = useMemo(() => shortid.generate(), [])

  const [visible, setVisible] = useState(false)

  const methods = useRef<AppContextProps>({} as any)

  const windowRef = useRef<WindowHandler>(null as any)

  const children = useMemo(() => {
    if (typeof element === "function") {
      return asyncLoadComponent(element)
    }
    return element
  }, [element])

  const pushAppToStore = useCallback(() => {
    dispatch({
      type: push.type,
      payload: {
        key: id,
        app: {
          id,
          title,
          iconType,
          ...windowRef.current,
        },
      },
    })
  }, [id, title, iconType, dispatch])

  const openApp = useCallback(() => {
    if (windowRef.current?.activated === false) {
      windowRef.current.expand()
    }
    setVisible(true)
  }, [])

  const closeApp = useCallback(() => {
    setVisible(false)
  }, [])

  const onOpened = useCallback(() => {
    pushAppToStore()
  }, [pushAppToStore])

  const onFullscreen = useCallback(() => {
    pushAppToStore()
  }, [pushAppToStore])

  const onExitedFullscreen = useCallback(() => {
    pushAppToStore()
  }, [pushAppToStore])

  const onCollapsed = useCallback(() => {
    pushAppToStore()
  }, [pushAppToStore])

  const onExpanded = useCallback(() => {
    pushAppToStore()
  }, [pushAppToStore])

  const onClosed = useCallback(() => {
    dispatch({
      type: remove.type,
      payload: {
        key: id,
      },
    })
  }, [id, dispatch])

  methods.current.openApp = openApp
  methods.current.closeApp = closeApp

  return (
    <AppContext.Provider value={methods.current}>
      <Shortcut iconType={iconType} title={title} />
      {visible && (
        <Window
          id={id}
          ref={windowRef}
          title={title}
          onOpened={onOpened}
          onClosed={onClosed}
          onFullscreen={onFullscreen}
          onCollapsed={onCollapsed}
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
