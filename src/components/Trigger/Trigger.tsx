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
import { includes, reduce } from "lodash"
import Popup from "./Popup"
import type { TriggerProps, DOMEvents } from "./interface"
import { GroupContext } from "./context"

type EventType = keyof DOMEvents

const handlerTypes: EventType[] = [
  "onClick",
  "onMouseDown",
  "onTouchStart",
  "onMouseEnter",
  "onMouseLeave",
  "onFocus",
  "onBlur",
  "onContextMenu",
]

// 1.children 必须支持 ref 获取到 dom， 非 forwardRef 组件可通过 getTriggerDOMNode 传递 dom
// 2.children 必须支持 mouseenter mouseLeave click 事件
// 3.Group 不支持 内所有 trigger.defaultPopupVisible 为 true

const Trigger = forwardRef<HTMLElement, TriggerProps>(
  (
    {
      popup,
      actions,
      children,
      showActions,
      hideActions,
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

    const [popupVisible, setPopupVisibleImpl] = useState(
      propsVisible ?? defaultPopupVisible,
    )

    const prevVisible = useRef<boolean>(false)

    const setPopupVisible = useMemoizedFn((visible: boolean) => {
      if (visible && groupContext) {
        groupContext.currentPopup?.close()
        groupContext.setCurrentPopup(null)
        setPopupVisibleImpl(true)
      } else {
        setPopupVisibleImpl(visible)
      }

      if (visible !== prevVisible.current) {
        onVisibleChange?.(visible)
        prevVisible.current = visible
      }
    })

    if (propsVisible !== undefined && prevVisible.current !== propsVisible) {
      setPopupVisible(propsVisible)
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

    const isShowAction = useMemoizedFn(
      (a) => includes(actions, a) || includes(showActions, a),
    )

    const isHidenAction = useMemoizedFn(
      (a) => includes(actions, a) || includes(hideActions, a),
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

    const onClick = useMemoizedFn((event: MouseEvent) => {
      fireEvents("onClick", event)
      if (!popupVisible && isShowAction("click")) {
        setPopupVisible(true)
      } else if (popupVisible && isHidenAction("click")) {
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

    const trigger = useMemo(() => {
      const child = Children.only(children)

      const newProps: HTMLAttributes<HTMLElement> & {
        key: string
        ref?: Ref<any>
      } = {
        key: "trigger",
      }
      if (isShowAction("click") || isHidenAction("click")) {
        newProps.onClick = onClick
      } else {
        newProps.onClick = getHandler("onClick")
      }

      if (isShowAction("hover")) {
        newProps.onMouseEnter = onMouseEnter
      } else {
        newProps.onMouseEnter = getHandler("onMouseEnter")
      }

      if (isHidenAction("hover")) {
        newProps.onMouseLeave = onMouseLeave
      } else {
        newProps.onMouseLeave = getHandler("onMouseLeave")
      }

      if (isShowAction("contextMenu")) {
        newProps.onContextMenu = onContextMenu
      } else {
        newProps.onContextMenu = getHandler("onContextMenu")
      }

      if (supportRef(child)) {
        newProps.ref = composeRef(triggerRef, (child as any).ref)
      }
      return cloneElement(child, {
        ...newProps,
      })
    }, [
      children,
      onContextMenu,
      getHandler,
      isHidenAction,
      isShowAction,
      onClick,
      onMouseEnter,
      onMouseLeave,
    ])

    const onDocumentClick = useMemoizedFn((event) => {
      const root = getTriggerDOMNode()
      const popupNode = popupRef.current
      const { target } = event
      if (!root.contains(target) && !popupNode.contains(target)) {
        close()
      }
    })

    const close = useMemoizedFn(() => {
      setPopupVisible(false)
      onVisibleChange?.(false)
    })

    useEffect(() => {
      // 解决在 trigger.group 中，点击 click trigger 后，popup未隐藏，直接移动到 hover trigger，
      // 导致动画结束， 但是 popupvisible 未改变
      if (
        groupContext &&
        popupVisible &&
        !isHidenAction("hover") &&
        (isShowAction("click") || isShowAction("contextMenu"))
      ) {
        groupContext.setCurrentPopup({
          close,
        })
      }
    }, [close, groupContext, popupVisible, isShowAction, isHidenAction])

    // clickOutside
    useEffect(() => {
      if (
        popupVisible &&
        (isHidenAction("click") || isShowAction("contextMenu"))
      ) {
        const document = getDocument(getTriggerDOMNode())
        return addEventListener(document, "click", onDocumentClick)
      }
    }, [
      popupVisible,
      getDocument,
      isShowAction,
      getTriggerDOMNode,
      onDocumentClick,
      isHidenAction,
    ])

    // close popup when trigger type contains 'onContextMenu' and scroll or bulr
    useEffect(() => {
      if (popupVisible && isShowAction("contextMenu")) {
        const document = getDocument(getTriggerDOMNode())
        const scrollListener = addEventListener(document, "scroll", close)
        const windowListener = addEventListener(window, "bulr", close)

        return () => {
          scrollListener()
          windowListener()
        }
      }
    }, [close, getDocument, getTriggerDOMNode, isShowAction, popupVisible])

    useImperativeHandle(ref, () => triggerRef.current, [])

    const portal = useMemo(() => {
      if (popup && (popupVisible || popupRef.current)) {
        return createPortal(
          <Popup
            ref={popupRef}
            visible={popupVisible}
            placement={popupPlacement}
            getTriggerDOMNode={getTriggerDOMNode}
          >
            {popup}
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
