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
  COLLAPSE_DURATION,
  FULLSCREEN_DURATION,
} from "./constants"

const { DOCK_HEIGHT } = DOCK

let Z_INDEX = 0

const transformRndStyle = (rndStyle: RndStyle) => ({
  x: rndStyle.x.get(),
  y: rndStyle.y.get(),
  width: rndStyle.width.get(),
  height: rndStyle.height.get(),
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
    onCollapsed,
    onExpanded,
    onExitedFullscreen,
  }: WindowProps,
  ref?: ForwardedRef<WindowHandler>,
) {
  const [isFullscreen, setIsFullscreen] = useSetState(false)

  const [activated, setActivated] = useSetState(true)

  const [isExpandToViewport, setIsExpandToViewport] = useState(false)

  const [clientWidth, clientHeight] = useClientSize()

  const [rndStyle, dragBind, resizeBind, api] = useRnd({
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
      setIsExpandToViewport(false)
    },

    onResize: () => {
      setIsExpandToViewport(false)
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

  const fullscreenBeforeStateRef = useRef(new BeforeState())

  const expandToViewportBeforeStateRef = useRef(new BeforeState())

  const collapseBeforeStateRef = useRef(new BeforeState())

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
    const { x, y, width, height, duration } = state
    api.start({
      x,
      y,
      width,
      height,
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
      api.start({
        width: clientWidth,
        height: clientHeight,
        x: 0,
        y: 0,
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

  const expandToViewport = useMemoizedFn(() => {
    if (!isExpandToViewport) {
      expandToViewportBeforeStateRef.current.set({
        ...transformRndStyle(rndStyle),
        duration: FULLSCREEN_DURATION,
      })
      api.start({
        width: clientWidth,
        height: clientHeight - DOCK_HEIGHT,
        x: 0,
        y: 0,
        config: {
          duration: FULLSCREEN_DURATION,
        },
      })
      setIsExpandToViewport(true)
    }
  })

  const exitViewport = useMemoizedFn(() => {
    if (isExpandToViewport) {
      restore(expandToViewportBeforeStateRef.current.get())
      setIsExpandToViewport(false)
    }
  })

  const collapse = useMemoizedFn(() => {
    if (activated) {
      collapseBeforeStateRef.current.set({
        ...transformRndStyle(rndStyle),
        duration: COLLAPSE_DURATION,
      })
      api.start({
        width: 0,
        height: 0,
        x: clientWidth / 2,
        y: clientHeight - DOCK_HEIGHT,
        config: {
          duration: COLLAPSE_DURATION,
        },
      })
      setActivated(false, onCollapsed)
    }
  })

  const expand = useMemoizedFn(() => {
    if (!activated) {
      restore(collapseBeforeStateRef.current.get(), () => setDisplay("block"))
      setActivated(true, onExpanded)
      setZIndex()
    }
  })

  const windowHandler = useRef<WindowHandler>({
    activated,
    isFullscreen,
    isExpandToViewport,
    collapse,
    expand,
    fullscreen,
    exitFullscreen,
    expandToViewport,
    exitViewport,
  })

  windowHandler.current.activated = activated
  windowHandler.current.isFullscreen = isFullscreen
  windowHandler.current.isExpandToViewport = isExpandToViewport

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
