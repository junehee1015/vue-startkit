import type { App } from 'vue'
import { setupPinia } from './pinia'
import { setupRouter } from './router'
import { setupTanstackQuery } from './vue-query'

export const registerPlugins = (app: App) => {
  setupPinia(app)
  setupRouter(app)
  setupTanstackQuery(app)
}
