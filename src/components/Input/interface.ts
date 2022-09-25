import {
  ReactNode,
  InputHTMLAttributes,
  CSSProperties,
  ChangeEventHandler,
} from "react";
import type { IconProps } from "../Icon";

export interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "prefix" | "style" | "value" | "onChange" | "className"
  > {
  defaultValue?: InputHTMLAttributes<HTMLInputElement>["value"];
  className?: string;
  style?: CSSProperties;
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  prefix?: ReactNode;
  suffix?: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export interface PasswordProps extends InputProps {
  iconProps?: IconProps;
}
