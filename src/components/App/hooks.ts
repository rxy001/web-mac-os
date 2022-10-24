import { useContext } from "react"
import { useSubscribe } from "@eventEmitter"
import type { Listener } from "@eventEmitter"
import { AppContext } from "./context"
import type { UseApp, AppEmitEventType } from "./interface"

export const useApp: UseApp = () => {
  const app = useContext(AppContext)
  return app
}

export function useAppSubscribe(event: AppEmitEventType, listener: Listener) {
  return useSubscribe(event, listener)
}
