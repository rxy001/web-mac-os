import type { ReactElement, MutableRefObject } from "react"
import type { RndBind, Position, Size } from "@chooks"
import type { Listener } from "@eventEmitter"

export enum WindowEmitEventType {
  WINDOW_SHOWED = "__WINDOW_SHOWED__",
  WINDOW_HIDDEN = "__WINDOW_HIDDEN__",
  WINDOW_FULLSCREEN = "__WINDOW_FULLSCREEN__",
  WINDOW_EXIT_FULLSCREEN = "__WINDOW_EXIT_FULLSCREEN__",
  WINDOW_MINIMIZE = "__WINDOW_MINIMIZE__",
  WINDOW_EXPAND = "__WINDOW_EXPAND__",
  WINDOW_RENDER_THUMBNAIL = "__WINDOW_RENDER_THUMBNAIL__",
  WINDOW_REMOVE_THUMBNAIL = "__WINDOW_REMOVE_THUMBNAIL__",
}

export type WindowContextProps = WindowRef

export type UseWindow = () => WindowContextProps

export interface WindowProps {
  minHeight?: number
  minWidth?: number
  maxHeight?: number
  maxWidth?: number
  defaultSize: Size
  defaultPosition?: Position
  title: string
  children: ReactElement
}

export type WindowHandlerEventType =
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
  subscribe: (event: WindowEmitEventType, listener: Listener) => void
  unSubscribe: (event: WindowEmitEventType, listener: Listener) => void
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

export interface ThumbnailProps {
  title: string
  minimize: (node: HTMLCanvasElement) => void
  expand: () => void
  containerRef: MutableRefObject<HTMLDivElement>
}
