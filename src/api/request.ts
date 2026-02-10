import { ofetch } from 'ofetch'
import type { FetchOptions, FetchError } from 'ofetch'
import { useAuthStore } from '@/stores/auth'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// 1. 내부용 ofetch 인스턴스 (Interceptor는 토큰 주입만 담당)
const _apiInstance = ofetch.create({
  baseURL: BASE_URL,
  retry: 0,

  async onRequest({ options }) {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      const headers = new Headers(options.headers)
      headers.set('Authorization', `Bearer ${authStore.accessToken}`)
      options.headers = headers
    }
  },
})

// 2. 외부로 내보낼 Wrapper 함수
// 1) ofetch 특성 상 인스턴스 내에서 에러 처리를 하게 되면 void 값을 기대하기 때문에 재요청 시 타입 에러가 나기 때문에 에러 처리를 Wrapper 함수로 분리.
// 2) 순환 참조(무한 루프) 방지 -> Wrapper 함수로 분리하고 _retry 트리거 사용.
let refreshPromise: Promise<void> | null = null

export const request = async <T = unknown>(
  url: string,
  options: FetchOptions<'json'> & { _retry?: boolean } = {},
) => {
  try {
    return await _apiInstance<T>(url, options)
  } catch (e) {
    const error = e as FetchError
    const authStore = useAuthStore()

    if (error.response?.status === 401 && !options._retry) {
      options._retry = true

      // 1. 이미 갱신 중이라면? 그 작업이 끝날 때까지 기다림 (대기열)
      if (!refreshPromise) {
        refreshPromise = authStore.refreshAccessToken().finally(() => {
          refreshPromise = null // 작업 끝나면 초기화
        })
      }

      try {
        // 2. 갱신 작업 대기 (첫 번째 요청이 갱신하는 동안 나머지는 여기서 멈춤)
        await refreshPromise

        // 3. 갱신 성공 후, 새 토큰으로 헤더 교체
        if (authStore.accessToken) {
          const newHeaders = new Headers(options.headers)
          newHeaders.set('Authorization', `Bearer ${authStore.accessToken}`)
          options.headers = newHeaders
        }

        // 4. 원래 요청 재시도
        return await _apiInstance<T>(url, options)
      } catch (refreshError) {
        throw refreshError
      }
    }

    throw error
  }
}
