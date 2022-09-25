import { includes, isArray, once } from "lodash";

export interface UsePreloadProps<T> {
  image?: T;
  mp3?: T;
}

const cache: string[] = [];

function preloadImage(sources: string[]) {
  for (let index = 0; index < sources.length; index++) {
    const src = sources[index];
    if (!includes(cache, src)) {
      const image = new Image();
      image.onload = () => cache.push(src);
      image.src = src;
    }
  }
}

function usePreload(props: UsePreloadProps<string | string[]>): void {
  let key: keyof UsePreloadProps<string | string[]>;
  for (key in props) {
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      const sources = props[key];
      if (sources) {
        switch (key) {
          case "image":
            preloadImage(isArray(sources) ? sources : [sources]);
        }
      }
    }
  }
}

export default once(usePreload);
