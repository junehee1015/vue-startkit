<script setup lang="ts">
import EmptyLayout from '@/layouts/EmptyLayout.vue'

definePage({
  name: 'login',
  meta: {
    layout: EmptyLayout,
    title: '로그인',
    requiresAuth: false,
  },
})

const router = useRouter()
const authStore = useAuthStore()

const savedEmail = localStorage.getItem('saved_email')

const validationSchema = toTypedSchema(
  z.object({
    email: z.email('올바른 이메일 형식이 아닙니다.').min(1, '아이디를 입력해주세요.'),
    password: z.string('비밀번호를 입력해주세요.').min(1, '비밀번호를 입력해주세요.'),
    rememberMe: z.boolean().optional(),
  }),
)

const { handleSubmit, isSubmitting, defineField, errors } = useForm({
  validationSchema,
  initialValues: {
    email: savedEmail || '',
    password: '1234',
    rememberMe: !!savedEmail,
  },
})

const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')
const [rememberMe] = defineField('rememberMe')

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.login(values)

    if (values.rememberMe) {
      localStorage.setItem('saved_email', values.email)
    } else {
      localStorage.removeItem('saved_email')
    }

    toast.success('로그인되었습니다.')
    await router.replace('/')
  } catch (_error) {
    toast.error('로그인에 실패했습니다.')
  }
})
</script>

<template>
  <div class="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg border border-gray-100">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Vue Startkit</h1>
    </div>

    <form @submit="onSubmit" class="space-y-6">
      <BaseFormField label="이메일" :error-message="errors.email" v-slot="{ id }">
        <BaseInput
          v-model="email"
          v-bind="emailProps"
          :id="id"
          type="email"
          placeholder="admin@example.com"
          :invalid="!!errors.email"
        />
      </BaseFormField>

      <BaseFormField label="비밀번호" :error-message="errors.password" v-slot="{ id }">
        <BaseInput
          v-model="password"
          v-bind="passwordProps"
          :id="id"
          type="password"
          placeholder="••••••••"
          :invalid="!!errors.password"
        />
      </BaseFormField>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BaseCheckbox id="remember" v-model:checked="rememberMe" />
          <BaseLabel for="remember" class="cursor-pointer font-normal text-gray-600">
            아이디 기억하기
          </BaseLabel>
        </div>
        <RouterLink to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
          비밀번호 찾기
        </RouterLink>
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
