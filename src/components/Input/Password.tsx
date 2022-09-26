import { useCallback, useState, memo } from "react"
import Input from "./index"
import type { PasswordProps } from "./interface"
import { Icon } from "../index"
import styles from "./css"

function Password({ iconProps, ...props }: PasswordProps) {
  const [visible, setVisible] = useState(false)
  const onClick = useCallback(() => setVisible((v) => !v), [])

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      suffix={
        <Icon
          mask={false}
          className={styles.passwordIcon}
          onClick={onClick}
          type={visible ? "iconeye_protection" : "iconvisible"}
          {...iconProps}
        />
      }
    />
  )
}

export default memo(Password)
