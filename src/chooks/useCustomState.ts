import {
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
  SetStateAction,
  useEffect,
} from "react";

type Effect = () => void;

type Dispatch<A> = (value: A, effect?: Effect) => void;

export default function useCustomState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const [state, dispatch] = useState(initialState);
  const effectRef = useRef<Effect | undefined>();

  const setState = useCallback((s: any, effect?: Effect) => {
    dispatch(s);
    effectRef.current = effect;
  }, []);

  useLayoutEffect(() => {
    effectRef.current?.();
  }, [state]);

  useEffect(() => {
    return () => {
      effectRef.current = undefined;
    };
  }, []);

  return [state, setState];
}
