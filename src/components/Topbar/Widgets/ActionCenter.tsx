import { memo } from "react"
import { Icon } from "@brc"
import centerImg from "@assets/center.svg"

const style = {
  width: 18,
  height: 18,
}

function ActionCenter() {
  return <Icon icon={centerImg} mask={false} style={style} />
}

export default memo(ActionCenter)
