import { forwardRef } from "react"
import classNames from "classnames"
import styles from "./css/button.less"
import type { ButtonProps } from "./interface"

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { onClick, children, style, icon, className, type = "default", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      onClick={onClick}
      style={style}
      className={classNames(styles.button, type && styles[type], className)}
      {...props}
    >
      {icon && icon}
      <span className={classNames({ [styles.text]: !!icon })}>{children}</span>
    </button>
  ),
)

export default Button
