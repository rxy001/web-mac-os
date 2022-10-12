import type { ReactNode } from "react"
import type { EventEmitter } from "./createEventEmitter"

export type Event = string | symbol
export type Listener = (...p: any[]) => void
export type Listeners = Set<Listener> | Listener

export interface ProviderProps {
  children: ReactNode
  eventEmitter: EventEmitter
}
