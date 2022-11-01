import { Window } from "@brc"
import type { WindowRef } from "@brc"
import { useEffect, useRef } from "react"

const defaultSize = {
  width: 600,
  height: 400,
}

export default function Login({ onClose }: { onClose: () => void }) {
  const ref = useRef<WindowRef>(null)

  useEffect(() => {
    let temp = ref.current
    temp?.subscribe(Window.EmitEventType.WINDOW_HIDDEN, onClose)
    return () => {
      temp?.unSubscribe(Window.EmitEventType.WINDOW_HIDDEN, onClose)
      temp = null
    }
  }, [onClose])

  return (
    <Window
      ref={ref}
      title="登陆"
      element={() => import("./LoginContainer")}
      defaultSize={defaultSize}
      maxHeight={500}
      maxWidth={700}
      minWidth={470}
      minHeight={333}
    />
  )
}
