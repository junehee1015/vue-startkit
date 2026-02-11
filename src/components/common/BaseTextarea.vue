<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

interface Props {
  placeholder?: string
  class?: string
  disabled?: boolean
  id?: string
  invalid?: boolean
}

const {
  placeholder,
  class: className,
  disabled = false,
  id,
  invalid = false,
} = defineProps<Props>()

const model = defineModel<string>()
const textareaId = id || useId()
</script>

<template>
  <div class="w-full space-y-1">
    <textarea
      :id="textareaId"
      v-model="model"
      v-bind="$attrs"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="
        cn(
          'flex min-h-20 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white',
          'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid && 'border-red-500 focus-visible:ring-red-500', // 에러 스타일
          className,
        )
      "
    />
  </div>
</template>
