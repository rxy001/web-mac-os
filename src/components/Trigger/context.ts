import { createContext } from "react"
import type { GroupContextType } from "./interface"

export const GroupContext = createContext<GroupContextType | null>(null)
