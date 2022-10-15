import { useEffect } from "react"

export default function useMount(fn: () => void) {
  useEffect(() => {
    fn?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
