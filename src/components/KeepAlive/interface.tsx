import { ReactElement } from "react";

export interface Nodes {
  [key: string]: HTMLDivElement;
}

export interface CacheItem {
  children: ReactElement;
  keepAlive: boolean;
  activated: boolean;
}

export interface Cache {
  [key: string]: CacheItem;
}

export interface AliveScopeContextValue {
  cache: Cache;
  setCache: (k: string, c: CacheItem) => void;
  keys: string[];
  setKeys: (k: string) => void;
  nodes: Nodes;
}

export interface AliveScopeProps {
  children: ReactElement;
}

export interface KeepAliveProps {
  children: ReactElement;
  keepAlive?: boolean;
  id: string;
}
