import { EventEmitterContext } from "./context"
import type { ProviderProps } from "./interface"

function Provider({ children, eventEmitter }: ProviderProps) {
  return (
    <EventEmitterContext.Provider value={eventEmitter}>
      {children}
    </EventEmitterContext.Provider>
  )
}

export default Provider
