import { useMemoizedFn, useDebounceFn, useUnmount } from "@chooks"
import classNames from "classnames"
import { useMemo, useState, useReducer, useRef } from "react"
import { Icon, Tooltip, Popover, Button, App } from "../index"
import styles from "./css/dockShortcut.less"
import type { DockShortcutProps } from "./interface"

const DISTANCE = 20

function DockShortcut({
  icon,
  title,
  openApp,
  closeApp,
  hideWindow,
  showWindow,
  keepInDock,
  removeInDock,
  defaultIsKeepInDock,
  iconMaskClassName,
}: DockShortcutProps) {
  const containerRef = useRef<HTMLDivElement>(null as any)
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [isRefresh, setIsRefresh] = useReducer((x) => x + 1, 0)
  const isKeepInDock = useRef(defaultIsKeepInDock)
  const appOpen = useRef(!isKeepInDock.current)
  const windowVisible = useRef(!isKeepInDock.current)
  const isPressed = useRef(false)
  const timeoutRefresh = useDebounceFn(setIsRefresh, 150)
  const timeoutSetIsPressed = useDebounceFn(() => {
    isPressed.current = false
  }, 200)

  const onPopoverVisibleChange = useMemoizedFn((v) => {
    if (!isPressed.current) {
      setPopoverVisible(v)
    }
    setTooltipVisible(false)
  })

  const onTooltipVisibleChange = useMemoizedFn((v) => {
    if (!popoverVisible) {
      setTooltipVisible(v)
    }
  })

  const onClick = useMemoizedFn(() => {
    if (!popoverVisible && !isPressed.current) {
      openApp()
    }
  })

  const hideOptionMenu = useMemoizedFn(() => {
    if (popoverVisible) setPopoverVisible(false)
  })

  const refresh = (cb: () => void) => (appName: string) => {
    if (appName === title) {
      cb()
      timeoutRefresh()
    }
  }

  App.useAppSubscribe(
    App.EmitEventType.APP_OPENED,
    refresh(() => {
      appOpen.current = true
    }),
  )

  App.useAppSubscribe(
    App.EmitEventType.APP_CLOSE,
    refresh(() => {
      appOpen.current = false
    }),
  )

  App.useAppSubscribe(
    App.EmitEventType.APP_SHOWED,
    refresh(() => {
      windowVisible.current = true
    }),
  )

  App.useAppSubscribe(
    App.EmitEventType.APP_HIDDEN,
    refresh(() => {
      windowVisible.current = false
    }),
  )

  App.useAppSubscribe(
    App.EmitEventType.APP_KEEP_IN_DOCK,
    refresh(() => {
      isKeepInDock.current = true
    }),
  )

  App.useAppSubscribe(
    App.EmitEventType.APP_REMOVE_IN_DOCK,
    refresh(() => {
      isKeepInDock.current = false
    }),
  )

  const renderOptionMenu = useMemo(
    () => (
      <div onClick={hideOptionMenu} className={styles.optionMenu}>
        {isKeepInDock.current && (
          <Button type="text" onClick={removeInDock} className={styles.button}>
            从程序坞中移除
          </Button>
        )}
        {!isKeepInDock.current && (
          <Button type="text" onClick={keepInDock} className={styles.button}>
            在程序坞中保留
          </Button>
        )}
        {appOpen.current && windowVisible.current && (
          <Button type="text" onClick={hideWindow} className={styles.button}>
            隐藏
          </Button>
        )}
        {appOpen.current && !windowVisible.current && (
          <Button type="text" onClick={showWindow} className={styles.button}>
            显示
          </Button>
        )}
        {appOpen.current && (
          <Button onClick={closeApp} type="text" className={styles.button}>
            退出
          </Button>
        )}
        {!appOpen.current && !windowVisible.current && (
          <Button type="text" onClick={openApp} className={styles.button}>
            打开
          </Button>
        )}
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isRefresh,
      hideOptionMenu,
      removeInDock,
      keepInDock,
      hideWindow,
      showWindow,
      closeApp,
      openApp,
    ],
  )

  const gerPopupContainer = useMemoizedFn(() => containerRef.current)

  const onMouseDown = useMemoizedFn(() => {
    if (popoverVisible) {
      setPopoverVisible(false)
      isPressed.current = true
    }
  })

  const onMouseUp = useMemoizedFn(() => {
    if (isPressed.current) {
      timeoutSetIsPressed()
    }
  })

  useUnmount(() => {
    timeoutSetIsPressed.cancel()
    timeoutRefresh.cancel()
  })
  return (
    <div className={styles.iconWrapper} ref={containerRef}>
      <Popover
        visible={popoverVisible}
        content={renderOptionMenu}
        onVisibleChange={onPopoverVisibleChange}
        distance={DISTANCE}
        trigger={["longPress", "contextMenu"]}
        gerPopupContainer={gerPopupContainer}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <Tooltip
          visible={tooltipVisible}
          onVisibleChange={onTooltipVisibleChange}
          text={title}
          distance={DISTANCE}
          gerPopupContainer={gerPopupContainer}
        >
          <Icon
            maskClassName={iconMaskClassName}
            onClick={onClick}
            icon={icon}
            className={classNames(styles.icon, {
              [styles.circle]: appOpen.current,
            })}
          />
        </Tooltip>
      </Popover>
    </div>
  )
}

export default DockShortcut
