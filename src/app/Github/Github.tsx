import { Icon } from "@brc"
import { useSpring, animated } from "@react-spring/web"
import github from "@assets/github.svg"
import { memo, useRef } from "react"
import { useMount } from "@chooks"
import styles from "./css/github.less"

const isEnvDevelopment = process.env.NODE_ENV === "development"

function Github() {
  const { x } = useSpring({ from: { x: 0 }, x: 1, config: { duration: 1000 } })

  const ref = useRef<HTMLAnchorElement>(null)

  useMount(() => !isEnvDevelopment && ref.current?.click())

  return (
    <div className={styles.wrapper}>
      <animated.div
        style={{
          opacity: x.to({ range: [0, 1], output: [0.3, 1] }),
          transform: x
            .to({
              range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
              output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1],
            })
            .to((x) => `scale(${x})`),
        }}
      >
        <Icon mask={false} icon={github} className={styles.icon} />
      </animated.div>
      <div className={styles.content}>
        <p>
          <span>已打开 </span>
          <a
            ref={ref}
            target="_blank"
            rel="noreferrer"
            href="https://github.com/rxy001/web-mac-os"
          >
            Github
          </a>
          <span>仓库</span>
        </p>
        <p>
          如果觉得还不错点个 <Icon mask={false} icon="iconxingxing" />{" "}
          吧，谢谢！🙏
        </p>
      </div>
    </div>
  )
}

export default memo(Github)
