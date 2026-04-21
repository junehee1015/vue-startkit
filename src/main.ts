import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import 'vue-sonner/style.css'
import '@/assets/css/main.css'

import { registerPlugins } from './plugins'
import { useAuthStore } from './features/auth/model'

const enableMocking = async () => {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true' || import.meta.env.PROD) return
  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

const refreshAccessToken = async () => {
  const authStore = useAuthStore()
  if (!authStore.user) return

  try {
    await authStore.refresh()
  } catch (error) {
    console.warn('Initialization silent refresh failed.', error)
    authStore.clearAuthData()
  }
}

const initApp = async () => {
  try {
    await enableMocking()

    const app = createApp(App)

    registerPlugins(app)

    await app.runWithContext(() => refreshAccessToken())

    app.use(router)

    await router.isReady()

    app.mount('#app')
  } catch (error) {
    console.error('Failed to initialize application:', error)
  }
}

initApp()
