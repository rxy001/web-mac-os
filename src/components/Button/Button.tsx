import { memo } from "react"
import classNames from "classnames"
import styles from "./css/button.less"
import type { ButtonProps } from "./interface"

function Button({
  onClick,
  children,
  style,
  type,
  icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={classNames(styles.button, type && styles[type], className)}
      {...props}
    >
      {icon && icon}
      <span>{children}</span>
    </button>
  )
}

export default memo(Button)

Button.defaultProps = {
  type: "default",
}
