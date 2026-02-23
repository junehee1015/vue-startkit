<template>
  <div class="space-y-12 max-w-5xl pb-32">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">API & Data Fetching 아키텍처</h2>

      <p class="mt-2 text-gray-600">
        본 스타트킷은 <strong>Ofetch</strong>와 <strong>TanStack Query</strong>가 최적의 상태로
        설정되어 있습니다.<br />
        <strong>Key Factory Pattern</strong>을 통해 캐시 키를 안전하게 관리하고 의존성을
        최소화합니다.
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
            <code>ref</code>, <code>useQuery</code> 등 라이브러리 코어 함수는 설정에 의해 자동으로
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
        <code>src/api/modules</code> 폴더에 도메인별 통신 함수를 만듭니다. 파라미터(Params/Query)를
        명시적으로 전달합니다.
      </p>

      <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
        <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
          <div class="flex gap-1.5 mr-4">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>

            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>

            <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span class="text-gray-400">src/api/modules/users.ts</span>
        </div>

        <pre
          class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
        ><code><span class="text-[#c586c0]">import</span> { <span class="text-[#9cdcfe]">request</span> } <span class="text-[#c586c0]">from</span> <span class="text-[#ce9178]">'@/api/request'</span>

<span class="text-[#6a9955]">// 파라미터를 받아 params 객체로 전달합니다 (URL 인코딩 자동 처리)</span>
<span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">fetchUsers</span> = (<span class="text-[#9cdcfe]">page</span>: <span class="text-[#4ec9b0]">number</span>, <span class="text-[#9cdcfe]">status</span>?: <span class="text-[#4ec9b0]">string</span>) <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#c586c0]">return</span> <span class="text-[#dcdcaa]">request</span>&lt;<span class="text-[#4ec9b0]">User</span>[]&gt;(<span class="text-[#ce9178]">'/users'</span>, {
    <span class="text-[#9cdcfe]">query</span>: { <span class="text-[#9cdcfe]">page</span>, <span class="text-[#9cdcfe]">status</span> }
  })
}

<span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">createUser</span> = (<span class="text-[#9cdcfe]">data</span>: <span class="text-[#4ec9b0]">Partial</span>&lt;<span class="text-[#4ec9b0]">User</span>&gt;) <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#c586c0]">return</span> <span class="text-[#dcdcaa]">request</span>&lt;<span class="text-[#4ec9b0]">User</span>&gt;(<span class="text-[#ce9178]">'/users'</span>, {
    <span class="text-[#9cdcfe]">method</span>: <span class="text-[#ce9178]">'POST'</span>,
    <span class="text-[#9cdcfe]">data</span>
  })
}</code></pre>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm"
          >STEP 2</span
        >

        <h3 class="text-xl font-bold text-gray-800">
          Query Hook & Key Factory (src/composables/queries)
        </h3>
      </div>

      <p class="text-gray-600 text-sm">
        API 호출을 감싸는 Custom Hook을 만듭니다. <strong>Key Factory Pattern</strong>을 적용하여
        캐시 키를 안전하게 관리합니다.
      </p>

      <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
        <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
          <div class="flex gap-1.5 mr-4">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>

            <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>

            <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span class="text-gray-400">src/composables/queries/useUserQueries.ts</span>
        </div>

        <pre
          class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
        ><code><span class="text-[#c586c0]">import</span> { <span class="text-[#9cdcfe]">fetchUsers</span>, <span class="text-[#9cdcfe]">createUser</span> } <span class="text-[#c586c0]">from</span> <span class="text-[#ce9178]">'@/api/modules/users'</span>
<span class="text-[#c586c0]">import</span> <span class="text-[#569cd6]">type</span> { <span class="text-[#4ec9b0]">Ref</span> } <span class="text-[#c586c0]">from</span> <span class="text-[#ce9178]">'vue'</span>

<span class="text-[#6a9955]">// 1. Key Factory Pattern (배열 형태의 확장 가능한 키 구조)</span>
<span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">userKeys</span> = {
  <span class="text-[#9cdcfe]">all</span>: [<span class="text-[#ce9178]">'users'</span>] <span class="text-[#569cd6]">as const</span>,
  <span class="text-[#dcdcaa]">lists</span>: () <span class="text-[#569cd6]">=&gt;</span> [...<span class="text-[#4fc1ff]">userKeys</span>.<span class="text-[#9cdcfe]">all</span>, <span class="text-[#ce9178]">'list'</span>] <span class="text-[#569cd6]">as const</span>,
  <span class="text-[#dcdcaa]">list</span>: (<span class="text-[#9cdcfe]">page</span>: <span class="text-[#4ec9b0]">Ref</span>&lt;<span class="text-[#4ec9b0]">number</span>&gt;, <span class="text-[#9cdcfe]">status</span>?: <span class="text-[#4ec9b0]">Ref</span>&lt;<span class="text-[#4ec9b0]">string</span>&gt;) <span class="text-[#569cd6]">=&gt;</span> [...<span class="text-[#4fc1ff]">userKeys</span>.<span class="text-[#dcdcaa]">lists</span>(), <span class="text-[#9cdcfe]">page</span>, <span class="text-[#9cdcfe]">status</span>] <span class="text-[#569cd6]">as const</span>,
}

<span class="text-[#6a9955]">// 2. Query Hook (목록 조회)</span>
<span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">useUserListQuery</span> = (<span class="text-[#9cdcfe]">page</span>: <span class="text-[#4ec9b0]">Ref</span>&lt;<span class="text-[#4ec9b0]">number</span>&gt;, <span class="text-[#9cdcfe]">status</span>?: <span class="text-[#4ec9b0]">Ref</span>&lt;<span class="text-[#4ec9b0]">string</span>&gt;) <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#c586c0]">return</span> <span class="text-[#dcdcaa]">useQuery</span>({
    <span class="text-[#9cdcfe]">queryKey</span>: <span class="text-[#4fc1ff]">userKeys</span>.<span class="text-[#dcdcaa]">list</span>(<span class="text-[#9cdcfe]">page</span>, <span class="text-[#9cdcfe]">status</span>), <span class="text-[#6a9955]">// 반응형 변수가 변경되면 자동 재요청</span>
    <span class="text-[#dcdcaa]">queryFn</span>: () <span class="text-[#569cd6]">=&gt;</span> <span class="text-[#dcdcaa]">fetchUsers</span>(<span class="text-[#9cdcfe]">page</span>.value, <span class="text-[#9cdcfe]">status</span>?.value),
  })
}

<span class="text-[#6a9955]">// 3. Mutation Hook (생성)</span>
<span class="text-[#c586c0]">export</span> <span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">useCreateUserMutation</span> = () <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">queryClient</span> = <span class="text-[#dcdcaa]">useQueryClient</span>()
  
  <span class="text-[#c586c0]">return</span> <span class="text-[#dcdcaa]">useMutation</span>({
    <span class="text-[#9cdcfe]">mutationFn</span>: <span class="text-[#dcdcaa]">createUser</span>,
    <span class="text-[#dcdcaa]">onSuccess</span>: () <span class="text-[#569cd6]">=&gt;</span> {
      <span class="text-[#6a9955]">// 생성 성공 시, 캐시를 무효화하여 목록 화면을 최신화합니다.</span>
      <span class="text-[#4fc1ff]">queryClient</span>.<span class="text-[#dcdcaa]">invalidateQueries</span>({ <span class="text-[#9cdcfe]">queryKey</span>: <span class="text-[#4fc1ff]">userKeys</span>.<span class="text-[#dcdcaa]">lists</span>() })
    },
    <span class="text-[#dcdcaa]">onError</span>: (<span class="text-[#9cdcfe]">error</span>) <span class="text-[#569cd6]">=&gt;</span> {
      <span class="text-[#6a9955]">// 에러 처리</span>
      <span class="text-[#9cdcfe]">console</span>.<span class="text-[#dcdcaa]">error</span>(<span class="text-[#ce9178]">'유저 생성 실패:'</span>, <span class="text-[#9cdcfe]">error</span>)
    }
  })
}</code></pre>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="bg-indigo-100 text-indigo-700 font-bold px-2 py-1 rounded text-sm"
          >STEP 3</span
        >

        <h3 class="text-xl font-bold text-gray-800">컴포넌트 사용 (Suspense & View Layer)</h3>
      </div>

      <p class="text-gray-600 text-sm">
        부모 컴포넌트에서 <code>&lt;Suspense&gt;</code>를 통해 로딩을 일괄 제어하고, 자식은
        <code>await suspense()</code>를 호출하여 데이터를 즉시 그립니다.
      </p>

      <div class="grid grid-cols-1 gap-6">
        <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
          <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
            <span class="text-gray-400 font-bold">Child Component</span>
            <span class="text-gray-500 ml-2">| src/components/UserList.vue</span>
          </div>

          <pre
            v-pre
            class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
          ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">script</span> <span class="text-[#9cdcfe]">setup</span> <span class="text-[#9cdcfe]">lang</span>=<span class="text-[#ce9178]">"ts"</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#c586c0]">import</span> { <span class="text-[#9cdcfe]">useUserListQuery</span> } <span class="text-[#c586c0]">from</span> <span class="text-[#ce9178]">'@/composables/queries/useUserQueries'</span>

<span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">page</span> = <span class="text-[#dcdcaa]">ref</span>(<span class="text-[#b5cea8]">1</span>)

<span class="text-[#6a9955]">// v-if="isLoading" 대신, 반환된 suspense() 함수를 await 합니다!</span>
<span class="text-[#6a9955]">// 이를 통해 컴포넌트가 일시 정지(Suspend) 되며 부모에게 로딩 제어권이 넘어갑니다.</span>
<span class="text-[#6a9955]">// 에러 처리를 위해 isError와 error 객체도 함께 가져옵니다.</span>
<span class="text-[#569cd6]">const</span> { <span class="text-[#9cdcfe]">data</span>: <span class="text-[#4fc1ff]">users</span>, <span class="text-[#4fc1ff]">suspense</span>, <span class="text-[#4fc1ff]">isError</span>, <span class="text-[#4fc1ff]">error</span> } = <span class="text-[#dcdcaa]">useUserListQuery</span>(<span class="text-[#4fc1ff]">page</span>)

<span class="text-[#6a9955]">// [Component 에러 처리] 에러 발생 시 UI를 제어하기 위해 try-catch로 감쌉니다.</span>
<span class="text-[#c586c0]">try</span> {
  <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">suspense</span>()
} <span class="text-[#c586c0]">catch</span> (<span class="text-[#9cdcfe]">err</span>) {
  <span class="text-[#9cdcfe]">console</span>.<span class="text-[#dcdcaa]">error</span>(<span class="text-[#ce9178]">'컴포넌트 단 UI 에러 처리 수행'</span>)
}
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">script</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#6a9955]">&lt;!-- 🚨 에러 발생 시 보여줄 컴포넌트 UI 방어 코드 --&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">v-if</span>=<span class="text-[#ce9178]">"isError"</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"text-red-500"</span><span class="text-[#808080]">&gt;</span>
    에러가 발생했습니다: {{ error?.message }}
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#6a9955]">&lt;!-- 안전하게 데이터를 즉시 그립니다. (isLoading 체킹 불필요) --&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">ul</span> <span class="text-[#9cdcfe]">v-else</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">li</span> <span class="text-[#9cdcfe]">v-for</span>=<span class="text-[#ce9178]">"user in users"</span> <span class="text-[#9cdcfe]">:key</span>=<span class="text-[#ce9178]">"user.id"</span><span class="text-[#808080]">&gt;</span>{{ user.name }}<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">li</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">ul</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span></code></pre>
        </div>

        <div class="bg-[#1e1e1e] rounded-lg shadow-xl border border-gray-800 font-mono text-sm">
          <div class="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
            <span class="text-gray-400 font-bold">Parent Page</span>
            <span class="text-gray-500 ml-2">| src/pages/users/index.vue</span>
          </div>

          <pre
            class="p-4 overflow-x-auto leading-relaxed text-[#d4d4d4]"
          ><code><span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">script</span> <span class="text-[#9cdcfe]">setup</span> <span class="text-[#9cdcfe]">lang</span>=<span class="text-[#ce9178]">"ts"</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#c586c0]">import</span> <span class="text-[#9cdcfe]">UserList</span> <span class="text-[#c586c0]">from</span> <span class="text-[#ce9178]">'@/components/UserList.vue'</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">script</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">h1</span><span class="text-[#808080]">&gt;</span>사용자 목록 관리<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">h1</span><span class="text-[#808080]">&gt;</span>
    
    <span class="text-[#6a9955]">&lt;!-- 비동기 컴포넌트의 로딩 상태를 여기서 일괄 제어합니다. --&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">Suspense</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> <span class="text-[#9cdcfe]">#default</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">UserList</span> <span class="text-[#808080]">/&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>

      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> <span class="text-[#9cdcfe]">#fallback</span><span class="text-[#808080]">&gt;</span>
        <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"animate-pulse bg-gray-200 h-32 rounded"</span><span class="text-[#808080]">&gt;</span>데이터를 불러오는 중...<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">Suspense</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span></code></pre>
        </div>
      </div>
    </section>
  </div>
</template>
