import { ref } from 'vue'

interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
}

const isOpen = ref(false)
const options = ref<ConfirmOptions>({
  title: '',
  description: '',
  confirmText: '확인',
  cancelText: '취소',
  variant: 'primary',
})

let resolvePromise: (value: boolean) => void = () => {}

export const useConfirmState = () => {
  return { isOpen, options, handleConfirm, handleCancel }
}

export const openConfirm = (userOptions: ConfirmOptions): Promise<boolean> => {
  options.value = {
    confirmText: '확인',
    cancelText: '취소',
    variant: 'primary',
    ...userOptions, // 사용자 옵션
  }
  isOpen.value = true

  // Promise를 반환해서 await을 쓸 수 있게 함
  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

// 내부 동작 함수
const handleConfirm = () => {
  isOpen.value = false
  resolvePromise(true) // true 반환
}

const handleCancel = () => {
  isOpen.value = false
  resolvePromise(false) // false 반환
}
