import { Icon } from "@brc"
import { memo } from "react"

const style = {
  width: 18,
  height: 18,
}

function Volume() {
  return <Icon icon="iconvolumeHigh" mask={false} style={style} />
}

export default memo(Volume)
