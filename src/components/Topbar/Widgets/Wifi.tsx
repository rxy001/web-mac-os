import { Icon } from "@brc"
import { memo } from "react"

const style = {
  width: 36,
  height: 18,
}

function Wifi() {
  return <Icon icon="iconWIFI" mask={false} style={style} />
}

export default memo(Wifi)
