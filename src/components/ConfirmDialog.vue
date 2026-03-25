<script setup lang="ts">
import { useConfirmState } from '@/composables/useConfirm'
import {
  AlertDialogRoot,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  VisuallyHidden,
} from 'reka-ui'

const { isOpen, options, handleConfirm, handleCancel, handleOpenChange } = useConfirmState()
</script>

<template>
  <AlertDialogRoot :open="isOpen" @update:open="handleOpenChange">
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
      />

      <AlertDialogContent
        class="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg animate-in zoom-in-95"
      >
        <div class="flex flex-col space-y-2 text-center sm:text-left">
          <AlertDialogTitle class="text-lg font-semibold">
            {{ options.title }}
          </AlertDialogTitle>
          <AlertDialogDescription v-if="options.description" class="text-sm text-gray-500">
            {{ options.description }}
          </AlertDialogDescription>
          <VisuallyHidden v-else as-child>
            <AlertDialogDescription>
              이 알림창에는 세부 설명이 포함되어 있지 않습니다.
            </AlertDialogDescription>
          </VisuallyHidden>
        </div>

        <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <BaseButton v-if="!options.hideCancel" variant="outline" @click="handleCancel">
            {{ options.cancelText }}
          </BaseButton>

          <BaseButton
            :variant="options.variant === 'danger' ? 'danger' : 'primary'"
            @click="handleConfirm"
          >
            {{ options.confirmText }}
          </BaseButton>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
