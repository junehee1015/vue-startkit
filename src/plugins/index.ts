import type { App } from 'vue'

export const registerPlugins = (app: App) => {
  setupPinia(app)
  setupRouter(app)
  setupTanstackQuery(app)
}
