import {
  memo,
  useState,
  useCallback,
  FocusEventHandler,
  MouseEventHandler,
  ChangeEvent,
} from "react";
import { Input, Button } from "brc";
import request from "request";
import styles from "./css";

interface UserLoginProps {
  changeBackgroundImage: FocusEventHandler<HTMLInputElement>;
  changeTabIndex: MouseEventHandler<HTMLButtonElement>;
}

function UserLogin({ changeBackgroundImage, changeTabIndex }: UserLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onUserNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  }, []);

  const onPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const login = useCallback(async () => {
    if (!username || !password) {
      return;
    }
    await request.post("/login", {
      username,
      password,
    });
  }, [username, password]);

  return (
    <div>
      <div className={styles.userLogin}>
        <Input
          value={username}
          onChange={onUserNameChange}
          placeholder="请输入账号"
          prefix="账号"
          className={styles.username}
        />
        <Input.Password
          value={password}
          onChange={onPasswordChange}
          prefix="密码"
          placeholder="请输入密码"
          className={styles.password}
          onFocus={changeBackgroundImage}
          onBlur={changeBackgroundImage}
        />
      </div>
      <div className={styles.buttonGroup}>
        <Button onClick={changeTabIndex}>注册</Button>
        <Button type="primary" onClick={login}>
          登陆
        </Button>
      </div>
    </div>
  );
}

export default memo(UserLogin);
