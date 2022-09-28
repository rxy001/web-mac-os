import type { ChangeEvent } from "react"
import { useState, memo } from "react"
import { useMemoizedFn } from "@chooks"
import classNames from "classnames"
import styles from "./css/input.less"
import type { InputProps } from "./interface"

function Input({
  suffix,
  prefix,
  style,
  defaultValue,
  className,
  onChange: oc,
  value: propsValue,
  ...props
}: InputProps) {
  const [value, setValue] = useState<InputProps["value"]>(defaultValue)

  const onChange = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => {
    if (propsValue === undefined) {
      setValue(e.target.value)
    }
    oc?.(e)
  })

  const renderInput = useMemoizedFn(
    (
      style: InputProps["style"] = {},
      className: InputProps["className"] = "",
    ) => (
      <input
        style={style}
        className={classNames(styles.input, className)}
        onChange={onChange}
        value={propsValue ?? value}
        placeholder={typeof prefix === "string" ? `请输入${prefix}` : ""}
        {...props}
      />
    ),
  )

  return prefix || suffix ? (
    <span style={style} className={classNames(styles.inputWrapper, className)}>
      {prefix && <span className={styles.prefix}>{prefix}</span>}
      {renderInput()}
      {suffix && <span className={styles.suffix}>{suffix}</span>}
    </span>
  ) : (
    renderInput(style, className)
  )
}

export default memo(Input)

Input.defaultProps = {
  defaultValue: "",
}
