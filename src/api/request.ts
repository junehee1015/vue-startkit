import { ofetch, type FetchOptions, FetchError } from 'ofetch'
import { queryClient } from '@/plugins/vue-query'
import { useAuthStore } from '@/features/auth/model'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// 내부용 ofetch 인스턴스 (Interceptor는 토큰 주입만 담당)
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

// 토큰 갱신
export const refreshAccessToken = async (): Promise<void> => {
  try {
    const authStore = useAuthStore()
    if (!authStore.refreshToken || !authStore.user) throw new Error('No refresh token')

    // const response = await ofetch<{ accessToken: string; refreshToken: string; user: User }>(
    //   '/refresh',
    //   {
    //     baseURL: BASE_URL,
    //     method: 'POST'
    //     body: {
    //       refreshToken: authStore.refreshToken,
    //     },
    //   },
    // )

    // authStore.setAuthData(response.accessToken, response.refreshToken, response.user)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const newAccessToken = 'new-access-token-' + Date.now()
    const mockUser = {
      name: 'Juny Jo',
      email: authStore.user!.email,
      role: 'Admin',
    }

    authStore.setAuthData(newAccessToken, authStore.refreshToken, mockUser)
  } catch (error) {
    throw error
  } finally {
    refreshPromise = null
  }
}

const logout = async () => {
  try {
    await ofetch('/logout', { baseURL: BASE_URL, method: 'POST' })
  } catch (error) {
    console.error('Logout API failed, but forcing local logout', error)
  } finally {
    const authStore = useAuthStore()
    authStore.clearAuthData()
    localStorage.removeItem('auth')
    queryClient.clear()
  }
}

const redirectLogin = async () => {
  try {
    const { default: router } = await import('@/router')
    if (router.currentRoute.value.path !== '/login') router.replace('/login')
  } catch {
    location.href = '/login'
  }
}

// 토큰 갱신 동시성 제어 변수
let refreshPromise: Promise<void> | null = null

// 외부로 내보낼 Wrapper 함수
// 1) ofetch 특성 상 인스턴스 내에서 에러 처리를 하게 되면 void 값을 기대하기 때문에 재요청 시 타입 에러가 나기 때문에 에러 처리를 Wrapper 함수로 분리.
// 2) 순환 참조(무한 루프) 방지 -> Wrapper 함수로 분리하고 _retry 플래그 사용.
export const request = async <T = unknown>(
  url: string,
  options: FetchOptions<'json'> & { _retry?: boolean } = {},
): Promise<T> => {
  try {
    return await _apiInstance<T>(url, options)
  } catch (e) {
    const error = e as FetchError

    // auth 관련 API는 무한 루프 방지를 위해 토큰 갱신 로직을 타지 않음
    const isAuthPath = url.includes('/login') || url.includes('/refresh')

    if (error.response?.status === 401 && !options._retry && !isAuthPath) {
      // 1. 갱신 작업이 없다면 새로운 갱신 Promise 생성
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
      }

      try {
        // 2. 토큰 갱신 대기
        await refreshPromise

        // 3. 기존 요청 재시도
        const retryOptions: FetchOptions<'json'> & { _retry?: boolean } = {
          ...options,
          _retry: true, // 재시도 플래그
        }

        return await _apiInstance<T>(url, retryOptions)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        // 토큰 갱신 실패 시 로그아웃
        await logout()
        await redirectLogin()

        throw refreshError
      }
    }

    // 401 에러가 아니거나 재시도 실패 시 에러 그대로 던짐
    throw error
  }
}
