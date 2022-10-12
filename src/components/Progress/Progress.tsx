import { memo, useEffect, useMemo } from "react"
import { useSpring, animated } from "@react-spring/web"
import type { ProgressProps } from "./interface"
import styles from "./css/progress.less"

function Progress({
  percent,
  strokeColor,
  trailColor,
  strokeWidth,
  strokeHeight,
  springConfig,
  duration,
}: ProgressProps) {
  const [style, api] = useSpring(() => ({
    width: "0%",
    config: {
      duration,
      ...springConfig,
    },
  }))

  const progressInnerStyle = useMemo(
    () => ({
      backgroundColor: trailColor,
      ...style,
    }),
    [trailColor, style],
  )

  const progressOuterStyle = useMemo(
    () => ({
      backgroundColor: strokeColor,
      width: strokeWidth,
      height: strokeHeight,
    }),
    [strokeColor, strokeWidth, strokeHeight],
  )

  useEffect(() => {
    api.start({
      width: `${percent}%`,
    })
  }, [percent, springConfig, api])

  return (
    <div className={styles.progressOuter} style={progressOuterStyle}>
      <animated.div
        style={progressInnerStyle}
        className={styles.progressInner}
      />
    </div>
  )
}

export default memo(Progress)
