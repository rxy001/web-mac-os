import { createContext } from "react"
import type { AliveScopeContextValue } from "./interface"

export const AliveScopeContext = createContext<AliveScopeContextValue>(
  {} as any,
)
