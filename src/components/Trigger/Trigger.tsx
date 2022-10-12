import { memo, useMemo, useRef, useState, Children } from "react"
import type { HTMLAttributes, MouseEvent, Ref } from "react"
import { createPortal } from "react-dom"
import { cloneElement, supportRef, composeRef } from "@utils"
import { useMemoizedFn } from "@chooks"
import { includes, reduce } from "lodash"
import Popup from "./Popup"
import type { TriggerProps, DOMEvents } from "./interface"

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

// children 必须支持 ref 获取到 dom， 非 forwardRef 组件可通过 getTriggerDOMNode 传递 dom
function Trigger({
  children,
  actions,
  popup,
  showActions,
  hideActions,
  popupPlacement,
  getTriggerDOMNode: propsGetTriggerDOMNode,
  defaultPopupVisible = false,
  ...props
}: TriggerProps) {
  const [popupVisible, setPopupVisible] = useState(defaultPopupVisible)

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

  const onClick = useMemoizedFn((event: MouseEvent) => {
    fireEvents("onClick", event)
    setPopupVisible((prev) => !prev)
  })

  const onMouseEnter = useMemoizedFn((event: MouseEvent) => {
    fireEvents("onMouseEnter", event)
    setPopupVisible(true)
  })

  const onMouseLeave = useMemoizedFn((event: MouseEvent) => {
    fireEvents("onMouseLeave", event)
    setPopupVisible(false)
  })

  const getTriggerDOMNode = useMemoizedFn(() => {
    if (propsGetTriggerDOMNode) {
      return propsGetTriggerDOMNode()
    }
    return triggerRef.current
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

    if (supportRef(child)) {
      newProps.ref = composeRef(triggerRef, (child as any).ref)
    }

    return cloneElement(child, {
      ...newProps,
    })
  }, [
    children,
    getHandler,
    isHidenAction,
    isShowAction,
    onClick,
    onMouseEnter,
    onMouseLeave,
  ])

  const portal = useMemo(() => {
    if (popup && (popupVisible || popupRef.current)) {
      return createPortal(
        <Popup
          visible={popupVisible}
          placement={popupPlacement}
          getTriggerDOMNode={getTriggerDOMNode}
          ref={popupRef}
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
}

export default memo(Trigger)
