import { useRef } from "react"
import { Window } from "../index"

export default function useToggleVisible({
  hide,
  show,
}: {
  hide: () => void
  show: () => void
}) {
  const fullscreenApps = useRef(new Set<string>())

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_FULLSCREEN, (appName) => {
    hide()
    fullscreenApps.current.add(appName)
  })

  Window.useAppSubscribe(
    Window.EmitEventType.WINDOW_EXIT_FULLSCREEN,
    (appName) => {
      fullscreenApps.current.delete(appName)
      show()
    },
  )

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_MINIMIZE, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      show()
    }
  })

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_EXPAND, (appName) => {
    if (fullscreenApps.current.has(appName)) {
      hide()
    }
  })

  Window.useAppSubscribe(Window.EmitEventType.WINDOW_HIDDEN, (appName) => {
    if (fullscreenApps.current.delete(appName)) {
      show()
    }
  })
  return fullscreenApps.current
}
