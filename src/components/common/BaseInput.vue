<script setup lang="ts">
defineOptions({ inheritAttrs: false })

interface Props {
  class?: string
  id?: string
  invalid?: boolean
}

const { class: className, id, invalid = false } = defineProps<Props>()
const model = defineModel<string | number>()
const inputId = id || useId()
</script>

<template>
  <div class="w-full space-y-1">
    <input
      :id="inputId"
      v-model="model"
      v-bind="$attrs"
      :class="
        cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          invalid && 'border-red-500 focus-visible:ring-red-500',
          className,
        )
      "
    />
  </div>
</template>
