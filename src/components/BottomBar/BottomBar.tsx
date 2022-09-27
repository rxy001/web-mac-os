import { memo, useEffect, useMemo, useState, useRef } from "react"
import { useAppSelector } from "chooks"
import { forEach, map, size } from "lodash"
import { useSpring, animated } from "@react-spring/web"
import Icon from "../Icon"
import styles from "./css/bottomBar.less"
import { selectApps } from "../../redux/appsSlice"

function BottomBarProps() {
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
    () => ({ ...springStyle, ...padding }),
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
      if (length > 1) {
        setPadding({
          padding: "0 5px",
        })
      } else if (length === 1) {
        setPadding({
          padding: "0",
        })
      }

      api.start({
        width: 45 * length,
        config: {
          duration: 100,
        },
      })
      prevAppCountRef.current = length
    }
  }, [runningApps, api])

  return (
    <animated.div style={mergedStyle} className={styles.bottomBarWrapper}>
      {map(runningApps, ({ iconType, expand, id }) => (
        <div key={id} className={styles.iconWrapper}>
          <Icon onClick={expand} className={styles.icon} type={iconType} />
        </div>
      ))}
    </animated.div>
  )
}

export default memo(BottomBarProps)
