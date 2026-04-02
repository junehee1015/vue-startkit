<script setup lang="ts">
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import LoginForm from '@/features/auth/ui/LoginForm.vue'

definePage({
  name: 'login',
  meta: {
    layout: EmptyLayout,
    title: '로그인',
    isGuestOnly: true,
  },
})

onMounted(() => {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') toast.warning('Mock 서버가 아닙니다.')
  else toast.success('Mock 서버입니다.')
})
</script>

<template>
  <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Vue Startkit</h1>
    </div>
    <LoginForm />
    <p class="text-center text-sm text-gray-600">
      계정이 없으신가요?
      <RouterLink to="/signup" class="font-medium text-blue-600 hover:text-blue-500">
        회원가입
      </RouterLink>
    </p>
  </div>
</template>
