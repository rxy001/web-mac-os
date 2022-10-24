import { createContext } from "react"
import type { WindowContextProps } from "./interface"

export const WindowContext = createContext<WindowContextProps>({} as any)
