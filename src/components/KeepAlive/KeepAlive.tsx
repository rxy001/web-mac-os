import { includes } from "lodash"
import { useContext, useEffect, useMemo, useRef } from "react"
import { AliveScopeContext } from "./context"
import type { KeepAliveProps, CacheItem } from "./interface"

// 当重新加载 KeepAlive.chidlren 时，children 的 fiber 居然有 current. why?
// 这是因为 KeepAlive.chidlren 被移动到 Provider 里的 Fragment 中，因此 KeepAlive.chidlren 的 fiber
// 的 return 是指向 .keep-alive div 的 fiber。 当 KeepAlive 组件被卸载时，
// 从代码加视觉上看 Provider 的子元素应该发生了变化，但只是 Provider 的 props.children 发生变化了，
// props.children 的 sibing 即 Fragment 却跳过 reconcileChildren 阶段。因此重新加载 KeepAlive.chidlren时
// 在 reconcileChildren 阶段能从 current 找到对应的 fiber 去复用。
// 感觉这种方式可能利用了 bug ？？同时在使用事件时肯定会出现问题。

export default function KeepAlive({
  id,
  children,
  keepAlive = true,
}: KeepAliveProps) {
  const { nodes, setCache, keys, setKeys } = useContext(AliveScopeContext)

  const isMountedRef = useRef(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const key = useMemo(() => id, [])

  const cacheItemRef = useRef<CacheItem>()

  const keepAliveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!includes(keys, key)) {
      setKeys(key)
    }
  }, [keys, key, setKeys])

  useEffect(() => {
    cacheItemRef.current = {
      children,
      keepAlive,
      isActivated: true,
    }
    setCache(key, cacheItemRef.current)
  }, [key, children, keepAlive, setCache, setKeys])

  useEffect(() => {
    if (nodes[key] && !isMountedRef.current) {
      keepAliveRef.current?.appendChild(nodes[key])
      isMountedRef.current = true
    }
  }, [nodes, key])

  // useEffect(
  //   () => () => {
  //     setCache(key, {
  //       ...cacheItemRef.current,
  //       isActivated: false,
  //     } as CacheItem)
  //   },
  //   [key, setCache],
  // )

  return <div key={key} ref={keepAliveRef} />
}
