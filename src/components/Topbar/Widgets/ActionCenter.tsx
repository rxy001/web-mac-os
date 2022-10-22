import { memo, useState } from "react"
import { Icon, Popover } from "@brc"
import centerImg from "@assets/center.svg"
import { useMemoizedFn, usePreload } from "@chooks"
import darkMode from "../../../darkMode"
import darkImage from "../../../assets/bg-dark.jpg"
import lightImage from "../../../assets/bg-light.jpg"
import styles from "../css/actionCenter.less"

function ActionCenter() {
  const [ignore, setIsDark] = useState(darkMode.isDarkMode)

  usePreload({
    image: [darkImage, lightImage],
  })

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
      <Icon icon={centerImg} mask={false} className={styles.centerIcon} />
    </Popover>
  )
}

export default memo(ActionCenter)
