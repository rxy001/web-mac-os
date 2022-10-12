import { useCallback, useLayoutEffect, useRef } from "react"
import { useMount, useLatest, useDebounceFn } from "./index"

export default function useResizeObserver(
  element: HTMLElement | undefined,
  callback: (...p: any[]) => any,
  wait?: number,
) {
  const latest = useLatest(callback)

  const listener = useDebounceFn(([{ target }]: ResizeObserverEntry[]) => {
    if (!document.documentElement.contains(target)) return
    latest.current(target)
  }, wait)

  const resizeObserver = useRef<ResizeObserver>(null as any)

  useMount(() => {
    resizeObserver.current = new ResizeObserver(listener)
  })

  useLayoutEffect(() => {
    let prevElement = element
    if (element) {
      resizeObserver.current.observe(element)
    }
    return () => {
      if (prevElement) {
        prevElement = undefined
        resizeObserver.current.disconnect()
      }
    }
  }, [element])

  return useCallback(() => {
    resizeObserver.current.disconnect()
  }, [])
}
