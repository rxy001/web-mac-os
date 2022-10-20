import type { ComponentType, ReactElement } from "react"
import type { RndBind, Position, Size } from "@chooks"
import type { Listener } from "@eventEmitter"
import type { IconProps } from "../index"
import type { EventType } from "./hooks"

export type UseApp = () => AppContextProps

interface CommonType {
  minHeight?: number
  minWidth?: number
  maxHeight?: number
  maxWidth?: number
  defaultSize: Size
  defaultPosition?: Position
  title: string
}

export interface AppContextProps extends WindowRef {
  subscribe: (event: EventType, listener: Listener) => void
  unSubscribe: (event: EventType, listener: Listener) => void
}
export interface AppProps extends CommonType {
  icon: IconProps["icon"]
  iconType?: "round" | "circle"
  element: () => Promise<{ default: ComponentType }>
}

export interface WindowProps extends CommonType {
  children: ReactElement
  style?: any
  onFullscreen?: () => void
  onExitFullscreen?: () => void
  onMinimize?: () => void
  onExpand?: () => void
  getDockShortcut?: () => HTMLDivElement
  onShowed?: () => void
  onHidden?: () => void
}

export type WindowEventType =
  | "fullscreen"
  | "exitFullscreen"
  | "minimize"
  | "expand"
  | "maximize"
  | "exitMaximized"
  | "isMinimized"
  | "isFullscreen"
  | "isMaximized"
  | "showWindow"
  | "hideWindow"
  | "isShow"

export interface WindowRef {
  fullscreen: () => void
  exitFullscreen: () => void
  minimize: () => void
  expand: () => void
  maximize: () => void
  exitMaximized: () => void
  isMinimized: () => boolean
  isFullscreen: () => boolean
  isMaximized: () => boolean
  showWindow: () => void
  hideWindow: () => void
  isShow: () => boolean
}

export interface WindowHeaderProps {
  title: string
  dragBind: RndBind
  className?: string
  isFullscreen: boolean
  isMaximized: boolean
  minimize: () => void
  exitMaximized: () => void
  exitFullscreen: () => void
  hideWindow: () => void
  maximize: () => void
  fullscreen: () => void
}

export interface DesktopShortcutProps {
  title: string
  openApp: () => void
  icon: IconProps["icon"]
  iconMaskClassName: string
}
