import { useMount } from "@chooks"
import { memo, useRef } from "react"
import html2canvas from "html2canvas"
import { Tooltip } from "../index"
import styles from "./css/window.less"
import type { ThumbnailProps } from "./interface"

function Thumbnail({ title, minimize, expand, containerRef }: ThumbnailProps) {
  const thumbnailRef = useRef<HTMLCanvasElement>(null as any)
  const rect = useRef(containerRef.current.getBoundingClientRect())

  useMount(() => {
    html2canvas(containerRef.current, {
      imageTimeout: 0,
      canvas: thumbnailRef.current,
    }).then(() => {
      minimize(thumbnailRef.current)
    })
  })
  return (
    <Tooltip text={title} distance={25}>
      <canvas
        key="canvas"
        width={rect.current.width * 2}
        height={rect.current.height * 2}
        ref={thumbnailRef}
        onClick={expand}
        className={styles.thumbnail}
      />
    </Tooltip>
  )
}

export default memo(Thumbnail)
