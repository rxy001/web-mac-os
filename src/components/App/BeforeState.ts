export interface PreState {
  x: number
  y: number
  width: number
  height: number
  duration: number
  opacity: number
}

export default class BeforeState {
  state: PreState = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    duration: 200,
    opacity: 1,
  }

  set(state: PreState) {
    this.state = state
  }

  get() {
    return this.state
  }
}
