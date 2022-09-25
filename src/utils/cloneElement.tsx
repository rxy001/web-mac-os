import {
  cloneElement as cloneElementImpl,
  isValidElement,
  ReactElement,
  ReactNode,
} from "react";

type Props = { [x: string]: any };

export default function cloneElement(
  element: ReactNode,
  props: Props,
  ...children: ReactNode[]
): ReactElement {
  if (!isValidElement(element)) {
    return element as any;
  }

  return cloneElementImpl(element, props, ...children);
}
