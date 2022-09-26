import type { MouseEventHandler, SVGAttributes } from "react"

export interface IconProps
  extends Omit<
    SVGAttributes<HTMLSpanElement>,
    "clasName" | "onClick" | "style" | "mask"
  > {
  type: string
  className?: string
  mask?: boolean
  onClick?: MouseEventHandler<HTMLSpanElement>
}
