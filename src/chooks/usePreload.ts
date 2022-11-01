import { forEach, includes, isArray, keys } from "lodash"
import { useRef } from "react"

export interface UsePreloadProps<T> {
  image?: T
  mp3?: T
}

const cache: string[] = []

function preloadImage(sources: string[]) {
  for (let index = 0; index < sources.length; index++) {
    const src = sources[index]
    if (!includes(cache, src)) {
      const image = new Image()
      image.onload = () => cache.push(src)
      image.src = src
    }
  }
}

function usePreload<T extends string | string[]>(
  props: UsePreloadProps<T>,
): void {
  const loaded = useRef(false)

  if (loaded.current === false) {
    forEach(keys(props), (key: string) => {
      const sources = props[key as keyof UsePreloadProps<T>]

      if (sources) {
        switch (key) {
          case "image":
            preloadImage(isArray(sources) ? sources : [sources])
            break
          default:
            throw new Error("暂不支持预加载此格式")
        }
      }
    })
    loaded.current = true
  }
}

export default usePreload
