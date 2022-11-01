import { useEffect, useState, useRef } from "react"
import { easings } from "@react-spring/web"
import { Progress } from "@brc"
import appleImage from "@assets/apple.svg"
import styles from "./css/splashScreen.less"

const config = {
  duration: 2000,
  easing: easings.easeOutQuint,
}

export default function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const timer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    timer.current = setTimeout(() => {
      setVisible(false)
    }, 2200)

    return () => {
      timer.current && clearTimeout(timer.current)
    }
  }, [])

  return visible ? (
    <div className={styles.splashScreen}>
      <div className={styles.wrapper}>
        <img alt="apple" src={appleImage} className={styles.appleIcon} />
        <Progress springConfig={config} percent={100} />
      </div>
    </div>
  ) : null
}
