import type { EffectCallback, DependencyList } from "react"
import { useEffect, useRef } from "react"
import useLatest from "./useLatest"

export default function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  const isMounted = useRef(false)

  const cb = useLatest(effect)

  useEffect(() => {
    if (isMounted.current) {
      cb.current()
    } else {
      isMounted.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(
    () => () => {
      isMounted.current = false
    },
    [],
  )
}
