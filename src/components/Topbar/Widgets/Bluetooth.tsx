import { Icon } from "@brc"
import { memo } from "react"

const style = {
  width: 18,
  height: 18,
}

function Bluetooth() {
  return <Icon icon="iconbluetooth" mask={false} style={style} />
}

export default memo(Bluetooth)
