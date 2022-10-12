import { useMemoizedFn } from "@chooks"
import { useCallback, useContext, useEffect, useRef } from "react"
import { EventEmitterContext } from "./context"
import type { Event, Listener } from "./interface"

export function useEventEmitter() {
  const eventEmitter = useContext(EventEmitterContext)
  return eventEmitter
}

// 通过 useSubscribe 订阅的，不能在通过 event.off 取消订阅
export function useSubscribe(event: Event, listner: Listener) {
  const eventEmitter = useContext(EventEmitterContext)
  const isSubscribed = useRef(true)

  const memoized = useMemoizedFn(listner)

  useEffect(() => {
    eventEmitter.on(event, memoized)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      isSubscribed.current === true && eventEmitter.off(event, memoized)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return useCallback(() => {
    isSubscribed.current === false
    eventEmitter.off(event, memoized)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
