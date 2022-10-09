import { memo, useLayoutEffect, useMemo } from "react"
import { useSpring, animated } from "@react-spring/web"
import type { ProgressProps } from "./interface"
import styles from "./css/progress.less"

function Progress({
  percent,
  strokeColor,
  trailColor,
  strokeWidth,
  strokeHeight,
  duration,
}: ProgressProps) {
  const [style, api] = useSpring(() => ({
    width: "0%",
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

  useLayoutEffect(() => {
    api.start({
      width: `${percent}%`,
      config: {
        duration,
      },
    })
  }, [percent, duration, api])

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
