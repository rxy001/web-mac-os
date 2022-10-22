import type {
  ReactElement,
  ReactNode,
  CSSProperties,
  MouseEvent,
  TouchEvent,
} from "react"

type ActionType = "click" | "hover" | "contextMenu" | "longPress"

export interface DOMEvents {
  onClick?: (e: MouseEvent) => void
  onMouseDown?: (e: MouseEvent) => void
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  onMouseUp?: (e: MouseEvent) => void
  onContextMenu?: (e: MouseEvent) => void
  onMouseMove?: (e: MouseEvent) => void
}

export interface TriggerProps extends DOMEvents {
  children: ReactElement
  popup?: ReactNode | (() => ReactNode)
  action: ActionType
  defaultPopupVisible?: boolean
  getTriggerDOMNode?: () => HTMLElement
  popupPlacement?: PopupProps["placement"]
  visible?: boolean
  onVisibleChange?: (p: boolean) => void
}

export interface PopupProps {
  children: ReactNode
  visible?: boolean
  getTriggerDOMNode: () => HTMLElement
  placement?:
    | "top"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
}

export interface MotionProps {
  children: ReactNode
  visible?: boolean
  className?: string
  style?: CSSProperties
}

export type CurrentMotion = {
  cancel: (...p: any[]) => void
} | null

export type CurrentPopup = {
  close: () => void
  action: string
} | null

export interface GroupContextType {
  currentPopup: CurrentPopup
  currentMotion: CurrentMotion
  setCurrentPopup: (e: CurrentPopup) => void
  setCurrentMotion: (e: CurrentMotion) => void
}

export type Position = {
  x: number
  y: number
} | null

export type LongPressEvent<Target = Element> =
  | MouseEvent<Target>
  | TouchEvent<Target>
