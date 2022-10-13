import Trigger from "./Trigger"
import Group from "./Group"

type TriggerType = typeof Trigger

interface Component extends TriggerType {
  Group: typeof Group
}

const internalTrigger = Trigger as Component

internalTrigger.Group = Group

export default internalTrigger
export type { TriggerProps } from "./interface"
