import { useContext } from "react"
import { useSubscribe } from "@eventEmitter"
import type { Listener } from "@eventEmitter"
import { WindowContext } from "./context"
import type { UseWindow, WindowEmitEventType } from "./interface"

export const useWindow: UseWindow = () => useContext(WindowContext)

export function useWindowSubscribe(
  event: WindowEmitEventType,
  listener: Listener,
) {
  return useSubscribe(event, listener)
}
