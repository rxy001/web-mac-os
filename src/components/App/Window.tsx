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
import {
  useRnd,
  useClientSize,
  useUpdateEffect,
  useMemoizedFn,
  useSetState,
  useMount,
  useUnmount,
} from "@chooks"
import type { RndStyle } from "@chooks"
import { createPortal } from "react-dom"
import { animated } from "@react-spring/web"
import { DOCK } from "@constants"
import styles from "./css/window.less"
import type { WindowProps, WindowHandler } from "./interface"
import WindowHeader from "./WindowHeader"
import windowZIndex from "./windowZIndex"
import BeforeState from "./BeforeState"
import type { PreState } from "./BeforeState"
import {
  INITIAL_WIDTH,
  INITIAL_HEIGHT,
  HEADER_HEIGHT,
  INITIAL_Y,
  INITIAL_X,
  MINIMIZE_DURATION,
  FULLSCREEN_DURATION,
} from "./constants"

const { DOCK_HEIGHT } = DOCK

let Z_INDEX = 0

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
    onOpened,
    onClosed,
    onFullscreen,
    onMinimized,
    onExpanded,
    onExitedFullscreen,
  }: WindowProps,
  ref?: ForwardedRef<WindowHandler>,
) {
  const [isFullscreen, setIsFullscreen] = useSetState(false)

  const [activated, setActivated] = useSetState(true)

  const [isMaximized, setIsMaximized] = useState(false)

  const [clientWidth, clientHeight] = useClientSize()

  const [rndStyle, dragBind, resizeBind, rndApi] = useRnd({
    defaultSize: defaultSize ?? {
      width: INITIAL_WIDTH,
      height: INITIAL_HEIGHT,
    },
    defaultPosition: defaultPosition ?? {
      x: INITIAL_X,
      y: INITIAL_Y,
    },
    enableResizing: !isFullscreen,
    bounds: () => ({
      top: 0,
      bottom: window.innerHeight - HEADER_HEIGHT,
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

  const prevIsFullscreen = useRef(false)

  const iconDOMInDockRef = useRef<HTMLElement | null>(null as any)

  const fullscreenBeforeStateRef = useRef(new BeforeState())

  const maximizeBeforeStateRef = useRef(new BeforeState())

  const minimizeBeforeStateRef = useRef(new BeforeState())

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
      fullscreenBeforeStateRef.current.set({
        ...transformRndStyle(rndStyle),
        duration: FULLSCREEN_DURATION,
      })
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
      restore(fullscreenBeforeStateRef.current.get())
      setIsFullscreen(false, onExitedFullscreen)
    }
  })

  const maximize = useMemoizedFn(() => {
    if (!isMaximized) {
      maximizeBeforeStateRef.current.set({
        ...transformRndStyle(rndStyle),
        duration: FULLSCREEN_DURATION,
      })
      rndApi.start({
        width: clientWidth,
        height: clientHeight - DOCK_HEIGHT,
        x: 0,
        y: 0,
        opacity: 1,
        config: {
          duration: FULLSCREEN_DURATION,
        },
      })
      setIsMaximized(true)
    }
  })

  const exitMaximize = useMemoizedFn(() => {
    if (isMaximized) {
      restore(maximizeBeforeStateRef.current.get())
      setIsMaximized(false)
    }
  })

  const minimize = useMemoizedFn(() => {
    let x = clientWidth / 2
    let y = clientHeight - DOCK_HEIGHT

    if (iconDOMInDockRef.current) {
      ;({ x, y } = iconDOMInDockRef.current.getBoundingClientRect())
    }

    if (activated) {
      minimizeBeforeStateRef.current.set({
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
      setActivated(false, onMinimized)
    }
  })

  const expand = useMemoizedFn(() => {
    if (!activated) {
      restore(minimizeBeforeStateRef.current.get(), () => setDisplay("block"))
      setActivated(true, onExpanded)
      setZIndex()
    }
  })

  // 这里不能直接传 iconDOMInDockRef, 可能是由于 @reduxjs/toolkit 在
  // useSeletor 获取值时递归所有对象 freeze, 因此不能直接修改 iconDOMInDockRef.current
  // 好坑，开始还以为是 react 的原因，不过 createElement 只 freeze element ,
  // 属性值为对象依然可以重新赋值
  const getIconDOM = useMemoizedFn((node) => {
    iconDOMInDockRef.current = node
  })

  const windowHandler = useRef<WindowHandler>({
    activated,
    isFullscreen,
    isMaximized,
    minimize,
    expand,
    fullscreen,
    exitFullscreen,
    maximize,
    exitMaximize,
    getIconDOM,
  })

  windowHandler.current.activated = activated
  windowHandler.current.isFullscreen = isFullscreen
  windowHandler.current.isMaximized = isMaximized

  useImperativeHandle(ref, () => windowHandler.current, [])

  useUpdateEffect(() => {
    if (isFullscreen && prevIsFullscreen.current) {
      rndApi.start({
        width: clientWidth,
        height: clientHeight,
        immediate: true,
      })
    }
    prevIsFullscreen.current = isFullscreen
  }, [isFullscreen, clientWidth, clientHeight])

  useMount(() => {
    onOpened?.()
  })

  useUnmount(() => {
    onClosed?.()
  })

  return createPortal(
    <div key={id}>
      <animated.div
        style={mergedStyle}
        onMouseDown={setZIndex}
        className={classNames(
          styles.window,
          isFullscreen ? styles.fullscreen : "",
        )}
        {...resizeBind()}
      >
        <WindowHeader
          title={title}
          windowHandler={windowHandler.current}
          {...dragBind()}
        />
        {children}
      </animated.div>
    </div>,
    document.body,
  )
}

export default memo(forwardRef(Window))
