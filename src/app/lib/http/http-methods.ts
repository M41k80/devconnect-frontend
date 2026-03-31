import { httpClient } from './http-client'
import { AxiosRequestConfig } from 'axios'


export const get = <T, P = unknown>(
  url: string,
  config?: AxiosRequestConfig<P>
): Promise<T> =>
  httpClient.get<T>(url, config).then(res => res.data)


export const post = <T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> =>
  httpClient.post<T>(url, body, config).then(res => res.data)


export const patch = <T, B = unknown>(
  url: string,
  body?: B,
  config?: AxiosRequestConfig
): Promise<T> =>
  httpClient.patch<T>(url, body, config).then(res => res.data)


export const del = <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> =>
  httpClient.delete<T>(url, config).then(res => res.data)