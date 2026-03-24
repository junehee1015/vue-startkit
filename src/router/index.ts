import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { ROUTE_NAMES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/model'
import { refreshAccessToken } from '@/api/request'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  NProgress.start()

  const authStore = useAuthStore()

  // 토큰은 없고 사용자 정보만 있는 경우 토큰 갱신
  if (!authStore.accessToken && authStore.user) {
    try {
      await refreshAccessToken()
    } catch {} // 에러 처리를 안해도 아래에서 토큰을 재조회 후 로그인으로 보냄
  }

  // 토큰 갱신 이후 다시 토큰 확인
  const isAuthenticated = !!authStore.accessToken // 토큰 보유 여부
  const isGuestOnly = to.meta.guestOnly === true // 토큰이 있으 때 접근 불가능한 페이지
  const isPublic = to.meta.requiresAuth === false || to.matched.length === 0 // 토큰 있을 때 접근 가능한 페이지

  if (isAuthenticated && isGuestOnly) return { name: ROUTE_NAMES.HOME }

  if (!isAuthenticated && !isGuestOnly && !isPublic) return { name: ROUTE_NAMES.LOGIN }
})

router.afterEach(() => {
  NProgress.done()
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
