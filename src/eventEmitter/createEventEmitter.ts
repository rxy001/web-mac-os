import type { Event, Listener, Listeners } from "./interface"

function callable(fn: any) {
  if (typeof fn !== "function") throw new TypeError(`${fn} is not a function`)
  return fn
}

export class EventEmitter {
  private eventListeners = new Map<Event, Listeners>()

  // private self = this
  constructor() {
    this.on = this.on.bind(this)
    this.emit = this.emit.bind(this)
    this.off = this.off.bind(this)
    this.once = this.once.bind(this)
  }

  on(event: Event, listener: Listener) {
    callable(listener)

    const listeners = this.eventListeners.get(event)

    if (listeners) {
      if (typeof listeners === "function") {
        const set = new Set([listeners, listener])
        this.eventListeners.set(event, set)
      } else {
        listeners.add(listener)
      }
    } else {
      this.eventListeners.set(event, listener)
    }
  }

  emit(event: Event, ...rest: any[]) {
    const listeners = this.eventListeners.get(event)

    if (listeners) {
      if (typeof listeners === "function") {
        listeners.apply(this, rest)
      } else {
        const current = [...listeners]
        current.forEach((listener) => {
          listener.apply(this, rest)
        })
      }
    }
  }

  off(event: Event, listener: Listener) {
    callable(listener)
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      if (typeof listeners === "function") {
        listeners === listener && this.eventListeners.delete(event)
      } else if (listeners.has(listener)) {
        if (listeners.size === 2) {
          listeners.forEach((l) => {
            if (l !== listener && (l as any).onceListener !== listener) {
              this.eventListeners.set(event, l)
            }
          })
        } else {
          listeners.delete(listener)
        }
      }
    }
  }

  once(event: Event, listener: Listener) {
    callable(listener)

    const fn = (...rest: any[]) => {
      this.off(event, fn)
      listener.apply(this, rest)
    }
    fn.onceListener = listener

    this.on(event, fn)
  }
}

function createEventEmitter(): EventEmitter
function createEventEmitter<T extends object>(obj?: T): T
function createEventEmitter<T extends object>(obj?: T) {
  const eventEmitter = new EventEmitter()

  if (obj && typeof obj === "object") {
    const { on, off, once, emit } = eventEmitter

    Object.defineProperties(obj, {
      on: {
        value: on.bind(eventEmitter),
      },
      off: {
        value: off.bind(eventEmitter),
      },
      once: {
        value: once.bind(eventEmitter),
      },
      emit: {
        value: emit.bind(eventEmitter),
      },
    })
    return obj
  }
  return eventEmitter
}

export default createEventEmitter
