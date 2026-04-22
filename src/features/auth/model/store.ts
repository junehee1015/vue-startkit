import { ROUTE_NAMES } from '@/constants/routes'
import { queryClient } from '@/plugins/vue-query'
import { ofetch } from 'ofetch'

export interface User {
  name: string
  email: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)

    const setAuthData = (newAccessToken: string, userData = user.value) => {
      accessToken.value = newAccessToken
      user.value = userData
    }

    const clearAuthData = () => {
      accessToken.value = null
      user.value = null
    }

    let refreshPromise: Promise<void> | null = null
    let logoutPromise: Promise<void> | null = null

    const refresh = (): Promise<void> => {
      if (refreshPromise) return refreshPromise

      refreshPromise = (async () => {
        try {
          const response = await ofetch<{ accessToken: string }>('/refresh', {
            baseURL: BASE_URL,
            method: 'POST',
            credentials: 'include',
          })
          setAuthData(response.accessToken)
        } finally {
          refreshPromise = null
        }
      })()

      return refreshPromise
    }

    const redirectToLogin = async () => {
      try {
        const { default: router } = await import('@/router')
        if (router.currentRoute.value.name !== ROUTE_NAMES.LOGIN)
          await router.replace({ name: ROUTE_NAMES.LOGIN })
      } catch {
        window.location.href = '/login'
      }
    }

    const logout = (): Promise<void> => {
      if (logoutPromise) return logoutPromise

      logoutPromise = (async () => {
        const headers = new Headers()
        if (accessToken.value) {
          headers.set('Authorization', `Bearer ${accessToken.value}`)
        }

        try {
          await ofetch('/logout', {
            baseURL: BASE_URL,
            method: 'POST',
            headers,
            credentials: 'include',
          })
        } catch {
          console.warn('Server logout failed.')
        } finally {
          clearAuthData()
          queryClient.clear()

          await redirectToLogin()
          logoutPromise = null
        }
      })()

      return logoutPromise
    }

    return {
      user,
      accessToken,
      setAuthData,
      clearAuthData,
      refresh,
      logout,
    }
  },
  {
    persist: {
      pick: ['user'],
    },
  },
)
