# 🚀 Vue 3 Startkit

실무 수준의 확장성과 생산성을 고려하여 구성된 Vue 3 프로젝트 템플릿입니다.  
최신 Vue 생태계의 Best Practice를 모아두었으며, 바로 비즈니스 로직 개발에 집중할 수 있도록 설정되어 있습니다.

## 🛠 Tech Stack

### Core

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [unplugin-vue-router](https://github.com/posva/unplugin-vue-router) (File-based Routing + Typed Routes)

### State & Data

- **Global State**: [Pinia](https://pinia.vuejs.org/) + `pinia-plugin-persistedstate` (새로고침 유지)
- **Server State**: [TanStack Query v5](https://tanstack.com/query/latest) (API 캐싱, 로딩, 에러 관리)
- **HTTP Client**: [Ofetch](https://github.com/unjs/ofetch) (Fetch API Wrapper)

### UI & Styling

- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Oxide Engine)
- **Headless UI**: [Radix Vue](https://www.radix-vue.com/) (접근성, 키보드 조작)
- **Icons**: [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
- **Toast**: [Vue Sonner](https://vue-sonner.vercel.app/)

### Forms & Utilities

- **Validation**: [Vee-Validate](https://vee-validate.logaretm.com/v4/) + [Zod](https://zod.dev/)
- **Date**: [Day.js](https://day.js.org/)
- **Hooks**: [VueUse](https://vueuse.org/)

---

## 📂 Folder Structure

```text
src/
├── api/                # API 통신 설정 및 서비스 로직 (Auto Import)
│   └── api.ts          # ofetch 인스턴스 (Interceptor 설정됨)
├── assets/             # 정적 리소스 (이미지, 폰트, CSS)
├── components/         # UI 컴포넌트
│   ├── common/         # 버튼, 인풋 등 원자 단위 컴포넌트
│   └── layout/         # 헤더, 사이드바 등 레이아웃 컴포넌트
├── composables/        # 재사용 가능한 로직 (Custom Hooks)
├── layouts/            # 페이지 레이아웃 (Default, Empty - Auto Import)
├── pages/              # 파일 기반 라우팅 페이지 (Views)
├── router/             # 라우터 설정 (auto-routes 플러그인 연결)
├── stores/             # Pinia 전역 상태 스토어
├── types/              # TypeScript 인터페이스 및 Zod 스키마
└── utils/              # 순수 헬퍼 함수
```

# 🚀 Getting Started

## 의존성 설치

```
npm install
```

## 개발 서버 실행

```
npm run dev
```

## 배포 서버 실행

```
npm run build
```

## 환경 변수 설정

루트 경로에 .env 파일을 생성하고 API 주소를 설정하세요.

```
VITE_API_URL=http://localhost:8080/api
VITE_APP_TITLE=My App
```

# 📖 Usage Guide

## 1. 파일 기반 라우팅 (File-based Routing)

`src/pages` 폴더 내의 파일 구조가 곧 URL 경로가 됩니다. `definePage` 매크로를 사용하여 메타 데이터(레이아웃, 타이틀 등)를 설정합니다.

```html
<script setup lang="ts">
  // import 불필요 (Auto Import)
  definePage({
    meta: {
      layout: EmptyLayout, // src/layouts 폴더 자동 스캔
      title: '로그인',
      requiresAuth: false,
    },
  })
</script>
```

## 2. 폼 유효성 검사 (Vee-Validate + Zod)

`v-bind`와 `defineField`를 사용하여 간결하게 폼을 구성합니다.

```html
<script setup lang="ts">
  // 모든 유틸리티 Auto Import 됨 (import 문 불필요)

  const schema = toTypedSchema(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    }),
  )

  const { handleSubmit, defineField, errors } = useForm({ validationSchema: schema })
  const [email, emailProps] = defineField('email')
</script>

<template>
  <form @submit="handleSubmit(onSubmit)">
    <BaseFormField label="이메일" :error-message="errors.email">
      <BaseInput v-model="email" v-bind="emailProps" :invalid="!!errors.email" />
    </BaseFormField>
    <BaseButton type="submit">전송</BaseButton>
  </form>
</template>
```

## 3. API 요청 (ofetch)

`src/api/api.ts`에 토큰 자동 주입 및 에러 인터셉터가 설정되어 있습니다.

```ts
// GET
const users = await api('/users')

// POST
await api('/login', {
  method: 'POST',
  body: { email: 'test@test.com' },
})
```

## 4. 데이터 페칭 (TanStack Query)

서버 데이터는 반드시 useQuery를 사용해 관리합니다. (Pinia 사용 지양)

```ts
const { data, isLoading, isError } = useQuery({
  queryKey: ['sessions'], // 고유 키
  queryFn: () => api('/sessions'), // API 호출 함수
})
```

## 5. 강력한 Auto Import

개발 생산성을 위해 대부분의 라이브러리와 내부 모듈이 자동으로 import 됩니다.

- **Vue**: `ref`, `reactive`, `computed`, `watch`, `onMounted` ...
- **Components** : `DefaultLayout`, `BaseButton`
- **Project**: `src/api`, `src/composables`, `src/utils` 내부 파일들
- **Router**: `useRouter`, `useRoute`, `definePage`
- **Pinia**: `storeToRefs`
- **VueUse**: `useStorage`

## 🎨 Styling (Tailwind CSS v4)

CSS 파일 생성 없이 유틸리티 클래스로 스타일링합니다.

## ✅ Convention

- **Page Component**: File-based Routing 규칙에 따름 (index.vue, [id].vue)
- **Component** Name: PascalCase (`BaseButton.vue`, `TheHeader.vue`)
- **Variable**: camelCase
- **Layout**: `src/layouts` 폴더에 위치하며, `definePage`를 통해 적용
- **Formatter**: Prettier (Save 시 자동 포맷팅 설정됨)
- **Lint**: ESLint (Vue 3 Recommended)
