import { ofetch } from 'ofetch'
import type { FetchOptions, FetchRequest, FetchError } from 'ofetch'
import { useAuthStore } from '@/features/auth/model'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

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
  const getCloneRequest = () => (request instanceof Request ? request.clone() : request)
  const getCloneOptions = () => (options ? { ...options } : undefined)

  try {
    return await _api<T>(getCloneRequest(), getCloneOptions())
  } catch (e) {
    const error = e as FetchError
    const requestUrl = request instanceof Request ? request.url : request.toString()
    const pathname = new URL(requestUrl, 'http://dummy.com').pathname
    const isAuthPath = ['/login', '/logout', '/refresh'].some((path) => pathname.endsWith(path))

    if (error.response?.status === 401 && !isAuthPath) {
      const authStore = useAuthStore()

      try {
        await authStore.refresh()
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        await authStore.logout()
        return new Promise<T>(() => {})
      }

      return await _api<T>(getCloneRequest(), getCloneOptions())
    }

    throw error
  }
}
