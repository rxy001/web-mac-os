import { map } from "lodash"
import classNames from "classnames"
import { memo, useMemo, useState } from "react"
import { cloneElement } from "@utils"
import { useMemoizedFn } from "@chooks"
import { Tooltip, Button } from "../index"
import type { DropdownProps } from "./interface"
import styles from "./css/dropdown.less"

function Dropdown({
  children,
  menu,
  trigger = "click",
  ...props
}: DropdownProps) {
  const [visible, setVisible] = useState(false)

  const hideMenu = useMemoizedFn(() => {
    setVisible(false)
  })

  const option = useMemo(
    () => (
      <div className={styles.menu} onClick={hideMenu}>
        {map(menu, ({ label, onClick, disabled, key }) => (
          <Button
            key={key ?? label}
            type="text"
            disabled={disabled}
            onClick={onClick}
            className={styles.button}
          >
            {label}
          </Button>
        ))}
      </div>
    ),
    [hideMenu, menu],
  )

  return (
    <Tooltip
      text={option}
      visible={visible}
      onVisibleChange={setVisible}
      trigger={trigger}
      {...props}
    >
      {cloneElement(children, {
        className: classNames(
          { [styles.bgc]: visible },
          children.props.className,
        ),
      })}
    </Tooltip>
  )
}

export default memo(Dropdown)
