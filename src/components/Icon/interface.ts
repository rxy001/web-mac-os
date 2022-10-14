import type {
  CSSProperties,
  MouseEventHandler,
  SVGAttributes,
  ReactNode,
} from "react"

export interface IconProps
  extends Omit<
    SVGAttributes<HTMLSpanElement>,
    "clasName" | "onClick" | "style" | "mask"
  > {
  icon?: string | ReactNode
  style?: CSSProperties
  className?: string
  mask?: boolean
  maskStyle?: CSSProperties
  maskClassName?: string
  onClick?: MouseEventHandler<HTMLSpanElement>
}
