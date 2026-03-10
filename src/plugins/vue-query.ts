import type { App } from 'vue'
import { MutationCache, QueryCache, QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  // 전역 에러 처리
  // queryCache: new QueryCache({
  //   onError: (error, query) => {
  //     const errorMessage = query.meta?.errorMessage || error.message
  //     toast.error(errorMessage)
  //   },
  // }),
  // mutationCache: new MutationCache({
  //   onError: (error) => {
  //     toast.error(error.message)
  //   },
  // }),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 1,
    },
  },
})

export const setupTanstackQuery = (app: App) => {
  app.use(VueQueryPlugin, { queryClient })
}
