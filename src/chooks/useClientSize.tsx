import { useMemo, useEffect, useState } from "react"
import { debounce } from "lodash"

let listenerCount = 0
export default function useClientSize() {
  const [size, setSize] = useState([
    document.body.clientWidth,
    document.body.clientHeight,
  ])

  const listener = useMemo(
    () =>
      debounce(() => {
        setSize([document.body.clientWidth, document.body.clientHeight])
      }, 100),
    [],
  )

  useEffect(() => {
    if (listenerCount === 0) {
      window.addEventListener("resize", listener)
    }
    listenerCount++
    return () => {
      if (listenerCount === 1) {
        window.removeEventListener("resize", listener)
      }
      listenerCount--
    }
  }, [listener])

  return size
}
