import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { map } from "lodash";
import { AliveScopeContext } from "./context";
import type { Cache, CacheItem, AliveScopeProps, Nodes } from "./interface";

export default function AliveScope({ children }: AliveScopeProps) {
  const storeElementRef = useRef<HTMLDivElement>();
  const [cache, setCacheImpl] = useState<Cache>({});
  const [keys, setKeysImpl] = useState<string[]>([]);
  const [nodes, setNodesImpl] = useState<Nodes>({});

  const createStoreElement = useCallback(() => {
    const keepAliveDOM = document.createElement("div");
    keepAliveDOM.dataset.type = "keep-alive";
    keepAliveDOM.style.display = "none";
    document.body.appendChild(keepAliveDOM);
    return keepAliveDOM;
  }, []);

  const setCache = useCallback((key: string, cacheItem: CacheItem) => {
    setCacheImpl((prev) => ({ ...prev, [key]: cacheItem }));
  }, []);

  const setKeys = useCallback((key: string) => {
    setKeysImpl((prev) => [...prev, key]);
  }, []);

  const setNodes = useCallback(
    (key: string, node: HTMLDivElement) => {
      if (!nodes[key]) {
        setNodesImpl((prev) => ({ ...prev, [key]: node }));
      }
    },
    [nodes]
  );

  useEffect(() => {
    storeElementRef.current = createStoreElement();
    return () => {
      storeElementRef.current &&
        document.body.removeChild(storeElementRef.current);
    };
  }, [createStoreElement]);

  return (
    <AliveScopeContext.Provider
      value={{ nodes, cache, setCache, keys, setKeys }}
    >
      <>
        {children}
        {map(keys, (key) => {
          return (
            <div
              className="keep-alive"
              key={key}
              ref={(node) => {
                node && setNodes(key, node);
              }}
            >
              {cache[key]?.children ?? null}
            </div>
          );
        })}
        {/* {storeElementRef.current
          ? createPortal(
              <Fragment key="alive-scope">
                {map(keys, (key: string) => {
                  const { children, keepAlive } = cache[key];
                  return <div key={key}>{children}</div>;
                })}
              </Fragment>,
              storeElementRef.current
            )
          : null} */}
      </>
    </AliveScopeContext.Provider>
  );
}
