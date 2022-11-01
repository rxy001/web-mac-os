import type { Key, ReactElement } from "react"
import type { TooltipProps } from "../index"

interface menuItem {
  label: string
  key?: Key
  onClick?: () => void
  disabled?: boolean
}

export interface DropdownProps
  extends Omit<
    TooltipProps,
    "text" | "defaultVisible" | "visible" | "onVisibleChange" | "trigger"
  > {
  children: ReactElement
  menu: menuItem[]
  trigger?: "click" | "contextMenu" | "longPress"
}
