import { useGesture } from "@use-gesture/react"
import type {
  UserHandlers,
  CoordinatesConfig,
  Vector2,
  Handler,
} from "@use-gesture/react"
import { useCallback, useEffect, useRef } from "react"
import { floor, forEach, min, max } from "lodash"
import type { SpringValues, SpringRef } from "@react-spring/web"
import { useSpring } from "@react-spring/web"
import type { ReactDOMAttributes } from "@use-gesture/react/dist/declarations/src/types"
import styles from "./css/resize.less"
import useUnmount from "./useUnmount"
import useMemoizedFn from "./useMemoizedFn"

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

type DefaultStyle = {
  scale?: number
  opacity?: number
}

type Style = Position & Size & DefaultStyle

type Bounds = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export type RndStyle = SpringValues<Style>

export type RndBind = (...args: any[]) => ReactDOMAttributes
export interface UseRndOptions {
  // drag options
  onDragStart?: UserHandlers["onDragStart"]
  onDrag?: UserHandlers["onDrag"]
  onDragEnd?: UserHandlers["onDragEnd"]
  axis?: CoordinatesConfig["axis"]
  disableDragging?: boolean
  dragBounds?: Bounds | (() => Bounds)

  // resize options
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onResizeStart?: UserHandlers["onDragStart"]
  onResize?: UserHandlers["onDrag"]
  onResizeEnd?: UserHandlers["onDragEnd"]
  enableResizing?: boolean
  resizeBounds?: Bounds | (() => Bounds)

  // common
  bounds?: Bounds | (() => Bounds)
  defaultStyle?: DefaultStyle
  defaultPosition?: Position
  defaultSize?: Size
}

const gestureTransform: (v: Vector2) => Vector2 = ([x, y]) => [
  floor(x),
  floor(y),
]

const useRnd = ({
  // drag options
  onDragStart,
  onDrag,
  onDragEnd,
  axis,
  disableDragging,
  dragBounds,

  // resize options
  onResizeStart,
  onResize,
  onResizeEnd,
  enableResizing = false,
  minHeight = 200,
  minWidth = 200,
  maxWidth = Infinity,
  maxHeight = Infinity,
  resizeBounds,

  // common
  bounds,
  defaultStyle = {},
  defaultSize = {
    width: 200,
    height: 200,
  },
  defaultPosition = {
    x: 0,
    y: 0,
  },
}: UseRndOptions = {}): [RndStyle, RndBind, RndBind, SpringRef<Style>] => {
  const resizeBorderRef = useRef<HTMLElement | null>(null)
  const resizeContainerRef = useRef<HTMLElement | null>(null)

  const [style, api] = useSpring<Style>(() => ({
    ...defaultPosition,
    ...defaultSize,
    ...defaultStyle,
  }))

  const dragBind = useGesture(
    {
      // ??????????????? onDragStart ?????? useGesture ?????? ??????????????? ??? undefined ?????????
      onDragStart(...rest) {
        onDragStart?.(...rest)
      },
      onDrag({ event, offset, dragging, ...rest }) {
        if (dragging) {
          const [x, y] = offset
          api.start({ x, y, immediate: true })
          onDrag?.({ dragging, offset, event, ...rest })
        }
      },
      onDragEnd(...rest) {
        onDragEnd?.(...rest)
      },
    },
    {
      drag: {
        axis,
        bounds: dragBounds ?? bounds,
        enabled: !disableDragging,
        transform: gestureTransform,
        from: () => [style.x.get(), style.y.get()],
        filterTaps: true,
      },
    },
  )

  const memoizedRect = useRef({
    width: defaultSize.width,
    height: defaultSize.height,
    x: defaultPosition.x,
    y: defaultPosition.y,
  })

  const generateSpringProps = useCallback<Handler<"drag">>(
    ({
      event,
      offset: [offsetX, offsetY],
      movement: [movementX, movementY],
    }) => {
      const props: {
        x?: number
        y?: number
        width?: number
        height?: number
      } = {}
      const {
        width: memoizedWidth,
        height: memoizedHeight,
        x: memoizedX,
        y: memoizedY,
      } = memoizedRect.current

      const target = event.target as HTMLElement
      const { position } = target.dataset

      function dragTop() {
        // ??????????????????y???????????????????????????
        props.y = max([
          min([offsetY, memoizedY + memoizedHeight - minHeight]),
          memoizedY + memoizedHeight - maxHeight,
        ])
        props.height = min([
          max([memoizedHeight - movementY, minHeight]),
          maxHeight,
        ])
      }

      function dragRight() {
        // ??????????????????????????????
        props.width = min([
          max([memoizedWidth + movementX, minWidth]),
          maxWidth,
        ])
      }

      function dragBottom() {
        // ??????????????????????????????
        props.height = min([
          max([memoizedHeight + movementY, minHeight]),
          maxHeight,
        ])
      }

      function dragLeft() {
        // ??????????????????y???????????????????????????
        props.x = max([
          min([offsetX, memoizedX + memoizedWidth - minWidth]),
          memoizedX + memoizedWidth - maxWidth,
        ])
        props.width = min([
          max([memoizedWidth - movementX, minWidth]),
          maxWidth,
        ])
      }

      switch (position) {
        case "top":
          dragTop()
          break
        case "topRight":
          dragTop()
          dragRight()
          break
        case "right":
          dragRight()
          break
        case "bottomRight":
          dragRight()
          dragBottom()
          break
        case "bottom":
          dragBottom()
          break
        case "bottomLeft":
          dragBottom()
          dragLeft()
          break
        case "left":
          dragLeft()
          break
        case "topLeft":
          dragTop()
          dragLeft()
          break
        default:
          break
      }

      return props
    },
    [maxHeight, maxWidth, minHeight, minWidth],
  )

  const resizeBindImpl = useGesture(
    {
      onDragStart(...rest) {
        memoizedRect.current = {
          width: style.width.get(),
          height: style.height.get(),
          x: style.x.get(),
          y: style.y.get(),
        }
        onResizeStart?.(...rest)
      },

      onDrag({ dragging, ...restArgu }) {
        if (dragging) {
          const props = generateSpringProps({ dragging, ...restArgu })
          api.start({
            ...props,
            immediate: true,
          })
          onResize?.({ dragging, ...restArgu })
        }
      },
      onDragEnd(...rest) {
        onResizeEnd?.(...rest)
      },
    },
    {
      drag: {
        bounds: bounds ?? resizeBounds,
        enabled: enableResizing,
        from: (state) => {
          const { position } = (state.target as HTMLElement).dataset
          if (
            position === "left" ||
            position === "top" ||
            position === "topLeft"
          ) {
            return [style.x.get(), style.y.get()]
          }
          if (position === "topRight") {
            return [style.x.get() + style.width.get(), style.y.get()]
          }
          if (position === "bottomLeft") {
            return [style.x.get(), style.y.get() + style.height.get()]
          }
          return [
            style.x.get() + style.width.get(),
            style.y.get() + style.height.get(),
          ]
        },
        transform: gestureTransform,
        filterTaps: true,
      },
    },
  )

  const resizeBind = useCallback(
    () => ({
      ref: resizeContainerRef,
      ...resizeBindImpl(),
    }),
    [resizeBindImpl],
  )

  useEffect(() => {
    if (enableResizing && !resizeBorderRef.current) {
      resizeBorderRef.current = createHiddenBorder()
      resizeContainerRef.current?.appendChild(resizeBorderRef.current)
    } else if (resizeBorderRef.current) {
      forEach(resizeBorderRef.current.children, (element) => {
        enableResizing
          ? element.classList.remove(styles.disableResize)
          : element.classList.add(styles.disableResize)
      })
    }
  }, [enableResizing])

  useUnmount(() => {
    resizeBorderRef.current = null
  })

  const memoizedDragBind = useMemoizedFn(dragBind)
  const memoizedResizeBind = useMemoizedFn(resizeBind)

  return [style, memoizedDragBind, memoizedResizeBind, api]
}

export default useRnd

function createHiddenBorder() {
  const div = document.createElement("div")
  div.innerHTML = `
    <div class="${styles.resizeTop}" data-position="top"></div>
    <div class="${styles.resizeTopRight}" data-position="topRight"></div>
    <div class="${styles.resizeRight}" data-position="right"></div>
    <div
      class="${styles.resizeBottomRight}"
      data-position="bottomRight"
    ></div>
    <div class="${styles.resizeBottom}" data-position="bottom"></div>
    <div
      class="${styles.resizeBottomLeft}"
      data-position="bottomLeft"
    ></div>
    <div class="${styles.resizeLeft}" data-position="left"></div>
    <div class="${styles.resizeTopLeft}" data-position="topLeft"></div>
  `
  return div
}
