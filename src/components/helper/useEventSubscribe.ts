import { useMemoizedFn, useUnmount } from "@chooks"
import type { Listener, Event } from "@eventEmitter"
import { useRef } from "react"
import { useEventEmitter } from "@eventEmitter"

export default function useEventSubscribe<T extends Event>(title: string) {
  const listeners = useRef(new Map())

  const eventEmitter = useEventEmitter()

  const subscribe = useMemoizedFn((event: T, listener: Listener) => {
    function l(t: string) {
      if (t === title) listener()
    }
    listeners.current.set(listener, { event, listener: l })
    eventEmitter.on(event, l)
  })

  const unSubscribe = useMemoizedFn((event: T, listener: Listener) => {
    const { listener: l } = listeners.current.get(listener)
    listeners.current.delete(l)
    eventEmitter.off(event, l)
  })

  useUnmount(() => {
    listeners.current.forEach(({ event, listener }) => {
      eventEmitter.off(event, listener)
    })
  })

  return [subscribe, unSubscribe]
}
