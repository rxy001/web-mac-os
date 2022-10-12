import { useCallback, useEffect, useRef } from "react"
import useLatest from "./useLatest"

function useInterval(fn: () => void, delay?: number) {
  const latestFn = useLatest(fn)
  const timerRef = useRef<NodeJS.Timer>()

  useEffect(() => {
    if (typeof delay !== "number" || (delay && delay < 0)) return

    timerRef.current = setInterval(() => {
      latestFn.current()
    }, delay)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [delay, latestFn])

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  return clear
}

export default useInterval
