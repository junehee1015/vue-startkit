import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: Component
    requiresAuth?: boolean
    title?: string
    breadcrumb?: string
  }
}
