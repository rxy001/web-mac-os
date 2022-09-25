import { memo, useContext } from "react";
import type { ShortcutProps } from "./interface";
import { Icon } from "..";
import styles from "./css/shortcut.less";
import { AppContext } from "./context";

function Shortcut({ title, iconType }: ShortcutProps) {
  const { openApp } = useContext(AppContext);

  return (
    <div className={styles.shortcutWrapper}>
      <Icon type={iconType} className={styles.icon} onClick={openApp} />
      <div className={styles.title}>{title}</div>
    </div>
  );
}

export default memo(Shortcut);
