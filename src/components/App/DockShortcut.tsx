import { useMemoizedFn, useUpdateEffect } from "@chooks"
import classNames from "classnames"
import { forwardRef, useMemo, useState, useReducer } from "react"
import { Icon, Tooltip, Popover, Button } from "../index"
import styles from "./css/dockShortcut.less"
import type { DockShortcutProps } from "./interface"

const DockShortcut = forwardRef<HTMLDivElement, DockShortcutProps>(
  (
    {
      icon,
      title,
      iconType,
      getOpen,
      openApp,
      closeApp,
      windowHandlers,
      ...props
    },
    ref,
  ) => {
    const [popoverVisible, setPopoverVisible] = useState(false)
    const [contextMenuVisible, setContextMenuVisible] = useState(false)
    const [isRefresh, setIsRefresh] = useReducer((x) => x + 1, 0)

    const [tooltipVisible, setTooltipVisible] = useState(false)

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
        setIsRefresh()
        openApp()
      }
    })

    const hideOptionMenu = useMemoizedFn(() => {
      if (contextMenuVisible) setContextMenuVisible(false)
      if (popoverVisible) setPopoverVisible(false)
    })

    const appOpen = getOpen()
    let windowVisible: any = null
    if (appOpen) {
      try {
        windowVisible = windowHandlers.isShow()
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    // eslint-disable-next-line arrow-body-style
    const renderOptionMenu = useMemo(() => {
      return (
        <div onClick={hideOptionMenu}>
          {appOpen && windowVisible && (
            <Button
              type="text"
              onClick={windowHandlers.hideWindow}
              className={styles.button}
            >
              隐藏
            </Button>
          )}
          {appOpen && !windowVisible && (
            <Button
              type="text"
              onClick={windowHandlers.showWindow}
              className={styles.button}
            >
              显示
            </Button>
          )}
          {appOpen && (
            <Button onClick={closeApp} type="text" className={styles.button}>
              退出
            </Button>
          )}
          {!appOpen && !windowVisible && (
            <Button type="text" onClick={openApp} className={styles.button}>
              打开
            </Button>
          )}
        </div>
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRefresh, closeApp, getOpen, hideOptionMenu, openApp, windowHandlers])

    // 由于 Popover 有 200ms 的隐藏动画，如果 renderOptionMenu 立即改变那在隐藏时 button 会发生改变
    useUpdateEffect(() => {
      setIsRefresh()
    }, [appOpen, windowVisible, contextMenuVisible, popoverVisible])

    return (
      <div className={styles.iconWrapper} {...props} ref={ref}>
        <Popover
          visible={contextMenuVisible}
          content={renderOptionMenu}
          onVisibleChange={onContextMenuVisibleChange}
          distance={15}
          trigger="contextMenu"
        >
          <Popover
            visible={popoverVisible}
            content={renderOptionMenu}
            onVisibleChange={onPopoverVisibleChange}
            distance={15}
            trigger="longPress"
          >
            <Tooltip
              visible={tooltipVisible}
              onVisibleChange={onTooltipVisibleChange}
              text={title}
              trigger="hover"
              distance={15}
            >
              <Icon
                maskClassName={classNames({
                  [styles.iconMask]: iconType === "circle",
                  [styles.circle]: appOpen,
                })}
                className={styles.icon}
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
