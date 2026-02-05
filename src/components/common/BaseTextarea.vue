<script setup lang="ts">
interface Props {
  placeholder?: string
  errorMessage?: string
  class?: string
  disabled?: boolean
  id?: string
}

const {
  placeholder,
  errorMessage,
  class: className,
  disabled = false,
  id,
} = defineProps<Props>()

const model = defineModel<string>()
const textareaId = id || useId()
</script>

<template>
  <div class="w-full space-y-1">
    <textarea :id="textareaId" v-model="model" :placeholder="placeholder" :disabled="disabled" :class="cn(
      'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
      errorMessage && 'border-red-500 focus-visible:ring-red-500',
      className
    )" />
    <p v-if="errorMessage" class="text-xs text-red-500 font-medium">
      {{ errorMessage }}
    </p>
  </div>
</template>