import { max, values } from "lodash";

type Name = string;
type ZIndex = number;
type Value = {
  [key: Name]: ZIndex;
};

class WindowZIndex {
  value: Value = {};

  set(name: Name, zIndex: ZIndex) {
    return (this.value[name] = zIndex);
  }

  get(name: Name) {
    return this.value[name];
  }

  maxZIndex() {
    return max(values(this.value)) ?? 0;
  }
}

export default new WindowZIndex();
