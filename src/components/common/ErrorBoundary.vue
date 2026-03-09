<script setup lang="ts">
const props = defineProps<{
  queryKey?: any[]
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const error = ref<Error | null>(null)
const queryClient = useQueryClient()

const reset = () => {
  if (props.queryKey) {
    queryClient.resetQueries({ queryKey: props.queryKey })
  }

  error.value = null

  emit('retry')
}

onErrorCaptured((err) => {
  error.value = err as Error
  return false
})
</script>

<template>
  <div v-if="error">
    <slot name="fallback" :error="error" :reset="reset">
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex flex-col items-center justify-center space-y-3 py-4">
          <p class="text-sm font-medium text-red-600">
            {{ error.message || '데이터를 불러오는 중 문제가 발생했습니다.' }}
          </p>
          <button @click="reset"
            class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors">
            다시 시도
          </button>
        </div>
      </div>
    </slot>
  </div>

  <div v-else>
    <slot />
  </div>
</template>