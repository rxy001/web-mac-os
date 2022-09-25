import { ReactNode, ComponentType, HTMLAttributes, MouseEvent } from "react";
import { IconProps } from "..";

export interface AppContextProps {
  closeApp: () => void;
  openApp: () => void;
}

export interface AppProps extends ShortcutProps {
  element: ReactNode | (() => Promise<{ default: ComponentType }>);
}

export interface ShortcutProps {
  iconType: IconProps["type"];
  title: ReactNode;
}

export interface WindowProps {
  children: ReactNode;
  title: ReactNode;
  style?: any;
  onFullscreen?: () => void;
  onExitedFullscreen?: () => void;
  onCollapsed?: () => void;
  onExpanded?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  id: string;
}

export interface WindowHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  className?: string;
  fullscreen?: (e: MouseEvent) => void;
  collapse?: (e: MouseEvent) => void;
  isFullscreen?: boolean;
}

export interface WindowHandler {
  fullscreen: () => void;
  collapse: () => void;
  expand: () => void;
  activated: boolean;
  isFullscreen: boolean;
}
