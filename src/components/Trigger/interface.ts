import type {
  ReactElement,
  DOMAttributes,
  ReactNode,
  CSSProperties,
} from "react"

type ActionType = "click" | "hover" | "contextMenu"

export type DOMEvents = Omit<
  DOMAttributes<HTMLElement>,
  "children" | "dangerouslySetInnerHTML"
>

export interface TriggerProps extends DOMEvents {
  children: ReactElement
  popup?: ReactElement
  actions?: ActionType | ActionType[]
  showActions?: ActionType[]
  hideActions?: ActionType[]
  defaultPopupVisible?: boolean

  getTriggerDOMNode?: () => HTMLElement
  popupPlacement?: "top" | "bottom"
}

export interface PopupProps {
  children: ReactNode
  visible?: boolean
  getTriggerDOMNode: () => HTMLElement
  placement?: "top" | "bottom"
}

export interface MotionProps {
  children: ReactNode
  visible?: boolean
  className?: string
  style?: CSSProperties
  startDelay?: number
  finishDelay?: number
}

export type PrevMotion = {
  cancel: (...p: any[]) => void
} | null
