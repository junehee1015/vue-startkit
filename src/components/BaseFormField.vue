<script setup lang="ts">
interface Props {
  label?: string
  errorMessage?: string
  id?: string
  required?: boolean
}

const {
  label,
  errorMessage,
  id,
  required = false
} = defineProps<Props>()

const fieldId = id || useId()
</script>

<template>
  <div class="space-y-2">
    <div v-if="label" class="flex items-center justify-between">
      <BaseLabel :for="fieldId" :class="errorMessage ? 'text-red-500' : ''">
        {{ label }}
        <span v-if="required" class="text-red-500 ml-0.5">*</span>
      </BaseLabel>
    </div>

    <slot :id="fieldId" />

    <p v-if="errorMessage" class="text-[0.8rem] font-medium text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>