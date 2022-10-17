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
import { useMemoizedFn } from "@chooks"
import { isFunction, reduce } from "lodash"
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
// 3.Group 不支持 内所有 trigger.defaultPopupVisible 为 true
// 4.除 hover 外其他的 action ，当通过非 trigger 本身去点击显隐 popup，需要 stopPropagation

const Trigger = forwardRef<HTMLElement, TriggerProps>(
  (
    {
      popup,
      action,
      children,
      onVisibleChange,
      popupPlacement,
      defaultPopupVisible,
      visible: propsVisible,
      getTriggerDOMNode: propsGetTriggerDOMNode,
      ...props
    },
    ref,
  ) => {
    const groupContext = useContext(GroupContext)

    const isPressed = useRef(false)

    const prevPopuoVisible = useRef(false)

    const startPosition = useRef<Position>()

    const timer = useRef<NodeJS.Timeout>()

    const isLongPressActive = useRef(false)

    const [popupVisible, setPopupVisibleImpl] = useState(
      propsVisible ?? defaultPopupVisible,
    )

    const prevVisible = useRef<boolean>(false)

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

        if (visible && groupContext) {
          groupContext.currentPopup?.close()
          groupContext.setCurrentPopup(null)
          setPopupVisibleImpl(true)
        } else {
          setPopupVisibleImpl(visible)
        }
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

    const isAction = useMemoizedFn((a) => action === a)

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

    const onClick = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onClick", event)
      if (!popupVisible) {
        setPopupVisible(true)
      } else if (popupVisible) {
        setPopupVisible(false)
      }
    })

    const onMouseEnter = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onMouseEnter", event)
      setPopupVisible(true)
    })

    const onMouseLeave = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onMouseLeave", event)
      close()
    })

    const onContextMenu = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onContextMenu", event)
      setPopupVisible(true)

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

        if (!popupVisible) {
          setPopupVisible(true)
        } else if (popupVisible) {
          setPopupVisible(false)
        }
      }, 800)
    })

    const cancel = useMemoizedFn(() => {
      startPosition.current = null
      isLongPressActive.current = false
      isPressed.current = false
      timer.current !== undefined && clearTimeout(timer.current)
    })

    const onLongPressEnd = useMemoizedFn((event: LongPressEvent<Element>) => {
      fireEvents("onMouseUp", event as unknown as TouchEvent)

      // if (
      //   isLongPressActive.current &&
      //   popupVisible
      // ) {
      //   isMouseUpOnTrigger.current = true
      // }
      cancel()
    })

    const handleMouseLeave = useMemoizedFn((event: LongPressEvent<Element>) => {
      fireEvents("onMouseLeave", event as unknown as TouchEvent)

      cancel()
    })

    const handleMouseMove = useMemoizedFn((event: LongPressEvent<Element>) => {
      fireEvents("onMouseMove", event as unknown as TouchEvent)

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

    // -----------------handle long press end---------------

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
        newProps.onMouseMove = handleMouseMove
        newProps.onMouseUp = onLongPressEnd
        newProps.onMouseLeave = handleMouseLeave
      } else {
        newProps.onMouseDown = getHandler("onMouseDown")
        newProps.onMouseMove = getHandler("onMouseMove")
        newProps.onMouseUp = getHandler("onMouseUp")
      }

      if (!isAction("hover")) {
        newProps.onMouseLeave = getHandler("onMouseLeave")
      }

      if (supportRef(child)) {
        newProps.ref = composeRef(triggerRef, (child as any).ref)
      }

      const newChild = cloneElement(child, {
        ...newProps,
      })

      return newChild
    }, [
      children,
      isAction,
      onClick,
      getHandler,
      onMouseEnter,
      onMouseLeave,
      onContextMenu,
      onLongPressStart,
      handleMouseMove,
      onLongPressEnd,
      handleMouseLeave,
    ])

    const close = useMemoizedFn(() => {
      if (popupVisible) {
        setPopupVisible(false)
      }
    })

    const onDocumentClick = useMemoizedFn((event) => {
      const root = getTriggerDOMNode()
      const popupNode = popupRef.current
      const { target } = event

      if (
        (!root.contains(target) ||
          isAction("contextMenu") ||
          isAction("longPress")) &&
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
      if (popupVisible && (isAction("click") || isAction("contextMenu"))) {
        const document = getDocument(getTriggerDOMNode())
        return addEventListener(document, "click", onDocumentClick)
      }

      // longPress 如果过早的添加 click 事件会导致popup mouse up 时隐藏
      if (popupVisible && isAction("longPress")) {
        const document = getDocument(getTriggerDOMNode())

        let removeListener: any = null
        addEventListener(
          document,
          "click",
          () => {
            removeListener = addEventListener(
              document,
              "click",
              onDocumentClick,
            )
          },
          {
            once: true,
          },
        )
        return () => {
          removeListener && removeListener()
        }
      }
    }, [
      popupVisible,
      getDocument,
      isAction,
      getTriggerDOMNode,
      onDocumentClick,
    ])

    // close popup when trigger type contains 'onContextMenu' and scroll or bulr
    useEffect(() => {
      if (popupVisible && isAction("contextMenu")) {
        const document = getDocument(getTriggerDOMNode())
        const scrollListener = addEventListener(document, "scroll", close)
        const windowListener = addEventListener(window, "bulr", close)

        return () => {
          scrollListener()
          windowListener()
        }
      }
    }, [close, getDocument, getTriggerDOMNode, isAction, popupVisible])

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
          document.body,
        )
      }
      return null
    }, [popup, popupVisible, popupPlacement, getTriggerDOMNode])

    return (
      <>
        {trigger}
        {portal}
      </>
    )
  },
)

Trigger.defaultProps = {
  popupPlacement: "top",
  defaultPopupVisible: false,
}

export default Trigger
