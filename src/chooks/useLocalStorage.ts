import { useCallback, useMemo } from "react"

export default function useLocalStorage() {
  const getItem = useCallback((key: string) => {
    const json = localStorage.getItem(key)
    if (json) {
      try {
        return JSON.parse(json)
      } catch (error) {
        return json
      }
    }
    return json
  }, [])

  const setItem = useCallback((key: string, value: any) => {
    localStorage.setItem(
      key,
      value && typeof value === "object" ? JSON.stringify(value) : value,
    )
  }, [])

  return useMemo(() => ({ getItem, setItem }), [getItem, setItem])
}
