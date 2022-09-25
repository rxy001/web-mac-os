import axios from "axios";
import type { AbortControllerMap, Request } from "./interface";

const instance = axios.create({
  baseURL: "/api/v1",
  timeout: 3000,
  withCredentials: true,
});

const abortControllerMap: AbortControllerMap = {};

const request: Request = ({ cancelable, ...config }) => {
  let key = typeof cancelable === "string" ? cancelable : config.url;

  if (cancelable) {
    abortControllerMap[key] = new AbortController();
  }

  return instance({
    ...config,
    signal: abortControllerMap[key]?.signal,
  })
    .then((res) => res.data)
    .catch((error) => Promise.reject(error.toJSON()));
};

request.cancel = (key) => {
  const abortController = abortControllerMap[key];
  if (!abortController) {
    console.warn("abortControllerMap.key is undefined");
    return;
  }
  abortController.abort();
};

request.get = (url, config = {}) =>
  request({
    url,
    ...config,
    method: "get",
  });

request.post = (url, data, config = {}) =>
  request({
    url,
    data,
    ...config,
    method: "post",
  });

request.delete = (url, config = {}) =>
  request({
    url,
    ...config,
    method: "post",
  });

request.put = (url, data, config = {}) =>
  request({
    url,
    data,
    ...config,
    method: "put",
  });

export default request;
