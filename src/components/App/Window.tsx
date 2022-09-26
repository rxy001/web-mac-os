import classNames from "classnames"
import type { ForwardedRef } from "react"
import {
  useState,
  useCallback,
  useRef,
  memo,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from "react"
import { useRnd, useClientSize, useUpdateEffect, useCustomState } from "chooks"
import { createPortal } from "react-dom"
import { animated } from "@react-spring/web"
import styles from "./css/window.less"
import type { WindowProps, WindowHandler } from "./interface"
import WindowHeader from "./WindowHeader"
import windowZIndex from "./windowZIndex"

const INITIAL_WIDTH = 600
const INITIAL_HEIGHT = 300
const HEADER_HEIGHT = 34

const INITIAL_Y = document.body.clientHeight / 2 - INITIAL_HEIGHT / 2
const INITIAL_X = document.body.clientWidth / 2 - INITIAL_WIDTH / 2

let Z_INDEX = 0

function Window(
  {
    id,
    title,
    children,
    onOpened,
    onClosed,
    onFullscreen,
    onCollapsed,
    onExpanded,
    onExitedFullscreen,
  }: WindowProps,
  ref?: ForwardedRef<WindowHandler>,
) {
  const [isFullscreen, setIsFullscreen] = useCustomState(false)

  const [activated, setActivated] = useCustomState(true)

  const [clientWidth, clientHeight] = useClientSize()

  const [rndStyle, dragBind, resizeBind, api] = useRnd({
    defaultSize: { width: INITIAL_WIDTH, height: INITIAL_HEIGHT },
    defaultPosition: {
      x: INITIAL_X,
      y: INITIAL_Y,
    },
    enableResizing: !isFullscreen,
    bounds: () => ({
      top: 0,
      bottom: window.innerHeight - HEADER_HEIGHT,
    }),
  })

  const zIndex = useMemo(() => windowZIndex.set(id, (Z_INDEX += 1)), [id])

  const [style, setStyle] = useState({
    zIndex,
    display: "auto",
  })

  const mergedStyle = useMemo(
    () => ({ ...rndStyle, ...style }),
    [rndStyle, style],
  )

  const windowHandler = useRef<WindowHandler>({} as any)

  const prevIsFullscreen = useRef(false)

  const prevRndStyle = useRef({
    store: {},
    set() {
      this.store = {
        x: rndStyle.x.get(),
        y: rndStyle.y.get(),
        width: rndStyle.width.get(),
        height: rndStyle.height.get(),
      }
    },
    get() {
      return this.store
    },
  })

  const setZIndex = useCallback(() => {
    const maxZIndex = windowZIndex.maxZIndex()

    if (windowZIndex.get(id) < maxZIndex) {
      setStyle((prev) => ({
        ...prev,
        zIndex: windowZIndex.set(id, (Z_INDEX += 1)),
      }))
    }
  }, [id])

  const setDisplay = useCallback((display: "none" | "block") => {
    setStyle((prev) => ({
      ...prev,
      display,
    }))
  }, [])

  const collapse = useCallback(() => {
    if (activated) {
      if (!isFullscreen) {
        prevRndStyle.current.set()
      }
      api.start({
        width: 0,
        height: 0,
        x: clientWidth / 2,
        y: clientHeight - 50,
        config: {
          duration: 100,
        },
        onRest: () => {
          setDisplay("none")
        },
      })
      setActivated(false, onCollapsed)
    }
  }, [
    isFullscreen,
    activated,
    setActivated,
    api,
    clientHeight,
    setDisplay,
    clientWidth,
    onCollapsed,
  ])

  const fullscreen = useCallback(() => {
    if (!isFullscreen) {
      prevRndStyle.current.set()
      api.start({
        width: clientWidth,
        height: clientHeight,
        x: 0,
        y: 0,
        config: {
          duration: 200,
        },
      })
      setIsFullscreen(true, onFullscreen)
    } else {
      api.start(prevRndStyle.current.get())
      setIsFullscreen(false, onExitedFullscreen)
    }
  }, [
    api,
    isFullscreen,
    clientWidth,
    clientHeight,
    onFullscreen,
    setIsFullscreen,
    onExitedFullscreen,
  ])

  const expand = useCallback(() => {
    if (!activated) {
      let springStyle = prevRndStyle.current.get()
      if (isFullscreen) {
        springStyle = {
          width: clientWidth,
          height: clientHeight,
          x: 0,
          y: 0,
        }
      }
      api.start({
        ...springStyle,
        onStart: () => {
          setDisplay("block")
        },
      })
      setActivated(true, onExpanded)
      setZIndex()
    }
  }, [
    api,
    clientWidth,
    clientHeight,
    activated,
    isFullscreen,
    setActivated,
    setZIndex,
    setDisplay,
    onExpanded,
  ])

  windowHandler.current.collapse = collapse
  windowHandler.current.expand = expand
  windowHandler.current.fullscreen = fullscreen
  windowHandler.current.activated = activated
  windowHandler.current.isFullscreen = isFullscreen

  useImperativeHandle(ref, () => windowHandler.current, [])

  useUpdateEffect(() => {
    if (isFullscreen && prevIsFullscreen.current) {
      api.start({
        width: clientWidth,
        height: clientHeight,
        immediate: true,
      })
    }
    prevIsFullscreen.current = isFullscreen
  }, [isFullscreen, clientWidth, clientHeight])

  useEffect(() => {
    onOpened?.()
    return () => {
      onClosed?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div key={id}>
      <animated.div
        {...resizeBind()}
        style={mergedStyle}
        onMouseDown={setZIndex}
        className={classNames(
          styles.window,
          isFullscreen ? styles.fullscreen : "",
        )}
      >
        <WindowHeader
          title={title}
          isFullscreen={isFullscreen}
          fullscreen={fullscreen}
          collapse={collapse}
          {...dragBind()}
        />
        {children}
      </animated.div>
    </div>,
    document.body,
  )
}

export default memo(forwardRef(Window))
