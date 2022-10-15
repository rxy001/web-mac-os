import type { SetStateAction } from "react"
import { useCallback, useState, useRef, useEffect } from "react"

type Callback = () => void

type Dispatch<A> = (value: A, Callback?: Callback) => void

// setState，可在更新之后执行 callback
export default function useSetState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>] {
  const [state, dispatch] = useState(initialState)
  const callback = useRef<Callback | undefined>()

  const setState = useCallback((s: any, cb?: Callback) => {
    dispatch(s)
    callback.current = cb
  }, [])

  useEffect(() => {
    callback.current?.()
  }, [state])

  return [state, setState]
}
