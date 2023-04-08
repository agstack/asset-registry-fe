import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_ASSET_REGISTRY_BASE_URL || "";
export const axiosObj = axios.create();

axiosObj.interceptors.request.use((config: AxiosRequestConfig) => {
  const token =
    config.url === "/logout"
      ? `Bearer ${Cookies.get("refresh_token_cookie")}`
      : `Bearer ${Cookies.get("access_token_cookie")}`;
  if (
    "headers" in config &&
    config.headers &&
    "Authorization" in config.headers
  ) {
    config.headers.Authorization = token;
  } else {
    config.headers = { Authorization: token };
  }
  return config;
});

export const makeRequest = (
  url: AxiosRequestConfig["url"],
  method: AxiosRequestConfig["method"],
  headers?: AxiosRequestConfig["headers"],
  body?: AxiosRequestConfig["data"],
  params?: AxiosRequestConfig["params"]
) => {
  return new Promise(async (resolve, reject) => {
    axiosObj({
      url: BASE_URL + url,
      method: method,
      headers: headers,
      data: body,
      params,
    })
      .then((response: any) => {
        resolve(response);
      })
      .catch((err: any) => {
        // Handle error here.
        reject(err);
      });
  });
};
