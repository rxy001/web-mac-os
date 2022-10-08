import { useLayoutEffect, useRef } from "react"
import { useMemoizedFn, useMount } from "@chooks"

export default function useResizeObserver(
  element: HTMLElement | undefined,
  callback: (...p: any[]) => any,
) {
  const onResize = useMemoizedFn(([{ target }]: ResizeObserverEntry[]) => {
    if (!document.documentElement.contains(target)) return
    callback()
  })

  const resizeObserverRef = useRef<ResizeObserver>(null as any)

  useMount(() => {
    resizeObserverRef.current = new ResizeObserver(onResize)
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
