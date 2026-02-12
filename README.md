# 🚀 Vue Startkit

실무 수준의 **확장성(Scalability)** 과 **유지보수성(Maintainability)** 을 최우선으로 고려한 Vue 3 프로젝트 템플릿입니다.  
최신 Vue 생태계의 Best Practice가 적용되어 있으며, 복잡한 초기 설정 없이 바로 비즈니스 로직 개발에 집중할 수 있습니다.

## ✨ Key Features

- **Architecture**:
  - **FSD Lite**: 도메인 주도 설계를 위한 API 모듈화 및 Composable 패턴
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
| **UI Primitive**   | [Radix Vue](https://www.radix-vue.com/)                                         | Unstyled, Accessible Components           |
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
│   └── guide/              # (개발 가이드용 컴포넌트 - 배포 시 제외 가능)
├── composables/            # 재사용 가능한 로직
│   └── queries/            # TanStack Query 훅 모음 (useUserQueries.ts)
│       └── keys/           # TanStack Query key 모음 (userKeys.ts)
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
export const getUsers = () => {
  return request<User[]>('/users')
}

export const createUser = (data) => {
  return request<User>('/users', {
    method: 'POST',
    body: data,
  })
}
```

**Step 2: Composable 생성 (`src/composables/queries/*.ts`)** **Query Key Factory Pattern**을 적용하여 키를 관리하고, TanStack Query 옵션을 캡슐화합니다.

```typescript
// src/composables/queries/useUserQueries.ts
const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
}

export const useUserListQuery = () => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: getUsers,
  })
}
```

**Step 3: 컴포넌트 사용 (`src/pages/*.vue`)** 컴포넌트는 비즈니스 로직 없이 데이터 바인딩에만 집중합니다.

```typescript
// src/pages/users/index.vue
const { data: users, isLoading } = useUserListQuery()
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
- **Validation**: `useForm`, `z`(Zod)
- **Project**: `./src/composables/**`, `./src/plugins/**`, `./src/stores/**`, `./src/utils/** `,

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
