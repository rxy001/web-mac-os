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
  useMemoizedFn,
  useSetState,
  useMount,
  useUnmount,
  useResizeObserver,
} from "@chooks"
import type { RndStyle } from "@chooks"
import { createPortal } from "react-dom"
import { animated } from "@react-spring/web"
import { DOCK_HEIGHT, FULLSCREEN_DURATION, TOP_BAR_HEIGHT } from "@constants"
import styles from "./css/window.less"
import type { WindowProps, WindowHandler } from "./interface"
import WindowHeader from "./WindowHeader"
import windowZIndex from "./windowZIndex"
import BeforeState from "./BeforeState"
import type { PreState } from "./BeforeState"
import {
  INITIAL_WIDTH,
  INITIAL_HEIGHT,
  INITIAL_Y,
  INITIAL_X,
  WINDOW_HEADER_HEIGHT,
  MINIMIZE_DURATION,
} from "./constants"

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

  const [isActivated, setIsActivated] = useSetState(true)

  const [isMaximized, setIsMaximized] = useState(false)

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
      restore(fullscreenBeforeStateRef.current.get())
      setIsFullscreen(false, onExitedFullscreen)
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
      maximizeBeforeStateRef.current.set({
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
      restore(maximizeBeforeStateRef.current.get())
      setIsMaximized(false)
    }
  })

  const minimize = useMemoizedFn(() => {
    let x = 0
    let y = 0

    if (iconDOMInDockRef.current) {
      ;({ x, y } = iconDOMInDockRef.current.getBoundingClientRect())
    } else {
      const { width, height } = getMaximizedSize()
      x = width / 2
      y = height
    }

    if (isActivated) {
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
      setIsActivated(false, onMinimized)
    }
  })

  const expand = useMemoizedFn(() => {
    if (!isActivated) {
      restore(minimizeBeforeStateRef.current.get(), () => setDisplay("block"))
      setIsActivated(true, onExpanded)
      setZIndex()
    }
  })

  // 这里不能直接传 iconDOMInDockRef, 可能是由于 @reduxjs/toolkit 在
  // dispatch 或者 useSelector 时递归所有对象 freeze, 因此不能直接修改 iconDOMInDockRef.current
  // 好坑，开始还以为是 react 的原因，不过 createElement 只 freeze element ,
  // 属性值为对象依然可以重新赋值
  const getIconDOM = useMemoizedFn((node) => {
    iconDOMInDockRef.current = node
  })

  // 不能使用 useLatest，useLatest 是重新赋值， ref 获取不到最新的值
  const windowHandler = useRef<WindowHandler>({
    isActivated,
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

  windowHandler.current.isActivated = isActivated
  windowHandler.current.isFullscreen = isFullscreen
  windowHandler.current.isMaximized = isMaximized

  useImperativeHandle(ref, () => windowHandler.current, [windowHandler])

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
          fullscreenBeforeStateRef.current.set({
            ...fullscreenBeforeStateRef.current.get(),
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
  useMount(() => {
    onOpened?.()
  })

  useUnmount(() => {
    onClosed?.()
    iconDOMInDockRef.current = null
  })

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
