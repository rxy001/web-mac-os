import { useLayoutEffect, useRef } from "react"
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

  const resizeObserverRef = useRef<ResizeObserver>(null as any)

  useMount(() => {
    resizeObserverRef.current = new ResizeObserver(listener)
  })

  useLayoutEffect(() => {
    let prevElement = element
    if (element) {
      resizeObserverRef.current.observe(element)
    }
    return () => {
      if (prevElement) {
        prevElement = undefined
        resizeObserverRef.current.disconnect()
      }
    }
  }, [element])

  return () => {
    resizeObserverRef.current.disconnect()
  }
}
