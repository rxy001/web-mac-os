import { memo, useMemo, useState } from "react"
import { Dropdown } from "@brc"
import appleImage from "@assets/apple.svg"
import { useMemoizedFn } from "@chooks"
import { Login } from "../../windows"
import styles from "./css/systemMenu.less"

function SystemMenu() {
  const [visible, setVisible] = useState(false)

  const menu = useMemo(
    () => [
      {
        label: "登陆",
        onClick: () => {
          setVisible(true)
        },
      },
    ],
    [],
  )

  const onClose = useMemoizedFn(() => {
    setVisible(false)
  })

  return (
    <>
      <Dropdown menu={menu} placement="bottomLeft" arrow={false} distance={2}>
        <div className={styles.apple}>
          <img src={appleImage} alt="apple" className={styles.icon} />
        </div>
      </Dropdown>
      {visible && <Login onClose={onClose} />}
    </>
  )
}

export default memo(SystemMenu)
