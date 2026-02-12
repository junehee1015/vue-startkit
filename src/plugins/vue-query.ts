import type { App } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 1,
      retryDelay: (failureCount) => {
        // 예: 1초 -> 2초 -> 4초 ... (최대 30초)
        return Math.min(1000 * 2 ** failureCount, 30000)
      },
    },
  },
})

export const setupTanstackQuery = (app: App) => {
  app.use(VueQueryPlugin, { queryClient })
}
