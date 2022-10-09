import { useReducer } from "react"

export default function useForceUpdate() {
  const [ignore, forceUpdate] = useReducer((x) => x + 1, 0)

  return forceUpdate
}
