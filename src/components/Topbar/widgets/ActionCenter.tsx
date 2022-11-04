import { memo, useState } from "react"
import { Icon, Popover } from "@brc"
import centerImg from "@assets/center.svg"
import classNames from "classnames"
import { useMemoizedFn } from "@chooks"
import darkMode from "../../../darkMode"
import styles from "../css/actionCenter.less"

function ActionCenter() {
  const [ignore, setIsDark] = useState(darkMode.isDarkMode)
  const [visible, setVisible] = useState(false)

  const toggleMode = useMemoizedFn(() => {
    setIsDark((p) => {
      if (p) {
        darkMode.toggleLightMode()
      } else {
        darkMode.toggleDarkMode()
      }
      return !p
    })
  })

  return (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      trigger="click"
      content={
        <div className={styles.actionCenter}>
          <div className={styles.moduels} onClick={toggleMode}>
            <div className={styles.iconWrapper}>
              <Icon icon="iconmoon" mask={false} className={styles.icon} />
            </div>
            <span className={styles.label}>深色模式</span>
          </div>
        </div>
      }
      arrow={false}
      placement="bottom"
      className={styles.popup}
    >
      <Icon
        icon={centerImg}
        mask={false}
        className={classNames(styles.centerIcon, {
          [styles.bgc]: visible,
        })}
      />
    </Popover>
  )
}

export default memo(ActionCenter)
