import {
  useGesture,
  UserHandlers,
  CoordinatesConfig,
  Vector2,
  Handler,
} from "@use-gesture/react";
import { useCallback, useEffect, useRef } from "react";
import { floor, forEach, min } from "lodash";
import { useSpring, SpringValues, SpringRef } from "@react-spring/web";
import { ReactDOMAttributes } from "@use-gesture/react/dist/declarations/src/types";
import styles from "./css/resize.less";

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface UseRndOptions {
  // drag options
  defaultPosition?: Position;
  onDragStart?: UserHandlers["onDragStart"];
  onDrag?: UserHandlers["onDrag"];
  onDragEnd?: UserHandlers["onDragEnd"];
  axis?: CoordinatesConfig["axis"];
  bounds?: CoordinatesConfig["bounds"];
  disableDragging?: boolean;

  // resize options
  defaultSize?: Size;
  minHeight?: number;
  minWidth?: number;
  onResizeStart?: UserHandlers["onDragStart"];
  onResize?: UserHandlers["onDrag"];
  onResizeEnd?: UserHandlers["onDragEnd"];
  enableResizing?: boolean;
}

const container = document.body;

const gestureTransform: (v: Vector2) => Vector2 = ([x, y]) => [
  floor(x),
  floor(y),
];

const useRnd = ({
  // drag options
  onDragStart,
  onDrag,
  onDragEnd,
  axis,
  bounds,
  disableDragging,

  // resize options
  onResizeStart,
  onResize,
  onResizeEnd,
  enableResizing = false,
  minHeight = 100,
  minWidth = 100,
  defaultSize = {
    width: 200,
    height: 200,
  },

  // common
  defaultPosition = {
    x: 0,
    y: 0,
  },
}: UseRndOptions = {}): [
  SpringValues<Position & Size>,
  (...args: any[]) => ReactDOMAttributes,
  (...args: any[]) => ReactDOMAttributes,
  SpringRef<Position & Size>
] => {
  const resizeBorderRef = useRef<HTMLElement | null>(null);
  const resizeContainerRef = useRef<HTMLElement | null>(null);

  const [style, api] = useSpring<Position & Size>(() => {
    return {
      ...defaultPosition,
      ...defaultSize,
    };
  });

  const dragBind = useGesture(
    {
      // 直接将参数 onDragStart 传给 useGesture 报错 。。。。。 传 undefined 不成～
      onDragStart(...rest) {
        if (!disableDragging) {
          onDragStart?.(...rest);
        }
      },
      onDrag({ down, event, offset, ...rest }) {
        if (!disableDragging) {
          event.stopPropagation();
          const [x, y] = offset;
          api.start({ x, y, immediate: down });
          onDrag?.({ down, offset, event, ...rest });
        }
      },
      onDragEnd(...rest) {
        if (!disableDragging) {
          onDragEnd?.(...rest);
        }
      },
    },
    {
      drag: {
        axis,
        bounds,
        transform: gestureTransform,
        from: () => [style.x.get(), style.y.get()],
      },
    }
  );

  const memoizedSize = useRef({
    width: defaultSize.width,
    height: defaultSize.height,
  });

  const generateSpringProps = useCallback<Handler<"drag">>(
    ({
      event,
      lastOffset: [lastOffsetX, lastOffsetY],
      offset: [offsetX, offsetY],
      movement: [movementX, movementY],
    }) => {
      let props: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
      } = {};

      const target = event.target as HTMLElement;
      const position = target.dataset.position;

      const { width: memoizedWidth, height: memoizedHeight } =
        memoizedSize.current;

      function dragTop() {
        // 向下拖动时，y的最大值边界
        props.y = min([offsetY, lastOffsetY + memoizedHeight - minHeight]);

        // 向上拖动时，高度最大值边界
        props.height = min([
          memoizedHeight - movementY,
          lastOffsetY + memoizedHeight,
        ]);
      }

      function dragRight() {
        // 向右拖动时，宽度最大值边界
        props.width = min([
          memoizedWidth + movementX,
          container.clientWidth - lastOffsetX,
        ]);
      }

      function dragBottom() {
        // 向下拖动时，高度最大值边界
        props.height = min([
          memoizedHeight + movementY,
          container.clientHeight - lastOffsetY,
        ]);
      }

      function dragLeft() {
        // 向右拖动时，y的最大值边界
        props.x = min([offsetX, lastOffsetX + memoizedWidth - minWidth]);

        // 向左拖动时，宽度最大值边界
        props.width = min([
          memoizedWidth - movementX,
          lastOffsetX + memoizedWidth,
        ]);
      }

      switch (position) {
        case "top":
          dragTop();
          break;
        case "topRight":
          dragTop();
          dragRight();
          break;
        case "right":
          dragRight();
          break;
        case "bottomRight":
          dragRight();
          dragBottom();
          break;
        case "bottom":
          dragBottom();
          break;
        case "bottomLeft":
          dragBottom();
          dragLeft();
          break;
        case "left":
          dragLeft();
          break;
        case "topLeft":
          dragTop();
          dragLeft();
          break;
      }

      // 最小值边界处理
      if (props.height && props.height < minHeight) {
        props.height = minHeight;
      }

      if (props.width && props.width < minWidth) {
        props.width = minWidth;
      }

      if (props.x && props.x < 0) {
        props.x = 0;
      }

      if (props.y && props.y < 0) {
        props.y = 0;
      }

      return props;
    },
    [minWidth, minHeight]
  );

  const resizeBindImpl = useGesture(
    {
      onDragStart(...rest) {
        if (enableResizing) {
          memoizedSize.current = {
            width: style.width.get(),
            height: style.height.get(),
          };
          onResizeStart?.(...rest);
        }
      },

      onDrag({ down, ...restArgu }) {
        if (enableResizing) {
          const props = generateSpringProps({ down, ...restArgu });
          onResize?.({ down, ...restArgu });
          if (!down) {
            api.start({
              ...props,
              immediate: down,
              cancel: true,
            });
            return;
          }

          api.start({
            ...props,
            immediate: down,
          });
        }
      },
      onDragEnd(...rest) {
        if (enableResizing) {
          onResizeEnd?.(...rest);
        }
      },
    },
    {
      drag: {
        from: () => [style.x.get(), style.y.get()],
        transform: gestureTransform,
      },
    }
  );

  const resizeBind = useCallback(() => {
    return {
      ref: resizeContainerRef,
      ...resizeBindImpl(),
    };
  }, [resizeBindImpl]);

  useEffect(() => {
    if (enableResizing && !resizeBorderRef.current) {
      resizeBorderRef.current = createHiddenBorder();
      resizeContainerRef.current?.appendChild(resizeBorderRef.current);
    } else if (resizeBorderRef.current) {
      forEach(resizeBorderRef.current.children, (element) => {
        enableResizing
          ? element.classList.remove(styles.disableResize)
          : element.classList.add(styles.disableResize);
      });
    }
  }, [enableResizing]);

  return [style, dragBind, resizeBind, api];
};

export default useRnd;

function createHiddenBorder() {
  const div = document.createElement("div");
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
  `;
  return div;
}
