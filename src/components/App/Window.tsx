import classNames from "classnames"
import type { ForwardedRef } from "react"
import {
  useState,
  useRef,
  memo,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useEffect,
} from "react"
import { useRnd, useMemoizedFn, useResizeObserver } from "@chooks"
import type { RndStyle } from "@chooks"
import { createPortal } from "react-dom"
import { animated } from "@react-spring/web"
import { DOCK_HEIGHT, FULLSCREEN_DURATION, TOP_BAR_HEIGHT } from "@constants"
import styles from "./css/window.less"
import type { WindowProps, WindowRef } from "./interface"
import WindowHeader from "./WindowHeader"
import windowZIndex from "./windowZIndex"
import BeforeState from "./BeforeState"
import type { PreState } from "./BeforeState"
import { WINDOW_HEADER_HEIGHT, MINIMIZE_DURATION } from "./constants"

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
    children,
    minHeight,
    minWidth,
    maxHeight,
    maxWidth,
    defaultSize,
    defaultPosition,
    onFullscreen,
    onMinimize,
    onExpand,
    onExitFullscreen,
    getDockShortcut,
    onShowed,
    onHidden,
  }: WindowProps,
  ref?: ForwardedRef<WindowRef>,
) {
  const [windowVisible, setWindowVisible] = useState(true)

  const [isFullscreen, setIsFullscreen] = useState(false)

  const [isMinimized, setIsActivated] = useState(true)

  const [isMaximized, setIsMaximized] = useState(false)

  const [rndStyle, dragBind, resizeBind, rndApi] = useRnd({
    defaultSize,
    minHeight,
    minWidth,
    maxHeight,
    maxWidth,
    defaultPosition: defaultPosition ?? {
      x: document.body.clientWidth / 2 - defaultSize.width / 2,
      y: document.body.clientHeight / 2 - defaultSize.height / 2,
    },
    defaultStyle: {
      scale: 1,
      opacity: 1,
    },
    enableResizing: !isFullscreen,
    dragBounds: {
      top: TOP_BAR_HEIGHT,
      bottom: window.innerHeight - WINDOW_HEADER_HEIGHT,
    },
    resizeBounds: {
      top: TOP_BAR_HEIGHT,
      bottom: window.innerHeight - DOCK_HEIGHT,
    },
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
    display: "auto",
  })

  const mergedStyle = useMemo(
    () => ({ ...rndStyle, ...style, transformOrigin: "top left" }),
    [rndStyle, style],
  )

  const fullscreenBeforeState = useRef(new BeforeState())

  const maximizeBeforeState = useRef(new BeforeState())

  const minimizeBeforeState = useRef(new BeforeState())

  const setZIndex = useMemoizedFn(() => {
    const maxZIndex = windowZIndex.maxZIndex()

    if (windowZIndex.get(title) < maxZIndex) {
      setStyle((prev) => ({
        ...prev,
        zIndex: windowZIndex.set(title, (Z_INDEX += 1)),
      }))
    }
  })

  const setDisplay = useMemoizedFn((display: "none" | "block") => {
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

  const restore = useMemoizedFn((state: PreState, onStart?: () => void) => {
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
      onStart,
    })
  })

  const fullscreen = useMemoizedFn(() => {
    if (!isFullscreen) {
      fullscreenBeforeState.current.set({
        ...transformRndStyle(rndStyle),
        duration: FULLSCREEN_DURATION,
      })

      const { clientWidth, clientHeight } = container

      rndApi.start({
        width: clientWidth,
        height: clientHeight,
        x: 0,
        y: 0,
        config: {
          duration: FULLSCREEN_DURATION,
        },
      })
      setIsFullscreen(true)
      onFullscreen?.()
    }
  })

  const exitFullscreen = useMemoizedFn(() => {
    if (isFullscreen) {
      restore(fullscreenBeforeState.current.get())
      setIsFullscreen(false)
      onExitFullscreen?.()
    }
  })

  const getMaximizedSize = useMemoizedFn(() => {
    const { clientHeight, clientWidth } = container

    return {
      width: clientWidth,
      height: clientHeight - DOCK_HEIGHT - TOP_BAR_HEIGHT,
    }
  })

  const maximize = useMemoizedFn(() => {
    if (!isMaximized) {
      maximizeBeforeState.current.set({
        ...transformRndStyle(rndStyle),
        duration: FULLSCREEN_DURATION,
      })

      rndApi.start({
        x: 0,
        y: TOP_BAR_HEIGHT,
        config: {
          duration: FULLSCREEN_DURATION,
        },
        ...getMaximizedSize(),
      })
      setIsMaximized(true)
    }
  })

  const exitMaximized = useMemoizedFn(() => {
    if (isMaximized) {
      restore(maximizeBeforeState.current.get())
      setIsMaximized(false)
    }
  })

  const minimize = useMemoizedFn(() => {
    let x = 0
    let y = 0

    if (getDockShortcut) {
      ;({ x, y } = getDockShortcut().getBoundingClientRect())
    } else {
      const { width, height } = getMaximizedSize()
      x = width / 2
      y = height
    }

    if (isMinimized) {
      minimizeBeforeState.current.set({
        ...transformRndStyle(rndStyle),
        duration: MINIMIZE_DURATION,
      })
      rndApi.start({
        x,
        y,
        scale: 0.2,
        opacity: 0,
        config: {
          duration: MINIMIZE_DURATION,
        },
        onRest: () => {
          setDisplay("none")
        },
      })
      setIsActivated(false)
      onMinimize?.()
    }
  })

  const expand = useMemoizedFn(() => {
    if (!isMinimized) {
      restore(minimizeBeforeState.current.get(), () => setDisplay("block"))
      setIsActivated(true)
      onExpand?.()
      setZIndex()
    }
  })

  const showWindow = useMemoizedFn(() => {
    if (!windowVisible) {
      setWindowVisible(true)
      setDisplay("block")
    }
  })

  const hideWindow = useMemoizedFn(() => {
    if (windowVisible) {
      setWindowVisible(false)
      setDisplay("none")
    }
  })

  const getIsMinimized = useMemoizedFn(() => isMinimized)
  const getIsFullscreen = useMemoizedFn(() => isFullscreen)
  const getIsMaximized = useMemoizedFn(() => isMaximized)
  const getVisible = useMemoizedFn(() => windowVisible)

  useImperativeHandle(
    ref,
    () => ({
      minimize,
      expand,
      fullscreen,
      exitFullscreen,
      maximize,
      exitMaximized,
      showWindow,
      hideWindow,
      isShow: getVisible,
      isMinimized: getIsMinimized,
      isFullscreen: getIsFullscreen,
      isMaximized: getIsMaximized,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

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
          fullscreenBeforeState.current.set({
            ...fullscreenBeforeState.current.get(),
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
      onShowed?.()
      return onHidden
    }
  }, [onHidden, onShowed, windowVisible])

  return createPortal(
    <div key={title}>
      <animated.div
        style={mergedStyle}
        onMouseDown={setZIndex}
        className={classNames(styles.window, {
          [styles.fullscreen]: isFullscreen,
        })}
        {...resizeBind()}
      >
        {isMinimized && (
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
        )}
        {children}
      </animated.div>
    </div>,
    document.body,
  )
}

export default memo(forwardRef(Window))
