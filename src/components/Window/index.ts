import Window from "./Window"
import { useWindowSubscribe, useWindow } from "./hooks"
import type { UseWindow } from "./interface"
import { WindowEmitEventType } from "./interface"

type WindowType = typeof Window
interface Component extends WindowType {
  useWindow: UseWindow
  useAppSubscribe: typeof useWindowSubscribe
  EmitEventType: typeof WindowEmitEventType
}

const iternalWindow = Window as Component

iternalWindow.useWindow = useWindow
iternalWindow.useAppSubscribe = useWindowSubscribe
iternalWindow.EmitEventType = WindowEmitEventType

export default iternalWindow

export { WindowEmitEventType }

export type {
  WindowProps,
  WindowRef,
  WindowHandlerEventType,
} from "./interface"
