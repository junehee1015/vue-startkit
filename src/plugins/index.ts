import type { App } from 'vue'
import { setupPinia } from './pinia'
import { setupRouter } from './router'
import { setupTanstackQuery } from './vue-query'
import { setupErrorHandler } from './error-handler'

export const registerPlugins = (app: App) => {
  setupErrorHandler(app)
  setupPinia(app)
  setupRouter(app)
  setupTanstackQuery(app)
}
