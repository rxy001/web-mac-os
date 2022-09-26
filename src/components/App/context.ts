import { createContext } from "react"
import type { AppContextProps } from "./interface"

export const AppContext = createContext<AppContextProps>({} as any)
