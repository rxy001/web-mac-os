import { forEach, size } from "lodash"
import { useAppSelector, useUpdateEffect } from "@chooks"
import { selectApps } from "@slice/appsSlice"
import { selectDock } from "@slice/dockSlice"

export default function useOnAppFullScreen() {
  const runningApps = useAppSelector(selectApps)

  const dock = useAppSelector(selectDock)

  useUpdateEffect(() => {
    if (!size(runningApps)) {
      return
    }

    let fullscreen = false
    forEach(runningApps, ({ isFullscreen, isActivated }) => {
      if (isFullscreen && isActivated) {
        fullscreen = true
        return fullscreen
      }
    })

    if (fullscreen) {
      dock.hideDock()
    } else {
      dock.showDock()
    }
  }, [runningApps, dock])
}
