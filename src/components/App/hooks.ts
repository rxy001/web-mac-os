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
  APP_OPENED = "__APP_OPENED__",
  APP_CLOSE = "__APP_CLOSE__",
  APP_KEEP_IN_DOCK = "__APP_KEEP_IN_DOCK__",
  APP_REMOVE_IN_DOCK = "__APP_REMOVE_IN_DOCK__",
  WINDOW_SHOWED = "__WINDOW_OPENED__",
  WINDOW_HIDDEN = "__WINDOW_CLOSED__",
  WINDOW_FULLSCREEN = "__WINDOW_FULLSCREEN__",
  WINDOW_EXIT_FULLSCREEN = "__WINDOW_EXIT_FULLSCREEN__",
  WINDOW_MINIMIZE = "__WINDOW_MINIMIZE__",
  WINDOW_EXPAND = "__WINDOW_EXPAND__",
}

export function useAppSubscribe(event: EventType, listener: Listener) {
  return useSubscribe(event, listener)
}
