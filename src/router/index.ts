import { createRouter, createWebHistory } from 'vue-router'
import EmptyLayout from '@/components/layouts/EmptyLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/sessions',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { layout: EmptyLayout },
    },
    {
      path: '/sessions',
      name: 'session-list',
      component: () => import('@/pages/sessions/SessionListPage.vue'),
    },
    {
      path: '/sessions/:id',
      name: 'session-detail',
      component: () => import('@/pages/sessions/SessionDetailPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
    },
  ],
})

export default router
