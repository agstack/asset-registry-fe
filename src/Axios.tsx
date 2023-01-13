import axios, {AxiosRequestConfig} from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
export const axiosObj = axios.create();

export const makeRequest = (
  url: AxiosRequestConfig['url'],
  method: AxiosRequestConfig['method'],
  headers?: AxiosRequestConfig['headers'],
  body?: AxiosRequestConfig['data'],
  params?: AxiosRequestConfig['params'],
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
