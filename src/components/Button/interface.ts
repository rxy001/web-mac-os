import type {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEventHandler,
  ReactNode,
} from "react"

export interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "onClick" | "style" | "className"
  > {
  className?: string
  icon?: React.ReactNode
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
  type?: "default" | "primary" | "text"
}
