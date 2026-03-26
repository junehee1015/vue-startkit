import { useAuthStore, type LoginPayload } from '@/features/auth/model/store'
import { loginApi } from '@/features/auth/api'

export const useLogin = () => {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (response) => authStore.setAuthData(response.accessToken, response.user),
    onError: (error) => console.error('Login failed:', error),
  })
}
