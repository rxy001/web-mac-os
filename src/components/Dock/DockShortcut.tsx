import { useMemoizedFn, useDebounceFn } from "@chooks"
import classNames from "classnames"
import { forwardRef, useMemo, useState, useReducer, useRef } from "react"
import { Icon, Tooltip, Popover, Button, App } from "../index"
import styles from "./css/dockShortcut.less"
import type { DockShortcutProps } from "./interface"

const DISTANCE = 20

const DockShortcut = forwardRef<HTMLDivElement, DockShortcutProps>(
  (
    {
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
      ...props
    },
    ref,
  ) => {
    const [popoverVisible, setPopoverVisible] = useState(false)
    const [contextMenuVisible, setContextMenuVisible] = useState(false)
    const [tooltipVisible, setTooltipVisible] = useState(false)
    const [isRefresh, setIsRefresh] = useReducer((x) => x + 1, 0)
    const isKeepInDock = useRef(defaultIsKeepInDock)
    const appOpen = useRef(!isKeepInDock.current)
    const windowVisible = useRef(!isKeepInDock.current)

    const debounceRefresh = useDebounceFn(setIsRefresh, 150)

    const onPopoverVisibleChange = useMemoizedFn((v) => {
      if (!contextMenuVisible) {
        setPopoverVisible(v)
        setTooltipVisible(false)
      }
    })

    const onContextMenuVisibleChange = useMemoizedFn((v) => {
      if (!popoverVisible) {
        setContextMenuVisible(v)
        setTooltipVisible(false)
      }
    })

    const onTooltipVisibleChange = useMemoizedFn((v) => {
      if (!popoverVisible && !contextMenuVisible) {
        setTooltipVisible(v)
      }
    })

    const onClick = useMemoizedFn(() => {
      if (!popoverVisible && !contextMenuVisible) {
        openApp()
      }
    })

    const hideOptionMenu = useMemoizedFn(() => {
      if (contextMenuVisible) setContextMenuVisible(false)
      if (popoverVisible) setPopoverVisible(false)
    })

    const refresh = (cb: () => void) => (appName: string) => {
      if (appName === title) {
        cb()
        debounceRefresh()
      }
    }

    App.useAppSubscribe(
      App.EventType.APP_OPENED,
      refresh(() => {
        appOpen.current = true
      }),
    )

    App.useAppSubscribe(
      App.EventType.APP_CLOSE,
      refresh(() => {
        appOpen.current = false
      }),
    )

    App.useAppSubscribe(
      App.EventType.WINDOW_SHOWED,
      refresh(() => {
        windowVisible.current = true
      }),
    )

    App.useAppSubscribe(
      App.EventType.WINDOW_HIDDEN,
      refresh(() => {
        windowVisible.current = false
      }),
    )

    App.useAppSubscribe(
      App.EventType.APP_KEEP_IN_DOCK,
      refresh(() => {
        isKeepInDock.current = true
      }),
    )

    App.useAppSubscribe(
      App.EventType.APP_REMOVE_IN_DOCK,
      refresh(() => {
        isKeepInDock.current = false
      }),
    )

    const renderOptionMenu = useMemo(
      () => (
        <div onClick={hideOptionMenu} className={styles.optionMenu}>
          {isKeepInDock.current && (
            <Button
              type="text"
              onClick={removeInDock}
              className={styles.button}
            >
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

    return (
      <div className={styles.iconWrapper} {...props} ref={ref}>
        <Popover
          visible={contextMenuVisible}
          content={renderOptionMenu}
          onVisibleChange={onContextMenuVisibleChange}
          distance={DISTANCE}
          trigger="contextMenu"
        >
          <Popover
            visible={popoverVisible}
            content={renderOptionMenu}
            onVisibleChange={onPopoverVisibleChange}
            distance={DISTANCE}
            trigger="longPress"
          >
            <Tooltip
              visible={tooltipVisible}
              onVisibleChange={onTooltipVisibleChange}
              text={title}
              distance={DISTANCE}
            >
              <Icon
                maskClassName={iconMaskClassName}
                className={classNames(styles.icon, {
                  [styles.circle]: appOpen.current,
                })}
                onClick={onClick}
                icon={icon}
              />
            </Tooltip>
          </Popover>
        </Popover>
      </div>
    )
  },
)

export default DockShortcut
