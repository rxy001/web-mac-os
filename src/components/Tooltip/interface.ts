import type { ReactElement, ReactNode } from "react"
import type { TriggerProps } from "../index"

export interface TooltipProps {
  children: ReactElement
  text: ReactNode
  placement?: TriggerProps["popupPlacement"]
  distance?: number
  trigger?: TriggerProps["actions"]
}
