import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import '@/assets/css/main.css'
import 'vue-sonner/style.css'

const initApp = async () => {
  const app = createApp(App)

  registerPlugins(app)

  await router.isReady()

  app.mount('#app')
}

initApp()
