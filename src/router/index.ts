import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import type { RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

// 이미 meta.layout이 설정되어 있다면(예: 로그인 페이지) 건너뜀
const setupLayouts = (routes: readonly RouteRecordRaw[]): RouteRecordRaw[] => {
  return routes.map((route) => {
    const newRoute = { ...route }

    newRoute.meta = {
      ...route.meta,
      requiresAuth: route.meta?.requiresAuth ?? true,
      layout: route.meta?.layout || DefaultLayout,
    }

    if (route.children) {
      newRoute.children = setupLayouts(route.children)
    }
    return newRoute
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 네비게이션 가드 설정
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  // 이미 로그인했으면 홈으로
  if (to.path === '/login') {
    if (authStore.isAuthenticated) return next('/')
    return next()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login')
  }

  // 3. 공개 페이지, requiresAuth가 false인 경우 (404 등)
  next()
})

if (import.meta.hot) {
  handleHotUpdate(router)
}

export default router
