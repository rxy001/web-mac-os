import classNames from "classnames"
import type { ForwardedRef } from "react"
import {
  useState,
  useRef,
  memo,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react"
import { useRnd, useMemoizedFn, useSetState, useResizeObserver } from "@chooks"
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
})

function Window(
  {
    id,
    title,
    children,
    defaultSize,
    defaultPosition,
    onFullscreen,
    onMinimize,
    onExpand,
    onExitFullscreen,
  }: WindowProps,
  ref?: ForwardedRef<WindowRef>,
) {
  const [isFullscreen, setIsFullscreen] = useSetState(false)

  const [isActivated, setIsActivated] = useSetState(true)

  const [isMaximized, setIsMaximized] = useState(false)

  const [rndStyle, dragBind, resizeBind, rndApi] = useRnd({
    defaultSize,
    defaultPosition: defaultPosition ?? {
      x: document.body.clientWidth / 2 - defaultSize.width / 2,
      y: document.body.clientHeight / 2 - defaultSize.height / 2,
    },
    defaultStyle: {
      opacity: 1,
    },
    enableResizing: !isFullscreen,
    bounds: () => ({
      top: TOP_BAR_HEIGHT,
      bottom: window.innerHeight - WINDOW_HEADER_HEIGHT,
    }),
    onDrag({ event }) {
      event.stopPropagation()
      setIsMaximized(false)
    },

    onResize: () => {
      setIsMaximized(false)
    },
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

  const dockShortcutRef = useRef<HTMLDivElement>(null as any)

  const fullscreenBeforeState = useRef(new BeforeState())

  const maximizeBeforeState = useRef(new BeforeState())

  const minimizeBeforeState = useRef(new BeforeState())

  const setZIndex = useMemoizedFn(() => {
    const maxZIndex = windowZIndex.maxZIndex()

    if (windowZIndex.get(id) < maxZIndex) {
      setStyle((prev) => ({
        ...prev,
        zIndex: windowZIndex.set(id, (Z_INDEX += 1)),
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
    const { x, y, width, height, duration, opacity } = state

    rndApi.start({
      x,
      y,
      width,
      height,
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
        opacity: 1,
        config: {
          duration: FULLSCREEN_DURATION,
        },
      })
      setIsFullscreen(true, onFullscreen)
    }
  })

  const exitFullscreen = useMemoizedFn(() => {
    if (isFullscreen) {
      restore(fullscreenBeforeState.current.get())
      setIsFullscreen(false, onExitFullscreen)
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
        opacity: 1,
        config: {
          duration: FULLSCREEN_DURATION,
        },
        ...getMaximizedSize(),
      })
      setIsMaximized(true)
    }
  })

  const exitMaximize = useMemoizedFn(() => {
    if (isMaximized) {
      restore(maximizeBeforeState.current.get())
      setIsMaximized(false)
    }
  })

  const minimize = useMemoizedFn(() => {
    let x = 0
    let y = 0

    if (dockShortcutRef.current) {
      ;({ x, y } = dockShortcutRef.current.getBoundingClientRect())
    } else {
      const { width, height } = getMaximizedSize()
      x = width / 2
      y = height
    }

    if (isActivated) {
      minimizeBeforeState.current.set({
        ...transformRndStyle(rndStyle),
        duration: MINIMIZE_DURATION,
      })
      rndApi.start({
        width: 100,
        height: 100,
        opacity: 0,
        x,
        y,
        config: {
          duration: MINIMIZE_DURATION,
        },
        onRest: () => {
          setDisplay("none")
        },
      })
      setIsActivated(false, onMinimize)
    }
  })

  const expand = useMemoizedFn(() => {
    if (!isActivated) {
      restore(minimizeBeforeState.current.get(), () => setDisplay("block"))
      setIsActivated(true, onExpand)
      setZIndex()
    }
  })

  const getIsActivated = useMemoizedFn(() => isActivated)
  const getIsFullscreen = useMemoizedFn(() => isFullscreen)
  const getIsMaximized = useMemoizedFn(() => isMaximized)

  useImperativeHandle(
    ref,
    () => ({
      minimize,
      expand,
      fullscreen,
      exitFullscreen,
      maximize,
      exitMaximize,
      dockShortcutRef,
      isActivated: getIsActivated,
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

  return createPortal(
    <div key={id}>
      <animated.div
        style={mergedStyle}
        onMouseDown={setZIndex}
        className={classNames(styles.window, {
          [styles.fullscreen]: isFullscreen,
        })}
        {...resizeBind()}
      >
        <WindowHeader title={title} dragBind={dragBind} />
        {children}
      </animated.div>
    </div>,
    document.body,
  )
}

export default memo(forwardRef(Window))
