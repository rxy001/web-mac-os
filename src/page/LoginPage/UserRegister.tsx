import type { FocusEventHandler, ChangeEvent } from "react"
import { memo, useState, useCallback } from "react"
import { Input, Button } from "brc"
import styles from "./css"

interface UserRegisterProps {
  changeBackgroundImage: FocusEventHandler<HTMLInputElement>
}

function UserRegister({ changeBackgroundImage }: UserRegisterProps) {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const login = useCallback(() => {}, [])

  const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }, [])

  const onPhoneChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value)
  }, [])

  return (
    <div>
      <div className={styles.userRegister}>
        <Input
          value={phone}
          className={styles.phone}
          prefix="手机号"
          onChange={onPhoneChange}
        />
        <Input.Password
          value={password}
          onChange={onPasswordChange}
          prefix="密码"
          className={styles.password}
          onFocus={changeBackgroundImage}
          onBlur={changeBackgroundImage}
        />
      </div>
      <div className={styles.registerButton}>
        <Button type="primary" onClick={login} style={{ width: "50%" }}>
          注册
        </Button>
      </div>
    </div>
  )
}

export default memo(UserRegister)
