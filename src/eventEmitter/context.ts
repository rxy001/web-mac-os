import { createContext } from "react"
import type { EventEmitter } from "./createEventEmitter"

export const EventEmitterContext = createContext<EventEmitter>(null as any)
