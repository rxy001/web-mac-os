import { useCallback, useEffect, useRef } from "react"
import type { MutableRefObject } from "react"
import { isFunction, keys, size } from "lodash"
import { useMount, useLatest, useDebounceFn } from "./index"

export default function useResizeObserver(
  nodeRef:
    | HTMLElement
    | MutableRefObject<HTMLElement>
    | (() => HTMLElement)
    | undefined,
  callback: (...p: any[]) => any,
  wait = 0,
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

  useEffect(() => {
    let prevNode: any = null
    if (nodeRef) {
      let node = null
      if (isFunction(nodeRef)) {
        node = nodeRef()
      } else if ("current" in nodeRef && size(keys(nodeRef)) === 1) {
        node = nodeRef.current
      } else {
        node = nodeRef as HTMLElement
      }
      prevNode = node
      resizeObserver.current.observe(node)
    }
    return () => {
      if (prevNode) {
        prevNode = undefined
        resizeObserver.current.disconnect()
      }
    }
  }, [nodeRef])

  return useCallback(() => {
    resizeObserver.current.disconnect()
  }, [])
}
