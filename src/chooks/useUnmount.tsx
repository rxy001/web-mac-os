import { useLayoutEffect } from "react"
import useLatest from "./useLatest"

export default function useUnmount(fn: () => void) {
  const latestFn = useLatest(fn)

  useLayoutEffect(
    () => () => {
      latestFn.current()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
}
