import { forEach } from "lodash"
import type { Ref } from "react"

export default function composeRef<T>(...refs: Ref<T>[]) {
  if (refs.length === 1) {
    return refs[0]
  }
  return (node: T) => {
    forEach(refs, (ref) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref && typeof ref === "object") {
        // @ts-ignore
        ref.current = node
      }
    })
  }
}
