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

  const isAuthenticated = !!authStore.accessToken // 토큰 보유 여부
  const isPublic = to.meta.isPublic === true // 로그인 & 비로그인 모두 접근 가능
  const isGuestOnly = to.meta.isGuestOnly === true // 비로그인만 접근 가능

  // 로그인은 통과
  if (to.name === ROUTE_NAMES.LOGIN) {
    if (isAuthenticated) return { name: ROUTE_NAMES.HOME }
    return true
  }

  // 비로그인만 접근 가능
  if (isGuestOnly) {
    if (isAuthenticated) return { name: ROUTE_NAMES.HOME }
    return true
  }

  // 모두 접근 가능
  if (isPublic) return true

  // 토큰이 없으면 로그인으로
  if (!isAuthenticated) return { name: ROUTE_NAMES.LOGIN }
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
