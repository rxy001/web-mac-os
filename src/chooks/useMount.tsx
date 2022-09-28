import { useLayoutEffect } from "react"

export default function useMount(fn: () => void) {
  // useLayouteffect 更符合 didMount
  // useEffect 会在挂载之后延迟执行，两者都有弊有利
  useLayoutEffect(() => {
    fn?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
