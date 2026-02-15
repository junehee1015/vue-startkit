import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { ROUTE_NAMES } from '@/constants/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // meta.requiresAuth가 명시적으로 false인 경우만 '공개' 페이지
  // undefined인 경우(기본값)는 '비공개'로 간주하여 보안 강화
  const isPublic = to.meta.requiresAuth === false
  const isAuthenticated = authStore.isAuthenticated

  // 비로그인 유저가 '인증 필요 페이지' 접근 시
  if (!isPublic && !isAuthenticated) {
    return next({ name: ROUTE_NAMES.LOGIN })
  }

  // 이미 로그인한 유저가 '로그인/회원가입' 페이지 접근 시 홈으로
  if (isAuthenticated && to.name === ROUTE_NAMES.LOGIN) {
    return next({ name: ROUTE_NAMES.HOME })
  }

  // 그 외 통과
  next()
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
