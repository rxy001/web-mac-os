import type { AxiosPromise, AxiosRequestConfig } from "axios"

export interface RequestConfig extends Omit<AxiosRequestConfig, "url"> {
  url: string
  cancelable?: boolean | string
}

export interface AbortControllerMap {
  [key: string]: AbortController
}

type MethodConfig = Omit<RequestConfig, "url" | "method">

export interface Request {
  (config: RequestConfig): AxiosPromise
  cancel(key: string): void
  get(url: string, config?: MethodConfig): AxiosPromise
  delete(url: string, config?: MethodConfig): AxiosPromise
  post(
    url: string,
    data?: RequestConfig["data"],
    config?: MethodConfig,
  ): AxiosPromise
  put(
    url: string,
    data?: RequestConfig["data"],
    config?: MethodConfig,
  ): AxiosPromise
}
