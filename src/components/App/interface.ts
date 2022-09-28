import type { ReactNode, ComponentType, HTMLAttributes } from "react"
import type { IconProps } from ".."

export interface AppContextProps {
  closeApp: () => void
  openApp: () => void
}

export interface AppProps
  extends Omit<WindowProps, "children" | "id" | "title">,
    ShortcutProps {
  element: ReactNode | (() => Promise<{ default: ComponentType }>)
}

export interface ShortcutProps {
  icon: IconProps["icon"]
  title: ReactNode
}

export interface WindowProps {
  id: string
  children: ReactNode
  title: ReactNode
  style?: any
  defaultSize?: {
    width: number
    height: number
  }
  defaultPosition?: {
    x: number
    y: number
  }
  onFullscreen?: () => void
  onExitedFullscreen?: () => void
  onCollapsed?: () => void
  onExpanded?: () => void
  onOpened?: () => void
  onClosed?: () => void
}

export interface WindowHandler {
  activated: boolean
  isFullscreen: boolean
  isExpandToViewport: boolean
  fullscreen: () => void
  exitFullscreen: () => void
  collapse: () => void
  expand: () => void
  expandToViewport: () => void
  exitViewport: () => void
}
export interface WindowHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode
  className?: string
  windowHandler: WindowHandler
}
