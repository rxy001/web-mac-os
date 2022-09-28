import { memo, useEffect, useMemo, useState, useRef } from "react"
import { useAppSelector } from "@chooks"
import { forEach, map, size } from "lodash"
import { useSpring, animated } from "@react-spring/web"
import { DOCK } from "@constants"
import { selectApps } from "@slice/appsSlice"
import Icon from "../Icon"
import styles from "./css/dock.less"

const { ICON_SIZE, ICON_WRAPPER_WIDTH } = DOCK

const iconStyle = {
  width: ICON_SIZE,
  height: ICON_SIZE,
}

const iconWrapperStyle = { width: ICON_WRAPPER_WIDTH }

function Dock() {
  const runningApps = useAppSelector(selectApps)
  const prevAppCountRef = useRef(0)

  const [springStyle, api] = useSpring(() => ({
    width: 0,
    opacity: 1,
  }))

  const [padding, setPadding] = useState({
    padding: "0",
  })

  const mergedStyle = useMemo(
    () => ({ height: DOCK.DOCK_HEIGHT, ...springStyle, ...padding }),
    [springStyle, padding],
  )

  useEffect(() => {
    let fullscreen = false
    forEach(runningApps, ({ isFullscreen, activated }) => {
      if (isFullscreen && activated) {
        fullscreen = true
        return fullscreen
      }
    })

    if (fullscreen) {
      api.start({
        opacity: 0,
      })
    } else {
      api.start({
        opacity: 1,
      })
    }
  }, [runningApps, api])

  useEffect(() => {
    const length = size(runningApps)

    if (prevAppCountRef.current !== length) {
      if (length > 0) {
        setPadding({
          padding: `0 ${(ICON_WRAPPER_WIDTH - ICON_SIZE) / 2}px`,
        })
      } else if (!length) {
        setPadding({
          padding: "0",
        })
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

  return (
    <animated.div style={mergedStyle} className={styles.dockWrapper}>
      {map(runningApps, ({ icon, expand, id }) => (
        <div key={id} style={iconWrapperStyle} className={styles.iconWrapper}>
          <Icon
            image
            style={iconStyle}
            onClick={expand}
            className={styles.icon}
            icon={icon}
          />
        </div>
      ))}
    </animated.div>
  )
}

export default memo(Dock)
