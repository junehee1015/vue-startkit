# 🚀 Vue Startkit

실무 수준의 **확장성(Scalability)** 과 **유지보수성(Maintainability)** 을 최우선으로 고려한 Vue 3 프로젝트 템플릿입니다.  
최신 Vue 생태계의 Best Practice가 적용되어 있으며, 복잡한 초기 설정 없이 바로 비즈니스 로직 개발에 집중할 수 있습니다.

## ✨ Key Features

- **Architecture**:
  - **FSD-Lite**: 도메인 응집도(Domain Colocation)의 핵심 철학만 적용한 아키텍처
  - **3-Layer Fetching**: `API Definition` -> `Query Composable` -> `View Component`
- **Developer Experience**:
  - **Auto Import**: Vue, Router, Pinia, Zod 등 자동 임포트
  - **File-based Routing** (`unplugin-vue-router`)
- **Robust Auth**: ofetch를 활용한 JWT 핸들링, Refresh Token **동시성 제어(Race Condition)** 완벽 처리

---

## 🛠 Tech Stack

| Category           | Technology                                                                      | Description                               |
| :----------------- | :------------------------------------------------------------------------------ | :---------------------------------------- |
| **Core**           | [Vue 3](https://vuejs.org/)                                                     | Composition API (`<script setup>`)        |
| **Build**          | [Vite 6](https://vitejs.dev/)                                                   | Next Generation Frontend Tooling          |
| **State (Client)** | [Pinia](https://pinia.vuejs.org/)                                               | Global State + Persisted State            |
| **State (Server)** | [TanStack Query v5](https://tanstack.com/query/latest)                          | Auto Caching, Deduping, Background Update |
| **HTTP**           | [ofetch](https://github.com/unjs/ofetch)                                        | Fetch API Wrapper (Interceptor 구현)      |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/)                                     | Utility-first CSS framework               |
| **UI Primitive**   | [Reka](https://reka-ui.com/)                                                    | Unstyled, Accessible Components           |
| **Validation**     | [Vee-Validate](https://vee-validate.logaretm.com/v4/) + [Zod](https://zod.dev/) | Type-safe Form Validation                 |

---

## 📂 Project Structure

```text
src/
├── assets/                  # 정적 리소스 (Images, Fonts, CSS)
├── components/              # 공통 컴포넌트 (BaseInput.vue, BaseButton.vue...)
│   └── layout/              # layouts 컴포넌트 (TheHeader.vue, TheSidebar.vue...)
├── composables/             # 전역으로 재사용 가능한 로직 정의 (useConfirm.ts...)
├── constants/               # 상수
│   └── routes.ts            # router name 상수 모음
├── features/                # 도메인별 비즈니스 로직
│   └── auth/
│       ├── api/             # 서버 통신 로직 (index.ts, user.api.ts 등)
│       ├── model/           # 비즈니스 로직 및 상태 관리 (composables, stores 통합)
│       │   ├── composables/ # 도메인 별 비즈니스 로직
│       │   └── store.ts     # 도메인 별 Pinia 상태 관리
│       └── ui/              # 도메인 별 컴포넌트
├── layouts/                 # 페이지 레이아웃 (Default, Empty)
├── lib/
│   └── api.ts               # Ofetch 인스턴스 (Interceptor & Token Logic)
├── mocks/                   # MSW (목업 BE)
│   └── handlers             # 목업 BE (auth.ts ...)
├── pages/                   # 파일 기반 라우팅 (File-based Routing)
├── plugins/                 # Pinia, Router, Query 등 라이브러리 설정
├── router/
│   └── index.ts             # 네비게이션 가드
├── stores/                  # Pinia 전역 상태 관리
├── types/                   # TypeScript 인터페이스 및 Zod 스키마
└── utils/                   # 순수 헬퍼 함수
```

## 🚀 Getting Started

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
pnpm run dev
```

### 3. Mock(MSW) 서버 실행

```bash
pnpm run dev:mock
```

### 4. 빌드 및 배포

```bash
pnpm run build
```

### 5. 환경 변수 설정 (.env)

루트 경로에 `.env` 파일을 생성하고 API 주소를 설정하세요.

```env
VITE_API_URL=http://localhost:8080
VITE_APP_TITLE=My Vue App
```

---

## 📖 Architecture Guide

이 스타트킷은 **"설정보다는 관례(Convention over Configuration)"** 를 따릅니다.

### 1. API & Data Fetching (3-Layer Pattern)

데이터 흐름을 명확히 하기 위해 API 호출을 3단계로 분리합니다.

**Step 1: API 정의 (`src/features/[도메인]/api/index.ts`) Named Export(개별 함수)** 형태로 정의하여 불필요한 코드가 번들에 포함되지 않도록 합니다.

```typescript
import { api } from '@/lib/api'

export const fetchUsers = (page: number, status?: string) => {
  return api<User[]>('/users', {
    query: { page, status },
  })
}

export const createUser = (body) => {
  return api<User>('/users', {
    method: 'POST',
    body,
  })
}
```

**Step 2: Composable 생성 (`src/features/[도메인]/model/composables/*.ts`)** **Query Key Factory Pattern**을 적용하여 키를 관리하고, TanStack Query 옵션을 캡슐화합니다.

```typescript
import { fetchUsers, createUser } from '@/features/user/api'
import type { Ref } from 'vue'

// 1. Key Factory Pattern (배열 형태의 확장 가능한 키 구조)
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: Ref<number>, status?: Ref<string>) => [...userKeys.lists(), page, status] as const,
}

// 2. Query Hook (목록 조회)
export const useUserList = (page: Ref<number>, status?: Ref<string>) => {
  return useQuery({
    queryKey: userKeys.list(page, status), // 반응형 변수가 변경되면 자동 재요청
    queryFn: () => fetchUsers(page.value, status?.value),
  })
}

// 3. Mutation Hook (생성)
export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 생성 성공 시, 캐시를 무효화하여 목록 화면을 최신화합니다.
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
    onError: (error) => {
      // 에러 처리
      console.error('유저 생성 실패:', error)
    },
  })
}
```

**Step 3: 컴포넌트 사용 (`src/pages/*.vue`)** 컴포넌트는 비즈니스 로직 없이 데이터 바인딩에만 집중합니다.

페이지의 중요도와 UI 구성에 따라 **부모에게 위임(ErrorBoundary)** 하거나 자식에서 **직접(try-catch)** 처리할 수 있습니다.

**📌 Case A: 부모에게 위임 (ErrorBoundary 공통 컴포넌트 사용)** -
에러 발생 시 부모 컴포넌트에서 에러를 가로챕니다. 자식은 성공했을 때의 UI만 작성합니다.

```typescript
// src/features/user/ui/UserList.vue - Children
<script setup lang="ts">
import { useUserList } from '@/features/user/model'

const { data: users, suspense } = useUserList(page)

await suspense()
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

```vue
// src/pages/user/index.vue - Parent
<template>
  <!-- query-key를 넘겨주면 캐시 자동 초기화 기능을 제공합니다. -->
  <ErrorBoundary :query-key="userKeys.all">
    <Suspense>
      <UserList />
      <template #fallback>로딩 중...</template>
    </Suspense>
  </ErrorBoundary>
</template>
```

**📌 Case B: 자식 내부에서 직접 처리** -
실패해도 페이지 전체가 깨지면 안 되는 경우, try-catch로 자식 내부에서 에러를 처리합니다.

```vue
// src/features/widget/ui/WeatherWidget.vue - Children
<script setup lang="ts">
import { useWeather } from '@/features/widget/model'

// 💡 자체 처리를 위해 isError를 가져옵니다.
const { data: weather, suspense, isError } = useWeather()

try {
  await suspense()
} catch (error) {
  // 자식 컴포넌트에서 에러 처리를 합니다.
  console.error('날씨 위젯 로딩 실패')
}
</script>

<template>
  <div v-if="isError" class="text-gray-400 text-sm">날씨 정보를 불러올 수 없습니다.</div>

  <div v-else>오늘의 날씨: {{ weather.temperature }}도</div>
</template>
```

### 2. Authentication (Token Refresh)

`src/lib/api.ts`에는 강력한 **토큰 갱신 로직**이 내장되어 있습니다.

- **Auto Injection**: Access Token이 있으면 헤더에 자동 주입됩니다.
- **Concurrency Control**: 여러 API가 동시에 401 에러를 맞아도, **토큰 갱신 요청은 딱 한 번만** 실행됩니다. (Promise Locking 패턴 적용)
- **Auto Logout**: 갱신 실패 시 자동으로 스토어를 초기화하고 로그인 페이지로 이동합니다.

### 3. File-based Routing & Explicit Naming

`src/pages` 폴더 구조가 곧 URL이 됩니다. (`unplugin-vue-router`)

유지보수성을 위해 `definePage` 매크로 내부에 **Route Name을 명시적으로 선언**하는 것을 원칙으로 합니다.

- `pages/index.vue` → `/`
- `pages/login/index.vue` → `/login`
- `pages/users/[id].vue` → `/users/:id`

**메타 데이터 설정 (`definePage`)**

```typescript
// src/pages/login/index.vue
definePage({
  name: 'login', // ✅ 라우트 이름 고정 (파일 위치가 바뀌어도 안전함)
  meta: {
    layout: DefaultLayout, // 레이아웃 지정 (기본값: Default)
    requiresAuth: false, // 공개 페이지 (기본값: true - Whitelist 방식)
    title: '로그인',
  },
})
```

### 4. Auto Imports

개발 생산성을 위해 자주 사용하는 모듈은 자동으로 import 됩니다. (`vite.config.ts` 참조)

- **Vue**: `ref`, `computed`, `watch`, `onMounted` ...
- **Router**: `useRouter`, `useRoute`, `definePage`
- **Fetching**: `useQuery`, `useMutation`, `useQueryClient`
- **Validation**: `useForm`
- **Project**: `./src/composables`, `./src/stores`

---

## ✅ Naming Convention

| Type                  | Case       | Example                             |
| :-------------------- | :--------- | :---------------------------------- |
| **Component File**    | PascalCase | `BaseButton.vue`, `UserProfile.vue` |
| **Page File**         | kebab-case | `user-profile.vue`, `[id].vue`      |
| **Composable**        | camelCase  | `useUserQuery.ts`                   |
| **API Module**        | camelCase  | `user.ts`, `auth.ts`                |
| **Variable/Function** | camelCase  | `handleSubmit`, `isLoading`         |
| **Interface/Type**    | PascalCase | `User`, `LoginPayload`              |

---

## 📝 License

MIT License
