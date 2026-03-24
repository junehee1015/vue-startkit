<script setup lang="ts">
import z from 'zod'
import { useLogin } from '@/features/auth/model'
import { ROUTE_NAMES } from '@/constants/routes'

const router = useRouter()

const { mutate: login, isPending } = useLogin()

const savedEmail = localStorage.getItem('saved_email')

const validationSchema = toTypedSchema(
  z.object({
    email: z.email('올바른 이메일 형식이 아닙니다.').min(1, '아이디를 입력해주세요.'),
    password: z.string().min(1, '비밀번호를 입력해주세요.'),
    rememberMe: z.boolean().optional(),
  }),
)

const { handleSubmit, defineField, errors } = useForm({
  validationSchema,
  initialValues: {
    email: savedEmail || 'admin@example.com',
    password: '1234',
    rememberMe: !!savedEmail,
  },
})

const [email, emailProps] = defineField('email')
const [password, passwordProps] = defineField('password')
const [rememberMe] = defineField('rememberMe')

const onSubmit = handleSubmit((values) => {
  const { rememberMe, ...loginPayload } = values

  login(loginPayload, {
    onSuccess: async () => {
      rememberMe
        ? localStorage.setItem('saved_email', values.email)
        : localStorage.removeItem('saved_email')

      toast.success('로그인되었습니다.')
      await router.replace({ name: ROUTE_NAMES.HOME })
    },
    onError: () => {
      toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    },
  })
})
</script>

<template>
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
        <BaseCheckbox id="remember" v-model="rememberMe" />
        <BaseLabel for="remember" class="cursor-pointer font-normal text-gray-600">
          아이디 기억하기
        </BaseLabel>
      </div>
      <RouterLink to="/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
        비밀번호 찾기
      </RouterLink>
    </div>

    <BaseButton type="submit" class="w-full" size="lg" :disabled="isPending">
      {{ isPending ? '로그인 중...' : '로그인' }}
    </BaseButton>
  </form>
</template>
