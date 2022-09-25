import { useEffect, useRef, EffectCallback, DependencyList } from "react";

export default function useUpdateEffect(
  effect: EffectCallback,
  deps?: DependencyList
) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      return effect();
    } else {
      isMounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
