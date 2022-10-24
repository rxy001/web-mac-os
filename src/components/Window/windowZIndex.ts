import { max, values } from "lodash"

type Name = string
type ZIndex = number
type Value = {
  [key: Name]: ZIndex
}

class WindowZIndex {
  value: Value = {}

  set(name: Name, zIndex: ZIndex) {
    this.value[name] = zIndex
    return zIndex
  }

  get(name: Name) {
    return this.value[name]
  }

  maxZIndex() {
    return max(values(this.value)) ?? 0
  }
}

export default new WindowZIndex()
