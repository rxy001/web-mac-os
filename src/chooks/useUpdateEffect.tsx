import type { EffectCallback, DependencyList } from "react"
import { useEffect, useRef } from "react"
import useLatest from "./useLatest"

export default function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  const isMountedRef = useRef(false)

  const effectRef = useLatest(effect)

  useEffect(() => {
    if (isMountedRef.current) {
      return effectRef.current()
    }
    isMountedRef.current = true

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
