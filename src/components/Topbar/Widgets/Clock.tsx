import { memo, useState } from "react"
import { useInterval } from "@chooks"

const style = {
  letterSpacing: 1,
}

function getTime() {
  const date = new Date()
  const h = date.getHours()
  const m = date.getMinutes()
  return `${h}:${m < 10 ? `0${m}` : m}`
}

function Clock() {
  const [time, setTime] = useState<string>(getTime)

  useInterval(() => {
    setTime(getTime)
  }, 10000)

  return <div style={style}>{time}</div>
}

export default memo(Clock)
