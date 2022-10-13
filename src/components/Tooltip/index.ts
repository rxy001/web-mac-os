import Tooltip from "./Tooltip"
import Trigger from "../Trigger"

type TooltipType = typeof Tooltip

interface Component extends TooltipType {
  Group: typeof Trigger.Group
}

const internalTooltip = Tooltip as Component

internalTooltip.Group = Trigger.Group

export default internalTooltip

export type { TooltipProps } from "./interface"
