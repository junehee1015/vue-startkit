import { logoutApi } from '@/features/auth/api'
import { useAuthStore } from '@/features/auth/model'

export const useLogout = () => {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutApi,
    onError: (error) => {
      console.warn('Backend logout failed, but clearing local data forcefully.', error)
    },
    onSettled: () => {
      authStore.clearAuthData()
      queryClient.clear()
      localStorage.removeItem('auth')
    },
  })
}
