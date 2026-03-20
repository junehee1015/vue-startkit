import { useAuthStore, type LoginPayload, type User } from '@/stores/authStore'
// import { ofetch } from 'ofetch'
// import { request } from '@/api/request' //

export const useAuth = () => {
  const authStore = useAuthStore()

  const login = async (values: LoginPayload) => {
    try {
      // const response = await ofetch<{ accessToken: string; refreshToken: string; user: User }>(
      //   '/login',
      //   {
      //     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
      //     method: 'POST',
      //     body: values,
      //   },
      // )
      // authStore.setAuthData(response.accessToken, response.refreshToken, response.user)

      await new Promise((resolve) => setTimeout(resolve, 500))

      if (values.email !== 'admin@example.com' || values.password !== '1234') {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
      }

      const mockAccessToken = 'mock-access-token-' + Date.now()
      const mockRefreshToken = 'mock-refresh-token-' + Date.now()
      const mockUser = {
        name: 'Juny Jo',
        email: values.email,
        role: 'Admin',
      }

      authStore.setAuthData(mockAccessToken, mockRefreshToken, mockUser)
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // await request('/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout API failed, but forcing local logout', error)
    } finally {
      authStore.clearAuthData()
      await nextTick()
      localStorage.removeItem('auth')
    }
  }

  return { login, logout }
}
