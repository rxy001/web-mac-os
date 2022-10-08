import { forEach } from "lodash"
import type { MutableRefObject } from "react"

type Ref<T> = MutableRefObject<T | null> | ((instance: T | null) => void)

export default function composeRef<T>(...refs: Ref<T>[]) {
  const list = refs.filter((ref) => ref)

  if (list.length === 1) {
    return list[0]
  }

  return (node: T) => {
    forEach(list, (ref) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref && typeof ref === "object" && "current" in ref) {
        ref.current = node
      }
    })
  }
}
