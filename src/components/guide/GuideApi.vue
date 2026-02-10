<script setup lang="ts"></script>

<template>
  <div class="space-y-12 max-w-5xl">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">API & Data Fetching</h2>
      <p class="mt-2 text-gray-600">
        본 스타트킷은 <strong>Ofetch</strong>와 <strong>TanStack Query</strong>가 최적의 상태로
        설정되어 있습니다.<br />
        전역 설정을 통해 중복 코드를 최소화하고 일관성 있는 데이터 관리를 수행합니다.
      </p>
    </div>

    <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
      <div class="flex">
        <div class="shrink-0">
          <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-blue-700">
            <strong>Auto Import 알림:</strong><br />
            아래 예시 코드에는 <code>import</code> 구문이 생략되어 있습니다. <br />
            <code>ref</code>, <code>useQuery</code>, <code>request</code> 등은 설정에 의해 자동으로
            주입됩니다.
          </p>
        </div>
      </div>
    </div>

    <section class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm"
          >STEP 1</span
        >
        <h3 class="text-xl font-bold text-gray-800">API 함수 정의 (Api Layer)</h3>
      </div>
      <p class="text-gray-600 text-sm">
        <code>src/api/modules</code> 폴더에 도메인별로 파일을 생성합니다. 객체로 묶어서 export 하면
        네임스페이스 관리가 용이합니다.
      </p>

      <div class="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-xl border border-gray-800">
        <div
          class="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-800"
        >
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span class="text-xs text-gray-400 font-mono">src/api/modules/user.ts</span>
          <div class="w-10"></div>
        </div>
        <div class="p-4 overflow-x-auto">
          <pre
            v-pre
            class="text-sm font-mono leading-relaxed text-gray-300"
          ><code><span class="text-purple-400">export</span> <span class="text-blue-400">const</span> <span class="text-blue-300">userApi</span> = {
  <span class="text-yellow-200">get</span>: <span class="text-yellow-400">()</span> <span class="text-blue-400">=></span> <span class="text-yellow-200">request</span>&lt;<span class="text-emerald-300">User[]</span>&gt;(<span class="text-orange-300">'/users'</span>),
  <span class="text-yellow-200">create</span>: <span class="text-yellow-400">(</span><span class="text-blue-300">data</span><span class="text-yellow-400">)</span> <span class="text-blue-400">=></span> <span class="text-yellow-200">request</span>(<span class="text-orange-300">'/users'</span>, { 
    method: <span class="text-orange-300">'POST'</span>, 
    body: <span class="text-blue-300">data</span> 
  })
}</code></pre>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm"
          >STEP 2</span
        >
        <h3 class="text-xl font-bold text-gray-800">Composable 생성 (Query Layer)</h3>
      </div>
      <p class="text-gray-600 text-sm">
        API 호출을 감싸는 Custom Hook을 만듭니다. <code>queryKey</code>를 한곳에서 관리하는 것이
        좋습니다.
      </p>

      <div class="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-xl border border-gray-800">
        <div
          class="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-800"
        >
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span class="text-xs text-gray-400 font-mono">src/composables/useUserQueries.ts</span>
          <div class="w-10"></div>
        </div>
        <div class="p-4 overflow-x-auto">
          <pre
            v-pre
            class="text-sm font-mono leading-relaxed text-gray-300"
          ><code><span class="text-blue-400">const</span> <span class="text-blue-300">QUERY_KEYS</span> = { users: [<span class="text-orange-300">'users'</span>] }

<span class="text-gray-500">// 1. 목록 조회 (전역 설정 사용 -> 옵션 생략 가능)</span>
<span class="text-purple-400">export</span> <span class="text-blue-400">const</span> <span class="text-yellow-200">useUserListQuery</span> = <span class="text-yellow-400">()</span> <span class="text-blue-400">=></span> {
  <span class="text-purple-400">return</span> <span class="text-yellow-200">useQuery</span>({
    queryKey: <span class="text-blue-300">QUERY_KEYS</span>.users,
    queryFn: <span class="text-blue-300">userApi</span>.get,
    <span class="text-gray-500">// staleTime: 60000 (Global Default 적용됨)</span>
  })
}

<span class="text-gray-500">// 2. 생성 (Mutation)</span>
<span class="text-purple-400">export</span> <span class="text-blue-400">const</span> <span class="text-yellow-200">useCreateUserMutation</span> = <span class="text-yellow-400">()</span> <span class="text-blue-400">=></span> {
  <span class="text-blue-400">const</span> <span class="text-blue-300">queryClient</span> = <span class="text-yellow-200">useQueryClient</span>()
  
  <span class="text-purple-400">return</span> <span class="text-yellow-200">useMutation</span>({
    mutationFn: <span class="text-blue-300">userApi</span>.create,
    <span class="text-yellow-200">onSuccess</span>: <span class="text-yellow-400">()</span> <span class="text-blue-400">=></span> {
      <span class="text-gray-500">// 목록 갱신</span>
      <span class="text-blue-300">queryClient</span>.<span class="text-yellow-200">invalidateQueries</span>({ queryKey: <span class="text-blue-300">QUERY_KEYS</span>.users })
    }
  })
}</code></pre>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm"
          >STEP 3</span
        >
        <h3 class="text-xl font-bold text-gray-800">컴포넌트 사용 (View Layer)</h3>
      </div>
      <p class="text-gray-600 text-sm">
        컴포넌트에서는 데이터의 출처나 캐싱 로직을 알 필요 없이, 데이터만 받아와서 그립니다.
      </p>

      <div class="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-xl border border-gray-800">
        <div
          class="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-800"
        >
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span class="text-xs text-gray-400 font-mono">src/pages/users/index.vue</span>
          <div class="w-10"></div>
        </div>
        <div class="p-4 overflow-x-auto">
          <pre
            v-pre
            class="text-sm font-mono leading-relaxed text-gray-300"
          ><code><span class="text-blue-400">const</span> { <span class="text-blue-300">data</span>: <span class="text-blue-300">users</span>, <span class="text-blue-300">isLoading</span> } = <span class="text-yellow-200">useUserListQuery</span>()

&lt;<span class="text-blue-400">template</span>&gt;
  &lt;<span class="text-emerald-300">div</span> <span class="text-purple-400">v-if</span>=<span class="text-orange-300">"isLoading"</span>&gt;Loading...&lt;/<span class="text-emerald-300">div</span>&gt;
  &lt;<span class="text-emerald-300">ul</span> <span class="text-purple-400">v-else</span>&gt;
    &lt;<span class="text-emerald-300">li</span> <span class="text-purple-400">v-for</span>=<span class="text-orange-300">"user in users"</span> <span class="text-blue-400">:key</span>=<span class="text-orange-300">"user.id"</span>&gt;
      {{ user.name }}
    &lt;/<span class="text-emerald-300">li</span>&gt;
  &lt;/<span class="text-emerald-300">ul</span>&gt;
&lt;/<span class="text-blue-400">template</span>&gt;</code></pre>
        </div>
      </div>
    </section>
  </div>
</template>
