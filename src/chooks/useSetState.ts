import type { SetStateAction } from "react"
import {
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react"

type Callback = () => void

type Dispatch<A> = (value: A, Callback?: Callback) => void

// setState，可在更新之后执行 callback
export default function useSetState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>] {
  const [state, dispatch] = useState(initialState)
  const callbackRef = useRef<Callback | undefined>()

  const setState = useCallback((s: any, callback?: Callback) => {
    dispatch(s)
    callbackRef.current = callback
  }, [])

  useLayoutEffect(() => {
    callbackRef.current?.()
  }, [state])

  return [state, setState]
}
