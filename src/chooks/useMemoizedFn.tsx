import { useMemo, useRef } from "react"

type Noop = (this: any, ...args: any[]) => any

export default function useMemoizedFn<T extends Noop>(fn: T): T {
  const ref = useRef(fn)

  ref.current = useMemo(() => fn, [fn])

  const memoizedFn = useRef<Noop>()

  if (!memoizedFn.current) {
    memoizedFn.current = function memoizedFn(this: any, ...rest: any[]) {
      return ref.current.apply(this, rest)
    }
  }

  return memoizedFn.current as T
}
