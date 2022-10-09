import { memo, useEffect, useMemo, useState, useRef } from "react"
import { useAppSelector, useMemoizedFn, useAppDispatch } from "@chooks"
import { map, size } from "lodash"
import { useSpring, animated } from "@react-spring/web"
import {
  ICON_SIZE,
  ICON_WRAPPER_WIDTH,
  DOCK_HEIGHT,
  FULLSCREEN_DURATION,
} from "@constants"
import { createPortal } from "react-dom"
import { selectApps } from "@slice/appsSlice"
import { pushDock, removeDock } from "@slice/dockSlice"
import Icon from "../Icon"
import styles from "./css/dock.less"
import Tooltip from "../Tooltip"

const iconStyle = {
  width: ICON_SIZE,
  height: ICON_SIZE,
}

const iconWrapperStyle = { width: ICON_WRAPPER_WIDTH }

function Dock() {
  const runningApps = useAppSelector(selectApps)
  const dispatch = useAppDispatch()

  const prevAppCountRef = useRef(0)

  const [springStyle, api] = useSpring(() => ({
    width: 0,
    y: 0,
    x: "-50%",
    opacity: 1,
  }))

  const [padding, setPadding] = useState("0")

  const mergedStyle = useMemo(
    () => ({ ...springStyle, padding, height: DOCK_HEIGHT }),
    [springStyle, padding],
  )

  const hideDock = useMemoizedFn(() => {
    api.start({
      y: DOCK_HEIGHT,
      opacity: 0,
      config: {
        duration: FULLSCREEN_DURATION,
      },
    })
  })

  const showDock = useMemoizedFn(() => {
    api.start({
      y: 0,
      opacity: 1,
      config: {
        duration: FULLSCREEN_DURATION,
      },
    })
  })

  useEffect(() => {
    dispatch(pushDock({ hideDock, showDock }))
    return () => {
      dispatch(removeDock())
    }
  }, [hideDock, showDock, dispatch])

  useEffect(() => {
    const length = size(runningApps)

    if (prevAppCountRef.current !== length) {
      if (length > 0) {
        setPadding(`0 ${(ICON_WRAPPER_WIDTH - ICON_SIZE) / 2}px`)
      } else if (!length) {
        setPadding("0")
      }

      api.start({
        width: ICON_WRAPPER_WIDTH * length,
        config: {
          duration: 100,
        },
      })
      prevAppCountRef.current = length
    }
  }, [runningApps, api])

  return createPortal(
    <animated.div key="dock" style={mergedStyle} className={styles.dockWrapper}>
      {map(runningApps, ({ icon, expand, title, id, getIconDOM }) => (
        <Tooltip text={title} key={id}>
          <div
            ref={getIconDOM}
            style={iconWrapperStyle}
            className={styles.iconWrapper}
          >
            <Icon
              image
              style={iconStyle}
              onClick={expand}
              className={styles.icon}
              icon={icon}
            />
          </div>
        </Tooltip>
      ))}
    </animated.div>,
    document.body,
  )
}

export default memo(Dock)
