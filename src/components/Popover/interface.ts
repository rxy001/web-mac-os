import type { TooltipProps } from "../index"

export interface PopoverProps extends Omit<TooltipProps, "text"> {
  content: TooltipProps["text"]
}
