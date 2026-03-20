export interface User {
  name: string
  email: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)

    const isAuthenticated = computed(() => !!accessToken.value)

    const setAuthData = (newAccessToken: string, newRefreshToken: string, userData: User) => {
      accessToken.value = newAccessToken
      refreshToken.value = newRefreshToken
      user.value = userData
    }

    const clearAuthData = () => {
      accessToken.value = null
      refreshToken.value = null
      user.value = null
    }

    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      setAuthData,
      clearAuthData,
    }
  },
  {
    // 새로고침 해도 로그인 상태 유지 (Local Storage 사용)
    persist: true,
  },
)
