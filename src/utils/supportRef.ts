import type { ReactElement } from "react"
import { isForwardRef } from "react-is"

export default function supportRef(nodeOrComponent: ReactElement) {
  if (typeof nodeOrComponent.type === "string") {
    return true
  }

  if (isForwardRef(nodeOrComponent)) {
    return true
  }

  return false
}
