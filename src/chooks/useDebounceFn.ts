import { debounce } from "lodash"
import { useMemo } from "react"
import useLatest from "./useLatest"
import useUnmount from "./useUnmount"

type Noop = (...p: any[]) => void

export default function useDebounceFn<T extends Noop>(fn: T, delay?: number) {
  const fnRef = useLatest(fn)

  const debounceFn = useMemo(
    () => debounce((...rest: any[]) => fnRef.current(...rest), delay),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useUnmount(() => debounceFn.cancel())

  return debounceFn
}
