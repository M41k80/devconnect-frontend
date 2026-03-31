import { AxiosResponse } from 'axios'
import { httpClient } from './http-client'
import { ApiSuccess } from '@/app/types/api/api.types'


export const setupInterceptors = () => {
  httpClient.interceptors.response.use(
    (response: AxiosResponse<ApiSuccess<unknown>>) => {
      if (response.data?.success) {
        response.data = response.data.data as ApiSuccess<unknown>
      }
      return response
    },
    async (error) => {
      const original = error.config as typeof error.config & { _retry?: boolean }

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true
        try {
          await httpClient.post('/auth/refresh')
          return httpClient(original)
        } catch {
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      }

      return Promise.reject(error)
    }
  )
}


setupInterceptors()