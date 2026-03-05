# 🚀 Vue Startkit

실무 수준의 **확장성(Scalability)** 과 **유지보수성(Maintainability)** 을 최우선으로 고려한 Vue 3 프로젝트 템플릿입니다.  
최신 Vue 생태계의 Best Practice가 적용되어 있으며, 복잡한 초기 설정 없이 바로 비즈니스 로직 개발에 집중할 수 있습니다.

## ✨ Key Features

- **Architecture**:
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
| **HTTP**           | [Ofetch](https://github.com/unjs/ofetch)                                        | Fetch API Wrapper (Interceptor 구현)      |
| **Styling**        | [Tailwind CSS v4](https://tailwindcss.com/)                                     | Utility-first CSS framework               |
| **UI Primitive**   | [Reka](https://reka-ui.com/)                                                    | Unstyled, Accessible Components           |
| **Validation**     | [Vee-Validate](https://vee-validate.logaretm.com/v4/) + [Zod](https://zod.dev/) | Type-safe Form Validation                 |

---

## 📂 Project Structure

```text
src/
├── api/
│   ├── modules/            # 도메인별 API 정의 (user.ts, auth.ts...)
│   └── request.ts          # Ofetch 인스턴스 (Interceptor & Token Logic)
├── assets/                 # 정적 리소스 (Images, Fonts, CSS)
├── components/
│   ├── common/             # 원자 단위 공통 컴포넌트 (BaseButton, BaseInput...)
│   ├── guide/              # (개발 가이드용 컴포넌트 - 배포 시 제외 가능)
│   └── layouts/            # layouts 공통 컴포넌트 (TheHeader.vue, TheSidebar.vue...)
├── composables/            # 재사용 가능한 로직
│   └── queries/            # TanStack Query, key 훅 모음 (useUserQueries.ts)
├── constants/              # 상수
│   └── routes.ts           # router name 상수 모음
├── layouts/                # 페이지 레이아웃 (Default, Empty)
├── pages/                  # 파일 기반 라우팅 (File-based Routing)
├── plugins/                # App Bootstrapping (Pinia, Router, Query 설정 분리)
├── stores/                 # Pinia 전역 스토어 (Client State)
├── types/                  # TypeScript 인터페이스 및 Zod 스키마
└── utils/                  # 순수 헬퍼 함수
```

## 🚀 Getting Started

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 빌드 및 배포

```bash
npm run build
```

### 4. 환경 변수 설정 (.env)

루트 경로에 `.env` 파일을 생성하고 API 주소를 설정하세요.

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_TITLE=My Vue App
```

---

## 📖 Architecture Guide

이 스타트킷은 **"설정보다는 관례(Convention over Configuration)"** 를 따릅니다.

### 1. API & Data Fetching (3-Layer Pattern)

데이터 흐름을 명확히 하기 위해 API 호출을 3단계로 분리합니다.

**Step 1: API 정의 (`src/api/modules/*.ts`) Named Export(개별 함수)** 형태로 정의하여 불필요한 코드가 번들에 포함되지 않도록 합니다.

```typescript
// src/api/modules/user.ts
export const fetchUsers = (page: number, status?: string) => {
  return request<User[]>('/users', {
    query: { page, status },
  })
}

export const createUser = (body) => {
  return request<User>('/users', {
    method: 'POST',
    body,
  })
}
```

**Step 2: Composable 생성 (`src/composables/queries/*.ts`)** **Query Key Factory Pattern**을 적용하여 키를 관리하고, TanStack Query 옵션을 캡슐화합니다.

```typescript
import { fetchUsers, createUser } from '@/api/modules/users'
import type { Ref } from 'vue'

// 1. Key Factory Pattern (배열 형태의 확장 가능한 키 구조)
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (page: Ref<number>, status?: Ref<string>) => [...userKeys.lists(), page, status] as const,
}

// 2. Query Hook (목록 조회)
export const useUserListQuery = (page: Ref<number>, status?: Ref<string>) => {
  return useQuery({
    queryKey: userKeys.list(page, status), // 반응형 변수가 변경되면 자동 재요청
    queryFn: () => fetchUsers(page.value, status?.value),
  })
}

// 3. Mutation Hook (생성)
export const useCreateUserMutation = () => {
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

```typescript
// src/components/UserList.vue - Children
<script setup lang="ts">
import { useUserListQuery } from '@/composables/queries/useUserQueries'

const page = ref(1)

// v-if="isLoading" 대신, 반환된 suspense() 함수를 await 합니다!
// 이를 통해 컴포넌트가 일시 정지(Suspend) 되며 부모에게 로딩 제어권이 넘어갑니다.
// 에러 처리를 위해 isError와 error 객체도 함께 가져옵니다.
const { data: users, suspense, isError, error } = useUserListQuery(page)

// [Component 에러 처리] 에러 발생 시 UI를 제어하기 위해 try-catch로 감쌉니다.
try {
  await suspense()
} catch (err) {
  console.error('컴포넌트 단 UI 에러 처리 수행')
}
</script>

<template>
  <!-- 에러 발생 시 보여줄 컴포넌트 UI 방어 코드 -->
  <div v-if="isError" class="text-red-500">
    에러가 발생했습니다: {{ error?.message }}
  </div>
  <!-- 안전하게 데이터를 즉시 그립니다. (isLoading 체킹 불필요) -->
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

```typescript
// src/pages/users/index.vue - Parent
<script setup lang="ts">
import UserList from '@/components/UserList.vue'
</script>

<template>
  <div>
    <h1>사용자 목록 관리</h1>

    <!-- 비동기 컴포넌트의 로딩 상태를 여기서 일괄 제어합니다. -->
    <Suspense>
      <template #default>
        <UserList />
      </template>

      <template #fallback>
        <div class="animate-pulse bg-gray-200 h-32 rounded">데이터를 불러오는 중...</div>
      </template>
    </Suspense>
  </div>
</template>
```

### 2. Authentication (Token Refresh)

`src/api/request.ts`에는 강력한 **토큰 갱신 로직**이 내장되어 있습니다.

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
