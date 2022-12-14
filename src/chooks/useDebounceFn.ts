import { debounce } from "lodash"
import { useMemo } from "react"
import useLatest from "./useLatest"
import useUnmount from "./useUnmount"

type Noop = (...p: any[]) => void

export default function useDebounceFn<T extends Noop>(fn: T, wait?: number) {
  const latest = useLatest(fn)

  const debounceFn = useMemo(
    () => debounce((...rest: any[]) => latest.current(...rest), wait),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useUnmount(() => debounceFn.cancel())

  return debounceFn
}
