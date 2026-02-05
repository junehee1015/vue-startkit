<script setup lang="ts">
import { definePage } from 'unplugin-vue-router/runtime'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from 'vue-sonner'
import EmptyLayout from '@/components/layouts/EmptyLayout.vue'

definePage({
  meta: {
    layout: EmptyLayout,
    title: '로그인',
  },
})

const router = useRouter()

const validationSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, '이메일을 입력해주세요.')
      .email('올바른 이메일 형식이 아닙니다.'),
    password: z.string().min(1, '비밀번호를 입력해주세요.'),
    rememberMe: z.boolean().optional(),
  })
)

const { handleSubmit, isSubmitting, defineField, errors } = useForm({
  validationSchema,
})

const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')
const [rememberMe] = defineField('rememberMe')

const onSubmit = handleSubmit(async (values) => {
  try {
    // API 호출 시뮬레이션 (나중에 api.post('/login', values)로 교체)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (values.email !== 'admin@example.com' || values.password !== '1234')
      throw new Error('로그인에 실패했습니다.')

    console.log('로그인 성공:', values)
    toast.success('로그인되었습니다.')

    router.push('/')
  } catch (_error) {
    toast.error('로그인에 실패했습니다.')
  }
})
</script>

<template>
  <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Vue Startkit</h1>
      <p class="mt-2 text-sm text-gray-600">관리자 대시보드에 오신 것을 환영합니다.</p>
    </div>

    <form @submit="onSubmit" class="space-y-6">

      <BaseFormField label="이메일" :error-message="errors.email">
        <BaseInput v-model="email" v-bind="emailProps" type="email" placeholder="admin@example.com"
          :invalid="!!errors.email" />
      </BaseFormField>

      <BaseFormField label="비밀번호" :error-message="errors.password">
        <BaseInput v-model="password" v-bind="passwordProps" type="password" placeholder="••••••••"
          :invalid="!!errors.password" />
      </BaseFormField>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BaseCheckbox id="remember" v-model:checked="rememberMe" />
          <BaseLabel for="remember" class="cursor-pointer font-normal text-gray-600">
            아이디 기억하기
          </BaseLabel>
        </div>
        <a href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500">
          비밀번호 찾기
        </a>
      </div>

      <BaseButton type="submit" class="w-full" size="lg" :disabled="isSubmitting">
        {{ isSubmitting ? '로그인 중...' : '로그인' }}
      </BaseButton>

    </form>

    <p class="text-center text-sm text-gray-600">
      계정이 없으신가요?
      <RouterLink to="/signup" class="font-medium text-blue-600 hover:text-blue-500">
        회원가입
      </RouterLink>
    </p>
  </div>
</template>