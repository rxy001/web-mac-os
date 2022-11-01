import classNames from "classnames"
import type { ForwardedRef } from "react"
import {
  useState,
  useRef,
  memo,
  forwardRef,
  useMemo,
  useEffect,
  useImperativeHandle,
} from "react"
import { max } from "lodash"
import { asyncLoadComponent } from "@utils"
import { useEventEmitter } from "@eventEmitter"
import type { Listener } from "@eventEmitter"
import { useRnd, useMemoizedFn, useResizeObserver, useUnmount } from "@chooks"
import type { RndStyle } from "@chooks"
import { createPortal } from "react-dom"
import { animated } from "@react-spring/web"
import { DOCK_HEIGHT, FULLSCREEN_DURATION, TOPBAR_HEIGHT } from "@constants"
import styles from "./css/window.less"
import type { WindowProps, WindowRef } from "./interface"
import { WindowEmitEventType } from "./interface"
import WindowHeader from "./WindowHeader"
import windowZIndex from "./windowZIndex"
import BeforeState from "./BeforeState"
import type { PreState } from "./BeforeState"
import { WINDOW_HEADER_HEIGHT, MINIMIZE_DURATION } from "./constants"
import { WindowContext } from "./context"
import Thumbnail from "./Thumbnail"

let Z_INDEX = 0

const container = document.body

const transformRndStyle = (rndStyle: RndStyle) => ({
  x: rndStyle.x.get(),
  y: rndStyle.y.get(),
  width: rndStyle.width.get(),
  height: rndStyle.height.get(),
  opacity: rndStyle.opacity?.get() ?? 1,
  scale: rndStyle.scale?.get() ?? 1,
})

function Window(
  {
    title,
    element,
    minHeight,
    minWidth,
    maxHeight,
    maxWidth,
    defaultSize,
    defaultPosition,
  }: WindowProps,
  ref?: ForwardedRef<WindowRef>,
) {
  const eventEmitter = useEventEmitter()

  const containerRef = useRef<HTMLDivElement>(null as any)

  const [windowVisible, setWindowVisible] = useState(true)

  const [isFullscreen, setIsFullscreen] = useState(false)

  const [isMinimized, setIsMinimized] = useState(false)

  const [isMaximized, setIsMaximized] = useState(false)

  const listeners = useRef(new Map())

  const [rndStyle, dragBind, resizeBind, rndApi] = useRnd({
    defaultSize,
    minHeight,
    minWidth,
    maxHeight,
    maxWidth,
    defaultPosition: defaultPosition ?? {
      x: max([
        document.body.clientWidth / 2 - defaultSize.width / 2,
        TOPBAR_HEIGHT,
      ]) as number,
      y: document.body.clientHeight / 2 - defaultSize.height / 2,
    },
    defaultStyle: {
      scale: 1,
      opacity: 1,
    },
    enableResizing: !isFullscreen,
    dragBounds: () => ({
      top: TOPBAR_HEIGHT,
      bottom: window.innerHeight - WINDOW_HEADER_HEIGHT,
    }),
    resizeBounds: () => ({
      top: TOPBAR_HEIGHT,
      bottom: window.innerHeight - DOCK_HEIGHT,
    }),
    onDrag({ event }) {
      event.stopPropagation()
      setIsMaximized(false)
    },
    onResize: () => {
      setIsMaximized(false)
    },
  })

  const zIndex = useMemo(() => windowZIndex.set(title, (Z_INDEX += 1)), [title])

  const [style, setStyle] = useState({
    zIndex,
    display: "flex",
  })

  const mergedStyle = useMemo(
    () => ({ ...rndStyle, ...style, transformOrigin: "top left" }),
    [rndStyle, style],
  )

  const stateBeforeFullscreen = useRef(new BeforeState())

  const stateBeforeMaximize = useRef(new BeforeState())

  const stateBeforeMinimize = useRef(new BeforeState())

  const setZIndex = useMemoizedFn(() => {
    const maxZIndex = windowZIndex.maxZIndex()

    if (windowZIndex.get(title) < maxZIndex) {
      setStyle((prev) => ({
        ...prev,
        zIndex: windowZIndex.set(title, (Z_INDEX += 1)),
      }))
    }
  })

  const setDisplay = useMemoizedFn((display: "none" | "flex") => {
    setStyle((prev) => {
      if (prev.display === display) {
        return prev
      }
      return {
        ...prev,
        display,
      }
    })
  })

  const restore = useMemoizedFn((state: PreState) => {
    const { x, y, width, height, duration, opacity, scale } = state

    rndApi.start({
      x,
      y,
      width,
      height,
      scale,
      opacity,
      config: {
        duration,
      },
    })
  })

  const getMaximizedSize = useMemoizedFn(() => {
    const { clientHeight, clientWidth } = container

    return {
      width: clientWidth,
      height: clientHeight - DOCK_HEIGHT - TOPBAR_HEIGHT,
    }
  })

  const minimizeImpl = useMemoizedFn((node: HTMLCanvasElement) => {
    const { x, y } = node.getBoundingClientRect()
    if (!isMinimized) {
      const config = {
        duration: MINIMIZE_DURATION,
      }
      stateBeforeMinimize.current.set({
        ...transformRndStyle(rndStyle),
        ...config,
      })
      rndApi.start({
        x,
        y,
        config,
        scale: 0.2,
        opacity: 0,
        onRest: () => {
          setDisplay("none")
        },
      })
      setIsMinimized(true)
    }
    eventEmitter.emit(WindowEmitEventType.WINDOW_MINIMIZE, title)
  })

  const renderThumbnail = useMemoizedFn(() => (
    <Thumbnail
      title={title}
      expand={expand}
      minimize={minimizeImpl}
      containerRef={containerRef}
    />
  ))

  const minimize = useMemoizedFn(() => {
    eventEmitter.emit(
      WindowEmitEventType.WINDOW_RENDER_THUMBNAIL,
      title,
      renderThumbnail,
    )
  })

  const fullscreen = useMemoizedFn(() => {
    if (!isFullscreen) {
      const config = {
        duration: FULLSCREEN_DURATION,
      }
      stateBeforeFullscreen.current.set({
        ...transformRndStyle(rndStyle),
        ...config,
      })

      const { clientWidth, clientHeight } = container

      rndApi.start({
        config,
        width: clientWidth,
        height: clientHeight,
        x: 0,
        y: 0,
      })
      setIsFullscreen(true)
      eventEmitter.emit(WindowEmitEventType.WINDOW_FULLSCREEN, title)
    }
  })

  const exitFullscreen = useMemoizedFn(() => {
    if (isFullscreen) {
      restore(stateBeforeFullscreen.current.get())
      setIsFullscreen(false)
      eventEmitter.emit(WindowEmitEventType.WINDOW_EXIT_FULLSCREEN, title)
    }
  })

  const maximize = useMemoizedFn(() => {
    if (!isMaximized) {
      const config = {
        duration: FULLSCREEN_DURATION,
      }
      stateBeforeMaximize.current.set({
        ...transformRndStyle(rndStyle),
        ...config,
      })

      rndApi.start({
        config,
        x: 0,
        y: TOPBAR_HEIGHT,
        ...getMaximizedSize(),
      })
      setIsMaximized(true)
    }
  })

  const exitMaximized = useMemoizedFn(() => {
    if (isMaximized) {
      restore(stateBeforeMaximize.current.get())
      setIsMaximized(false)
    }
  })

  const expandImpl = useMemoizedFn(() => {
    restore(stateBeforeMinimize.current.get())
    setIsMinimized(false)
    setZIndex()
    eventEmitter.emit(WindowEmitEventType.WINDOW_REMOVE_THUMBNAIL, title)
    eventEmitter.emit(WindowEmitEventType.WINDOW_EXPAND, title)
  })

  const expand = useMemoizedFn(() => {
    if (isMinimized) {
      setDisplay("flex")
      expandImpl()
    }
  })

  const showWindow = useMemoizedFn(() => {
    if (!windowVisible) {
      setWindowVisible(true)
      setDisplay("flex")
    }
  })

  const hideWindow = useMemoizedFn(() => {
    if (windowVisible) {
      setWindowVisible(false)
      setDisplay("none")

      if (isMinimized) {
        expandImpl()
      }
      if (isFullscreen) {
        exitFullscreen()
      }

      eventEmitter.emit(WindowEmitEventType.WINDOW_REMOVE_THUMBNAIL, title)
    }
  })

  const getIsMinimized = useMemoizedFn(() => isMinimized)
  const getIsFullscreen = useMemoizedFn(() => isFullscreen)
  const getIsMaximized = useMemoizedFn(() => isMaximized)
  const getVisible = useMemoizedFn(() => windowVisible)

  const subscribe = useMemoizedFn(
    (event: WindowEmitEventType, listener: Listener) => {
      function l(t: string) {
        if (t === title) listener()
      }
      listeners.current.set(listener, { event, listener: l })
      eventEmitter.on(event, l)
    },
  )

  const unSubscribe = useMemoizedFn(
    (event: WindowEmitEventType, listener: Listener) => {
      const { listener: l } = listeners.current.get(listener)
      listeners.current.delete(l)
      eventEmitter.off(event, l)
    },
  )

  const children = useMemo(() => {
    if (typeof element === "function") {
      return asyncLoadComponent(element)
    }
    throw new Error(`${element} is not a function`)
  }, [element])

  const windowRef = useRef<WindowRef>({
    minimize,
    expand,
    fullscreen,
    maximize,
    exitMaximized,
    exitFullscreen,
    showWindow,
    hideWindow,
    subscribe,
    unSubscribe,
    isShow: getVisible,
    isMinimized: getIsMinimized,
    isFullscreen: getIsFullscreen,
    isMaximized: getIsMaximized,
  })

  useImperativeHandle(ref, () => windowRef.current, [])

  useResizeObserver(
    document.body,
    () => {
      const { clientWidth, clientHeight } = container

      if (isFullscreen) {
        rndApi.start({
          width: clientWidth,
          height: clientHeight,
          immediate: true,
        })

        if (isMaximized) {
          stateBeforeFullscreen.current.set({
            ...stateBeforeFullscreen.current.get(),
            ...getMaximizedSize(),
          })
        }
      } else if (isMaximized) {
        rndApi.start({
          immediate: true,
          ...getMaximizedSize(),
        })
      }
    },
    200,
  )

  useEffect(() => {
    if (windowVisible) {
      eventEmitter.emit(WindowEmitEventType.WINDOW_SHOWED, title)

      return () => {
        eventEmitter.emit(WindowEmitEventType.WINDOW_HIDDEN, title)
      }
    }
  }, [eventEmitter, title, windowVisible])

  useUnmount(() => {
    eventEmitter.emit(WindowEmitEventType.WINDOW_REMOVE_THUMBNAIL, title)
  })

  return createPortal(
    <div key={title}>
      <WindowContext.Provider value={windowRef.current}>
        <animated.div
          style={mergedStyle}
          onMouseDown={setZIndex}
          className={classNames(styles.window, {
            [styles.fullscreen]: isFullscreen,
          })}
          {...resizeBind()}
        >
          <WindowHeader
            title={title}
            dragBind={dragBind}
            isFullscreen={isFullscreen}
            isMaximized={isMaximized}
            minimize={minimize}
            exitMaximized={exitMaximized}
            exitFullscreen={exitFullscreen}
            hideWindow={hideWindow}
            maximize={maximize}
            fullscreen={fullscreen}
          />
          <div ref={containerRef} className={styles.content}>
            {children}
          </div>
        </animated.div>
      </WindowContext.Provider>
    </div>,
    document.body,
  )
}

export default memo(forwardRef(Window))
