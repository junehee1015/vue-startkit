import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { ROUTE_NAMES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/model'
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  nProgress.start()

  const authStore = useAuthStore()

  // 토큰은 없고 사용자 정보만 있는 경우 토큰 갱신
  if (!authStore.accessToken && authStore.user) {
    try {
      await authStore.refresh()
    } catch {
      await authStore.logout()
    }
  }

  // 토큰 갱신 이후 다시 토큰 확인
  const isAuthenticated = !!authStore.accessToken
  const isPublic = to.meta.isPublic === true

  if (isAuthenticated && isPublic) return { name: ROUTE_NAMES.HOME }

  if (!isAuthenticated && !isPublic) return { name: ROUTE_NAMES.LOGIN }

  return true
})

router.afterEach(() => {
  nProgress.done()
})

router.onError((error) => {
  console.error('Router Error:', error)
  nProgress.done()
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
