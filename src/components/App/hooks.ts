import { useContext } from "react"
import { useSubscribe } from "@eventEmitter"
import type { Listener } from "@eventEmitter"
import { AppContext } from "./context"
import type { UseApp } from "./interface"

export const useApp: UseApp = () => {
  const app = useContext(AppContext)
  return app
}

export enum EventType {
  Fullscreen = "__APP_FULLSCREEN__",
  ExitFullScreen = "__APP_EXIT_FULLSCREEN__",
  Minimize = "__APP_MINIMIZE__",
  Expand = "__APP_EXPAND__",
  Opened = "__APP_OPENED__",
  Close = "__APP_CLOSE__",
}

export function useAppSubscribe(event: EventType, listener: Listener) {
  return useSubscribe(event, listener)
}
