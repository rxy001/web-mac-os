import { useEffect } from "react"
import useLatest from "./useLatest"

export default function useUnmount(fn: () => void) {
  const latestFn = useLatest(fn)

  useEffect(
    () => () => {
      latestFn.current()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
}
