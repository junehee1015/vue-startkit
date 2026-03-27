import { ofetch } from 'ofetch'
import type { FetchOptions, FetchRequest, FetchError } from 'ofetch'
import { queryClient } from '@/plugins/vue-query'
import { useAuthStore } from '@/features/auth/model'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'
let refreshPromise: Promise<void> | null = null
let logoutPromise: Promise<void> | null = null

export const refreshAccessToken = (): Promise<void> => {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const authStore = useAuthStore()

      const response = await ofetch<{ accessToken: string }>('/refresh', {
        baseURL: BASE_URL,
        method: 'POST',
        credentials: 'include',
      })

      authStore.setAuthData(response.accessToken)
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export const logout = (): Promise<void> => {
  if (logoutPromise) return logoutPromise

  logoutPromise = (async () => {
    try {
      await ofetch('/logout', { baseURL: BASE_URL, method: 'POST', credentials: 'include' })
    } catch (error) {
      console.error('Logout API failed, but forcing local logout', error)
    } finally {
      const authStore = useAuthStore()
      authStore.clearAuthData()
      queryClient.clear()

      await nextTick()
      localStorage.removeItem('auth')

      logoutPromise = null
    }
  })()

  return logoutPromise
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
  onRequest({ options }) {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      options.headers = new Headers(options.headers || {})
      options.headers.set('Authorization', `Bearer ${authStore.accessToken}`)
    }
  },
})

export const api = async <T = unknown>(
  request: FetchRequest,
  options?: FetchOptions<'json'>,
): Promise<T> => {
  try {
    return await _api<T>(request, options)
  } catch (e) {
    const error = e as FetchError
    const requestUrl = request instanceof Request ? request.url : request.toString()
    const isAuthPath = requestUrl.includes('/login') || requestUrl.includes('/refresh')

    if (error.response?.status === 401 && !isAuthPath) {
      try {
        await refreshAccessToken()
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)

        await logout()
        await redirectToLogin()

        throw refreshError
      }

      return await _api<T>(request, options)
    }

    throw error
  }
}
