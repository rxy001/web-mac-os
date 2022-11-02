import type { Listener } from "@eventEmitter"
import type { IconProps, WindowRef, WindowProps } from "../index"

export type UseApp = () => AppContextProps

export interface AppContextProps
  extends Omit<WindowRef, "subscribe" | "unSubscribe"> {
  subscribe: (event: AppEmitEventType, listener: Listener) => void
  unSubscribe: (event: AppEmitEventType, listener: Listener) => void
}
export interface AppProps extends WindowProps {
  icon: IconProps["icon"]
  iconType?: "round" | "circle"
}

export interface DesktopShortcutProps {
  title: string
  openApp: () => void
  icon: IconProps["icon"]
  iconMaskClassName: string
}

// 部分枚举值需要与 WindowEmitEventType 相同
export enum AppEmitEventType {
  APP_OPENED = "__APP_OPENED__",
  APP_CLOSE = "__APP_CLOSE__",
  APP_KEEP_IN_DOCK = "__APP_KEEP_IN_DOCK__",
  APP_REMOVE_IN_DOCK = "__APP_REMOVE_IN_DOCK__",
  APP_SHOWED = "__WINDOW_SHOWED__",
  APP_HIDDEN = "__WINDOW_HIDDEN__",
  APP_FULLSCREEN = "__WINDOW_FULLSCREEN__",
  APP_EXIT_FULLSCREEN = "__WINDOW_EXIT_FULLSCREEN__",
  APP_MINIMIZE = "__WINDOW_MINIMIZE__",
  APP_EXPAND = "__WINDOW_EXPAND__",
}

export interface DockShortcutProps {
  id: string
  title: string
  openApp: () => void
  icon: IconProps["icon"]
  iconMaskClassName: string
  defaultIsKeepInDock: boolean
  showWindow: () => void
  hideWindow: () => void
  closeApp: () => void
  keepInDock: () => void
  removeInDock: () => void
}
