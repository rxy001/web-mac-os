import { useCallback, useState } from "react"
import type { MouseEvent, CSSProperties } from "react"
import { Button, Icon } from "@brc"
import { usePreload } from "@chooks"
import classNames from "classnames"
import UserLogin from "./UserLogin"
import UserRegister from "./UserRegister"
import styles from "./css/loginPage.less"
import {
  IMAGE_CLOSE_22,
  IMAGE_CLOSE_33,
  LOGIN_TAB_INDEX,
  REGISTER_TAB_INDEX,
} from "./constants"

const bgImg = `url("${IMAGE_CLOSE_22}"),url("${IMAGE_CLOSE_33}")`

interface BackgroundImage {
  backgroundImage: CSSProperties["backgroundImage"]
}

export default function LoginPage() {
  usePreload({
    image: [IMAGE_CLOSE_22, IMAGE_CLOSE_33],
  })

  const [tabIndex, setTabIndex] = useState(0)

  const [backgroundImage, setBackgroundImage] = useState<BackgroundImage>({
    backgroundImage: undefined,
  })

  const changeBackgroundImage = useCallback(() => {
    setBackgroundImage((prev: BackgroundImage) => {
      if (!prev.backgroundImage) {
        return {
          backgroundImage: bgImg,
        }
      }
      return {
        backgroundImage: undefined,
      }
    })
  }, [])

  const changeTabIndex = useCallback(() => {
    setTabIndex((prev) => (prev ? LOGIN_TAB_INDEX : REGISTER_TAB_INDEX))
  }, [])

  const onTabsClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement

    if (target.tagName === "DIV" && target.tabIndex > -1) {
      setTabIndex(target.tabIndex)
    }
  }, [])

  return (
    <div className={styles.loginPageContainer} style={backgroundImage}>
      <div className={styles.tabs} onClick={onTabsClick}>
        <div
          className={classNames(styles.title, {
            [styles.active]: tabIndex === LOGIN_TAB_INDEX,
          })}
          tabIndex={LOGIN_TAB_INDEX}
        >
          账号登陆
        </div>
        <span className={styles.divider} />
        <div
          className={classNames(styles.title, {
            [styles.active]: tabIndex === REGISTER_TAB_INDEX,
          })}
          tabIndex={REGISTER_TAB_INDEX}
        >
          账号注册
        </div>
      </div>
      {tabIndex === LOGIN_TAB_INDEX && (
        <UserLogin
          changeBackgroundImage={changeBackgroundImage}
          changeTabIndex={changeTabIndex}
        />
      )}
      {tabIndex === REGISTER_TAB_INDEX && (
        <UserRegister changeBackgroundImage={changeBackgroundImage} />
      )}
      <div className={styles.thirdPartyLogin}>
        <div className={styles.title}>其他方式登陆</div>
        <div className={styles.sns}>
          <Button
            type="text"
            className={styles.button}
            icon={<Icon icon="icongithub" />}
          >
            github
          </Button>
        </div>
      </div>
    </div>
  )
}
