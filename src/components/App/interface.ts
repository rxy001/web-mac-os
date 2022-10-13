import type { ComponentType, MutableRefObject, ReactElement } from "react"
import type { RndBind, Position, Size } from "@chooks"
import type { Listener } from "@eventEmitter"
import type { IconProps } from "../index"
import type { EventType } from "./hooks"

export type UseApp = () => AppContextProps

export interface AppContextProps extends WindowHandlers {
  closeApp: () => void
  openApp: () => void
  subscribe: (event: EventType, listener: Listener) => void
  unSubscribe: (event: EventType, listener: Listener) => void
}
export interface AppProps {
  icon: IconProps["icon"]
  title: string
  element: () => Promise<{ default: ComponentType }>
  defaultSize: Size
  defaultPosition?: Position
}

export interface DesktopShortcutProps {
  icon: IconProps["icon"]
  title: string
  openApp: () => void
}

export interface DockShortcutProps {
  iconWrapperWidth?: number
  iconSize?: number
  id: string
  openApp: () => void
  icon: IconProps["icon"]
}

export interface WindowProps {
  id: string
  children: ReactElement
  title: string
  style?: any
  defaultSize: Size
  defaultPosition?: Position
  onFullscreen?: () => void
  onExitFullscreen?: () => void
  onMinimize?: () => void
  onExpand?: () => void
}

export type WindowHandlerType =
  | "fullscreen"
  | "exitFullscreen"
  | "minimize"
  | "expand"
  | "maximize"
  | "exitMaximize"
  | "isActivated"
  | "isFullscreen"
  | "isMaximized"

export interface WindowHandlers {
  fullscreen: () => void
  exitFullscreen: () => void
  minimize: () => void
  expand: () => void
  maximize: () => void
  exitMaximize: () => void
  isActivated: () => boolean
  isFullscreen: () => boolean
  isMaximized: () => boolean
}

export interface WindowRef extends WindowHandlers {
  dockShortcutRef: MutableRefObject<HTMLDivElement>
}
export interface WindowHeaderProps {
  title: string
  dragBind: RndBind
  className?: string
}
