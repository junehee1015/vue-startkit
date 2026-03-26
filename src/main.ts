import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import '@/assets/css/main.css'
import 'vue-sonner/style.css'
import { registerPlugins } from './plugins'

const enableMocking = async () => {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') return
  if (import.meta.env.PROD) return
  const { worker } = await import('@/mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

const initApp = async () => {
  await enableMocking()

  const app = createApp(App)

  registerPlugins(app)

  await router.isReady()

  app.mount('#app')
}

initApp()
