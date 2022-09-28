import type { CSSProperties, MouseEventHandler, SVGAttributes } from "react"

export interface IconProps
  extends Omit<
    SVGAttributes<HTMLSpanElement>,
    "clasName" | "onClick" | "style" | "mask"
  > {
  icon: string
  style?: CSSProperties
  className?: string
  image?: boolean
  mask?: boolean
  maskStyle?: CSSProperties
  maskClassName?: string
  onClick?: MouseEventHandler<HTMLSpanElement>
}
