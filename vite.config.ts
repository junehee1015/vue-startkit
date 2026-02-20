import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  plugins: [
    VueRouter({
      dts: 'src/types/typed-router.d.ts',
    }),
    vue(),
    vueDevTools(),
    tailwindcss(),
    AutoImport({
      imports: [
        'vue',
        'pinia',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          'vee-validate': ['useForm', 'useField', 'defineField', 'useFieldArray', 'configure'],
          '@vee-validate/zod': ['toTypedSchema'],
          'vue-sonner': ['toast'],
          '@tanstack/vue-query': ['useQuery', 'useMutation', 'useQueryClient', 'useSuspenseQuery'],
        },
      ],
      dirs: ['./src/composables', './src/stores'],
      dts: 'src/types/auto-imports.d.ts',
      vueTemplate: true,
    }),
    Components({
      dts: 'src/types/components.d.ts',
      dirs: ['./src/components/**', './src/layouts/**'],
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
