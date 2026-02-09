import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface LoginPayload {
  email: string
  password: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<{ name: string; email: string; role: string } | null>(null)
    const token = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value)

    const login = async (values: LoginPayload) => {
      // 백엔드 없이 프론트에서만 처리하므로 가짜 지연 시간과 데이터 주입
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (values.email !== 'admin@example.com' || values.password !== 'Zxcv@1234') {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
      }

      // 가짜 토큰과 유저 정보 저장
      token.value = 'mock-jwt-token-12345'
      user.value = {
        name: 'Juny Jo',
        email: values.email,
        role: 'Admin',
      }

      return true
    }

    const logout = () => {
      user.value = null
      token.value = null
    }

    return {
      user,
      token,
      isAuthenticated,
      login,
      logout,
    }
  },
  {
    // 새로고침 해도 로그인 상태 유지 (Local Storage 사용)
    persist: true,
  },
)
