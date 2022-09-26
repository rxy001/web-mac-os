import type { ComponentType } from "react"
import { lazy, Suspense } from "react"

export type AsyncImport = () => Promise<{ default: ComponentType }>

// export type WrapperComponent = ComponentType<{ children: ReactElement }>;

export default function asyncLoadComponent(
  asyncImport: AsyncImport,
  // Wrapper?: WrapperComponent
) {
  const Component = lazy(asyncImport)

  // 如果将 Suspense 写在入口文件中， 当首次异步加载组件时，会导致之前已挂载的 App 移动到原来的位置
  // 可能是 react-spring bug
  return (
    <Suspense>
      <Component />
    </Suspense>
  )

  // return Wrapper ? (
  //   <Wrapper>
  //     <Component />
  //   </Wrapper>
  // ) : (
  //   <Component />
  // );
}
