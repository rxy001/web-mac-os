import {
  useMemo,
  useRef,
  useState,
  Children,
  useContext,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react"
import type { HTMLAttributes, MouseEvent, Ref } from "react"
import { createPortal } from "react-dom"
import { cloneElement, supportRef, composeRef, addEventListener } from "@utils"
import { useMemoizedFn, useUnmount } from "@chooks"
import { isFunction, reduce, isArray, includes, size } from "lodash"
import Popup from "./Popup"
import type { TriggerProps, Position, LongPressEvent } from "./interface"
import { GroupContext } from "./context"
import { getCurrentPosition } from "./utils"

type EventType =
  | "onClick"
  | "onMouseDown"
  | "onMouseEnter"
  | "onMouseLeave"
  | "onMouseUp"
  | "onContextMenu"
  | "onMouseMove"

const handlerTypes: EventType[] = [
  "onClick",
  "onMouseDown",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseUp",
  "onContextMenu",
  "onMouseMove",
]

// 1.children 必须支持 ref 获取到 dom， 非 forwardRef 组件可通过 getTriggerDOMNode 传递 dom
// 2.children 必须支持 mouseenter mouseLeave click 事件
// 3.Group 内不支持 所有 trigger.defaultPopupVisible 为 true
// 4.除 hover 外其他的 action ，当通过非 trigger 本身去点击显隐 popup，需要 stopPropagation
// 5.不支持，action 为 hover 时，鼠标移动到 popup， popup 不隐藏。

const Trigger = forwardRef<HTMLElement, TriggerProps>(
  (
    {
      popup,
      action,
      children,
      onVisibleChange,
      gerPopupContainer,
      popupPlacement = "top",
      defaultPopupVisible = false,
      visible: propsVisible,
      getTriggerDOMNode: propsGetTriggerDOMNode,
      ...props
    },
    ref,
  ) => {
    const groupContext = useContext(GroupContext)

    const isPressed = useRef(false)

    const startPosition = useRef<Position>()

    const timer = useRef<NodeJS.Timeout>()

    const isLongPressActive = useRef(false)

    const [popupVisible, setPopupVisibleImpl] = useState(
      propsVisible ?? defaultPopupVisible,
    )

    const prevPopuoVisible = useRef(popupVisible)

    const prevVisible = useRef<boolean>(false)

    const close = useMemoizedFn(() => {
      if (popupVisible) {
        setPopupVisible(false)
      }
    })

    const setPopupVisible = useMemoizedFn((visible: boolean) => {
      if (prevPopuoVisible.current !== visible) {
        // prevVisible.current === propsVisible 表示 trigger 内部调用的 setPopupVisible
        // 要完全受控于 propsVisible，因此不能直接 setPopupVisibleImpl
        if (
          propsVisible !== undefined &&
          prevVisible.current === propsVisible
        ) {
          onVisibleChange?.(visible)
          return
        }

        if (propsVisible === undefined) {
          onVisibleChange?.(visible)
        }

        if (visible && groupContext) {
          if (
            groupContext.currentPopup &&
            groupContext.currentPopup.close !== close
          ) {
            // https://github.com/facebook/react/issues/18178#issuecomment-595846312
            setTimeout(groupContext.currentPopup.close, 0)
            groupContext.setCurrentPopup(null)
          }
        }
        setPopupVisibleImpl(visible)
      }
      prevPopuoVisible.current = visible
    })

    // 相当于 getDerivedStateFromProps
    if (propsVisible !== undefined && prevVisible.current !== propsVisible) {
      setPopupVisible(propsVisible)
      prevVisible.current = propsVisible
    }

    const triggerRef = useRef<HTMLElement>(null as any)

    const popupRef = useRef<HTMLDivElement>(null as any)

    const fireEvents = useMemoizedFn((type: EventType, event: any) => {
      const childCallback = children.props[type]

      if (childCallback) {
        childCallback(event)
      }
      const callback = props[type]

      if (callback) {
        callback(event)
      }
    })

    const handlers = useRef(
      reduce(
        handlerTypes,
        (
          obj: {
            [key in EventType]?: (event: Event) => void
          },
          type: EventType,
        ) => {
          obj[type] = (event: Event) => fireEvents(type, event)
          return obj
        },
        {},
      ),
    )

    const getHandler = useMemoizedFn((type: EventType) => {
      if (children.props[type] && props[type]) {
        return handlers.current[type]
      }
      return children.props[type] || props[type]
    })

    const isAction = useMemoizedFn((a) =>
      isArray(action) ? includes(action, a) : action === a,
    )

    const getTriggerDOMNode = useMemoizedFn(() => {
      if (propsGetTriggerDOMNode) {
        return propsGetTriggerDOMNode()
      }
      return triggerRef.current
    })

    const getDocument = useMemoizedFn((element: HTMLElement) => {
      if (element) {
        return element.ownerDocument
      }
      return window.document
    })

    // -----------------handle click start---------------
    const onClick = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onClick", event)
      if (!popupVisible) {
        setPopupVisible(true)
      } else if (popupVisible) {
        setPopupVisible(false)
      }
    })

    // -----------------handle hover start---------------
    const onMouseEnter = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onMouseEnter", event)
      setPopupVisible(true)
    })

    const onMouseLeave = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onMouseLeave", event)
      close()
    })

    // -----------------handle contextMenu start---------------
    const onContextMenu = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onContextMenu", event)
      if (!popupVisible) {
        setPopupVisible(true)
      } else if (popupVisible) {
        setPopupVisible(false)
      }
      event.preventDefault()
    })

    // -----------------handle long press start---------------
    const onLongPressStart = useMemoizedFn((event: LongPressEvent<Element>) => {
      fireEvents("onMouseDown", event)

      if (isPressed.current) {
        return
      }

      startPosition.current = getCurrentPosition(event)

      isPressed.current = true

      timer.current = setTimeout(() => {
        isLongPressActive.current = true
        setPopupVisible(true)
      }, 800)
    })

    const cancel = useMemoizedFn(() => {
      startPosition.current = null
      isLongPressActive.current = false
      isPressed.current = false
      timer.current !== undefined && clearTimeout(timer.current)
    })

    const onLongPressEnd = useMemoizedFn((event: LongPressEvent<Element>) => {
      fireEvents("onMouseUp", event as MouseEvent)
      cancel()
    })

    const cancelOnMouseLeave = useMemoizedFn(
      (event: LongPressEvent<Element>) => {
        fireEvents("onMouseLeave", event as MouseEvent)

        cancel()
      },
    )

    const onMouseMove = useMemoizedFn((event: LongPressEvent<Element>) => {
      fireEvents("onMouseMove", event as MouseEvent)

      if (startPosition.current) {
        const currentPosition = getCurrentPosition(event)
        if (currentPosition) {
          const moveThreshold = 25
          const movedDistance = {
            x: Math.abs(currentPosition.x - startPosition.current.x),
            y: Math.abs(currentPosition.y - startPosition.current.y),
          }

          if (
            movedDistance.x > moveThreshold ||
            movedDistance.y > moveThreshold
          ) {
            cancel()
          }
        }
      }
    })

    const mouseLeaveHandler = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onMouseLeave", event)
      close()
      cancel()
    })

    // -----------------handle long press end---------------

    const getContainer = useMemoizedFn(
      () => gerPopupContainer?.() ?? document.body,
    )

    const trigger = useMemo(() => {
      const child = Children.only(children)

      const newProps: HTMLAttributes<HTMLElement> & {
        key: string
        ref?: Ref<any>
      } = {
        key: "trigger",
      }

      if (isAction("click")) {
        newProps.onClick = onClick
      } else {
        newProps.onClick = getHandler("onClick")
      }

      if (isAction("hover")) {
        newProps.onMouseEnter = onMouseEnter
        newProps.onMouseLeave = onMouseLeave
      } else {
        newProps.onMouseEnter = getHandler("onMouseEnter")
        newProps.onMouseLeave = getHandler("onMouseLeave")
      }

      if (isAction("contextMenu")) {
        newProps.onContextMenu = onContextMenu
      } else {
        newProps.onContextMenu = getHandler("onContextMenu")
      }

      if (isAction("longPress")) {
        newProps.onMouseDown = onLongPressStart
        newProps.onMouseMove = onMouseMove
        newProps.onMouseUp = onLongPressEnd
        if (isAction("hover")) {
          newProps.onMouseLeave = mouseLeaveHandler
        } else {
          newProps.onMouseLeave = cancelOnMouseLeave
        }
      } else {
        newProps.onMouseDown = getHandler("onMouseDown")
        newProps.onMouseMove = getHandler("onMouseMove")
        newProps.onMouseUp = getHandler("onMouseUp")
      }

      if (supportRef(child)) {
        newProps.ref = composeRef(triggerRef, (child as any).ref)
      }

      return cloneElement(child, {
        ...newProps,
      })
    }, [
      children,
      isAction,
      onClick,
      getHandler,
      onMouseEnter,
      onMouseLeave,
      onContextMenu,
      onLongPressStart,
      onMouseMove,
      onLongPressEnd,
      mouseLeaveHandler,
      cancelOnMouseLeave,
    ])

    const isOnlyAction = useMemoizedFn((a) =>
      isArray(action) ? size(action) === 1 && action[0] === a : action === a,
    )

    const onDocumentClick = useMemoizedFn((event) => {
      const root = getTriggerDOMNode()
      const popupNode = popupRef.current
      const { target } = event

      if (
        (!root.contains(target) ||
          isOnlyAction("contextMenu") ||
          isOnlyAction("longPress")) &&
        !popupNode.contains(target)
      ) {
        close()
      }
    })

    // 解决在 trigger.group 中，点击 click trigger 后，popup未隐藏，直接移动到 hover trigger，
    // 导致动画结束， 但是 popupvisible 未改变
    useEffect(() => {
      if (
        groupContext &&
        popupVisible &&
        (isAction("click") || isAction("contextMenu") || isAction("longPress"))
      ) {
        groupContext.setCurrentPopup({
          close,
        })
      }
    }, [close, groupContext, popupVisible, isAction])

    // clickOutside
    useEffect(() => {
      if (
        popupVisible &&
        (isAction("click") || isAction("contextMenu") || isAction("longPress"))
      ) {
        const document = getDocument(getTriggerDOMNode())
        return addEventListener(document, "mousedown", onDocumentClick)
      }
    }, [
      popupVisible,
      getDocument,
      isAction,
      getTriggerDOMNode,
      onDocumentClick,
    ])

    // close popup when trigger type contains 'onContextMenu' and scroll or blur
    useEffect(() => {
      if (popupVisible && isAction("contextMenu")) {
        const document = getDocument(getTriggerDOMNode())
        const scrollListener = addEventListener(document, "scroll", close)
        const blurListener = addEventListener(window, "blur", close)

        return () => {
          scrollListener()
          blurListener()
        }
      }
    }, [close, getDocument, getTriggerDOMNode, isAction, popupVisible])

    useUnmount(() => {
      timer.current && clearTimeout(timer.current)
    })

    useImperativeHandle(ref, () => triggerRef.current, [])

    const portal = useMemo(() => {
      if (popup && (popupVisible || popupRef.current)) {
        return createPortal(
          <Popup
            key="portal"
            ref={popupRef}
            visible={popupVisible}
            placement={popupPlacement}
            getTriggerDOMNode={getTriggerDOMNode}
          >
            {isFunction(popup) ? popup() : popup}
          </Popup>,
          getContainer(),
        )
      }
      return null
    }, [popup, popupVisible, popupPlacement, getTriggerDOMNode, getContainer])

    return (
      <>
        {trigger}
        {portal}
      </>
    )
  },
)
export default Trigger
