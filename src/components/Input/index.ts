import type { MemoExoticComponent } from "react"
import type React from "react"
import Input from "./Input"
import Password from "./Password"
import type { InputProps } from "./interface"

export type { PasswordProps } from "./interface"

interface Component extends MemoExoticComponent<React.FC<InputProps>> {
  Password: typeof Password
}

const iternalInput = Input as Component

iternalInput.Password = Password

export type { InputProps }
export default iternalInput
