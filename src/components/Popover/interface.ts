import type { ReactNode } from "react"
import type { TriggerProps } from "../Trigger"

export interface PopoverProps
  extends Pick<
    TriggerProps,
    "visible" | "onVisibleChange" | "defaultPopupVisible" | "children"
  > {
  content: ReactNode
  trigger: TriggerProps["actions"]
  placement?: TriggerProps["popupPlacement"]
}
