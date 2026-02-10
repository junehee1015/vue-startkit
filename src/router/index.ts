import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 네비게이션 가드 설정
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 이미 로그인했으면 홈으로
  if (to.path === '/login') {
    if (authStore.isAuthenticated) return next('/')
    return next()
  }

  const isPublic = to.meta.requiresAuth === false

  // 로그인이 안되어 있으면 로그인
  if (!isPublic && !authStore.isAuthenticated) {
    return next('/login')
  }

  // 공개 페이지, requiresAuth가 false인 경우 (404 등)
  next()
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
