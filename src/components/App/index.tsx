import App from "./App"
import { EventType, useAppSubscribe, useApp } from "./hooks"

type AppType = typeof App
interface Component extends AppType {
  useApp: typeof useApp
  useAppSubscribe: typeof useAppSubscribe
  EventType: typeof EventType
}

const iternalApp = App as Component

iternalApp.useApp = useApp
iternalApp.useAppSubscribe = useAppSubscribe
iternalApp.EventType = EventType

export default iternalApp
export type { AppProps } from "./interface"
