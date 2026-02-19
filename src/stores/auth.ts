interface User {
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

    // 1. 로그인
    const login = async (values: LoginPayload) => {
      // API 지연 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (values.email !== 'admin@example.com' || values.password !== '1234') {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
      }

      // 토큰 발급 (실제로는 서버에서 받아옴)
      accessToken.value = 'mock-access-token-' + Date.now()
      refreshToken.value = 'mock-refresh-token-' + Date.now()
      user.value = {
        name: 'Juny Jo',
        email: values.email,
        role: 'Admin',
      }
    }

    // 2. 토큰 갱신 (Mock)
    // Access Token이 만료되었을 때 호출됨
    const refreshAccessToken = async (): Promise<void> => {
      try {
        // 순환 참조 방지를 위해 순수 ofetch인 refreshRequest instance를 사용해야 함

        // API 지연 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 300))

        // 리프레시 토큰이 없으면 실패 처리
        if (!refreshToken.value) throw new Error('No refresh token')

        // 리프레시 토큰을 서버에 보내고 새 엑세스 토큰을 받음
        accessToken.value = 'new-access-token-' + Date.now()
      } catch (error) {
        logout() // 갱신 실패 시 강제 로그아웃
        throw error
      }
    }

    // 3. 로그아웃
    const logout = async () => {
      user.value = null
      accessToken.value = null
      refreshToken.value = null

      await nextTick()
      localStorage.removeItem('auth')
    }

    return {
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      login,
      refreshAccessToken,
      logout,
    }
  },
  {
    // 새로고침 해도 로그인 상태 유지 (Local Storage 사용)
    persist: true,
  },
)
