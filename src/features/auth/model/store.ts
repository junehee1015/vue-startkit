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

    const setAuthData = (newAccessToken: string, userData = user.value) => {
      accessToken.value = newAccessToken
      user.value = userData
    }

    const clearAuthData = () => {
      accessToken.value = null
      user.value = null
    }

    return {
      user,
      accessToken,
      setAuthData,
      clearAuthData,
    }
  },
  {
    persist: {
      pick: ['user'],
    },
  },
)
