import { forwardRef } from "react"
import { Tooltip } from "../index"
import type { PopoverProps } from "./interface"

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ content, children, ...props }, ref) => (
    <Tooltip ref={ref} text={content} {...props}>
      {children}
    </Tooltip>
  ),
)

export default Popover
