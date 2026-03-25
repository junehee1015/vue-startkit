import { FetchError, ofetch, type FetchOptions } from 'ofetch'
import { queryClient } from '@/plugins/vue-query'
import { useAuthStore } from '@/features/auth/model'
import type { User } from '@/features/auth/model/store'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
let refreshPromise: Promise<void> | null = null
let logoutPromise: Promise<void> | null = null

export const refreshAccessToken = async (): Promise<void> => {
  try {
    const authStore = useAuthStore()

    const response = await ofetch<{ accessToken: string; user: User }>('/refresh', {
      baseURL: BASE_URL,
      method: 'POST',
    })

    authStore.setAuthData(response.accessToken, response.user)
  } catch (error) {
    throw error
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

const redirectToLogin = async () => {
  try {
    const { default: router } = await import('@/router')
    if (router.currentRoute.value.path !== '/login') router.replace('/login')
  } catch {
    location.href = '/login'
  }
}

const _api = ofetch.create({
  baseURL: BASE_URL,
  retry: 0,
  async onRequest({ options }) {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      options.headers = new Headers(options.headers || {})
      options.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }
  },
})

export const api = async <T = unknown>(url: string, options?: FetchOptions<'json'>): Promise<T> => {
  try {
    return await _api<T>(url, options)
  } catch (e) {
    const error = e as FetchError
    const isAuthPath = url.includes('/login') || url.includes('/refresh')

    if (error.response?.status === 401 && !isAuthPath) {
      // 토큰 갱신 동시성 제어
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      try {
        await refreshPromise
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        // 로그아웃 동시성 제어
        if (!logoutPromise) {
          logoutPromise = logout().finally(() => {
            logoutPromise = null
          })
        }

        await logoutPromise
        await redirectToLogin()

        throw refreshError
      }

      return await _api<T>(url, options)
    }

    throw error
  }
}
