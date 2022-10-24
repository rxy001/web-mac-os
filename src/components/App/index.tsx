import App from "./App"
import { useAppSubscribe, useApp } from "./hooks"
import { AppEmitEventType } from "./interface"

type AppType = typeof App
interface Component extends AppType {
  useApp: typeof useApp
  useAppSubscribe: typeof useAppSubscribe
  EmitEventType: typeof AppEmitEventType
}

const iternalApp = App as Component

iternalApp.useApp = useApp
iternalApp.useAppSubscribe = useAppSubscribe
iternalApp.EmitEventType = AppEmitEventType

export default iternalApp
export type { AppProps } from "./interface"
