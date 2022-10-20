import type { IconProps } from "../index"

export interface DockShortcutProps {
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
