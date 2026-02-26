import { ofetch } from 'ofetch'
import type { FetchOptions, FetchError } from 'ofetch'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// 1. 내부용 ofetch 인스턴스 (Interceptor는 토큰 주입만 담당)
const _apiInstance = ofetch.create({
  baseURL: BASE_URL,
  retry: 0,
  async onRequest({ options }) {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      options.headers = new Headers(options.headers)
      options.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }
  },
})

// refreshtoken을 위한 순수 ofetch instance
export const refreshRequest = ofetch.create({
  baseURL: BASE_URL,
  retry: 0,
})

// 2. 외부로 내보낼 Wrapper 함수
// 1) ofetch 특성 상 인스턴스 내에서 에러 처리를 하게 되면 void 값을 기대하기 때문에 재요청 시 타입 에러가 나기 때문에 에러 처리를 Wrapper 함수로 분리.
// 2) 순환 참조(무한 루프) 방지 -> Wrapper 함수로 분리하고 _retry 트리거 사용.
let refreshPromise: Promise<void> | null = null

export const request = async <T = unknown>(
  url: string,
  options: FetchOptions<'json'> & { _retry?: boolean } = {},
): Promise<T> => {
  try {
    return await _apiInstance<T>(url, options)
  } catch (e) {
    const error = e as FetchError
    const authStore = useAuthStore()
    // auth 관련 API는 무한 루프 방지를 위해 토큰 갱신 로직을 타지 않음
    const isAuthPath = url.includes('/login') || url.includes('/refresh')

    if (error.response?.status === 401 && !options._retry && !isAuthPath) {
      // 1. 갱신 작업이 없다면 새로운 갱신 Promise 생성
      if (!refreshPromise) {
        refreshPromise = authStore.refreshAccessToken().finally(() => {
          refreshPromise = null // 작업 완료 후 초기화 (성공/실패 무관)
        })
      }

      try {
        // 2. 토큰 갱신 대기
        await refreshPromise

        // 3. 기존 요청 재시도
        const retryOptions: FetchOptions<'json'> & { _retry?: boolean } = {
          ...options,
          _retry: true,
        }

        return await _apiInstance<T>(url, retryOptions)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        // 토큰 갱신 실패 시 스토어의 로그아웃 액션을 호출하여 상태 초기화
        authStore.logout()

        // 로그인 페이지가 아니라면 튕겨내기
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }

        throw refreshError
      }
    }

    // 401 에러가 아니거나 재시도 실패 시 에러 그대로 던짐
    throw error
  }
}
