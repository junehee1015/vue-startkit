<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  class?: string
}

const { title, description, class: className } = defineProps<Props>()
</script>

<template>
  <div :class="cn('rounded-xl border bg-white text-gray-950 shadow-sm', className)">
    <div v-if="title || $slots.header" class="flex flex-col space-y-1.5 p-6">
      <slot name="header">
        <h3 v-if="title" class="text-2xl font-semibold leading-none tracking-tight">
          {{ title }}
        </h3>
        <p v-if="description" class="text-sm text-gray-500">
          {{ description }}
        </p>
      </slot>
    </div>

    <div class="p-6 pt-0">
      <slot />
    </div>

    <div v-if="$slots.footer" class="flex items-center p-6 pt-0">
      <slot name="footer" />
    </div>
  </div>
</template>
