import type { TriggerProps } from "../index"

export interface TooltipProps
  extends Omit<
    TriggerProps,
    "popupPlacement" | "action" | "popup" | "defaultPopupVisible"
  > {
  text: TriggerProps["popup"]
  placement?: TriggerProps["popupPlacement"]
  trigger?: TriggerProps["action"]
  defaultVisible?: TriggerProps["defaultPopupVisible"]
  distance?: number
  arrow?: boolean
  className?: string
}
