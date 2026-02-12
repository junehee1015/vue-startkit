<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Settings, LogOut, MoreHorizontal, Bell } from 'lucide-vue-next'
import { useConfirm } from '@/composables/useConfirm'

// --- 1. Form State ---
const form = reactive({
  email: '',
  username: '',
  description: '',
  role: '',
  notifications: false,
  marketing: true,
})

const roleOptions = [
  { label: '관리자 (Admin)', value: 'admin' },
  { label: '매니저 (Manager)', value: 'manager' },
  { label: '일반 사용자 (User)', value: 'user' },
  { label: '게스트 (Guest)', value: 'guest', disabled: true },
]

// --- 2. Dialog State ---
const isDialogOpen = ref(false)

// --- 3. Confirm Dialog ---
const handleConfirmTest = async () => {
  const result = await useConfirm({
    title: '정말 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.',
    confirmText: '삭제하기',
    variant: 'danger',
  })

  if (result) alert('삭제되었습니다!')
}

// --- 4. Table Data ---
const tablePage = ref(1)
const tableColumns = [
  { key: 'name', label: '이름', class: 'w-[150px]' },
  { key: 'email', label: '이메일' },
  { key: 'role', label: '권한', class: 'w-[100px]' },
  { key: 'status', label: '상태' },
]

const tableData = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 2 === 0 ? 'Admin' : 'User',
  status: i % 3 === 0 ? 'inactive' : 'active',
}))

// --- 5. Dropdown Items ---
const dropdownItems = [
  { label: '프로필', icon: User, onClick: () => alert('Profile') },
  { label: '설정', icon: Settings },
  { separator: true },
  { label: '로그아웃', icon: LogOut, danger: true, onClick: () => alert('Logout') },
]

// --- 6. Tabs Demo ---
const tabItems = [
  { label: '계정 설정', value: 'account' },
  { label: '비밀번호 변경', value: 'password' },
]
const currentTabDemo = ref('account')

// --- Utils: Scroll ---
const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const headerOffset = 100
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="flex gap-12 relative items-start">
    <div class="flex-1 space-y-24 min-w-0 pb-32">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">공통 컴포넌트 가이드</h2>
        <p class="mt-3 text-lg text-gray-600 leading-relaxed">
          프로젝트의 디자인 시스템을 구성하는 Atomic 컴포넌트 모음입니다.<br />
          아래 예시(Preview)와 코드(Usage)를 참고하여 개발에 활용하세요.
        </p>
      </div>

      <section id="actions" class="space-y-6 scroll-mt-24">
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">Actions</h3>
          <p class="text-gray-500 mt-1">버튼 및 사용자 인터랙션 요소입니다.</p>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-4">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Preview</h4>
            <div class="flex flex-wrap gap-3 items-center">
              <BaseButton>Primary</BaseButton>
              <BaseButton variant="secondary">Secondary</BaseButton>
              <BaseButton variant="outline">Outline</BaseButton>
              <BaseButton variant="ghost">Ghost</BaseButton>
              <BaseButton variant="danger">Danger</BaseButton>
              <div class="w-px h-8 bg-gray-200 mx-2"></div>
              <BaseButton loading>Loading</BaseButton>
              <BaseButton disabled>Disabled</BaseButton>
              <BaseButton to="/login" variant="outline">Link</BaseButton>
            </div>
          </div>

          <div class="bg-gray-900 rounded-xl overflow-hidden text-sm shadow-lg">
            <div
              class="px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-400 text-xs font-mono"
            >
              Usage
            </div>
            <pre
              class="p-4 overflow-x-auto text-gray-300 font-mono leading-relaxed"
            ><code>&lt;!-- Variants --&gt;
&lt;BaseButton&gt;저장&lt;/BaseButton&gt;
&lt;BaseButton <span class="text-blue-400">variant</span>="outline"&gt;취소&lt;/BaseButton&gt;
&lt;BaseButton <span class="text-red-400">variant</span>="danger"&gt;삭제&lt;/BaseButton&gt;

&lt;!-- States --&gt;
&lt;BaseButton <span class="text-purple-400">loading</span>&gt;로딩 중...&lt;/BaseButton&gt;
&lt;BaseButton <span class="text-purple-400">disabled</span>&gt;비활성화&lt;/BaseButton&gt;

&lt;!-- As Link (Router) --&gt;
&lt;BaseButton <span class="text-green-400">to</span>="/login"&gt;로그인으로 이동&lt;/BaseButton&gt;</code></pre>
          </div>
        </div>
      </section>

      <section id="forms" class="space-y-6 scroll-mt-24">
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">Form Inputs</h3>
          <p class="text-gray-500 mt-1">입력 폼을 구성하는 다양한 요소입니다.</p>
        </div>

        <div class="space-y-4">
          <div class="space-y-6 p-6 border rounded-xl bg-white">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Preview</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseFormField label="이메일" required>
                <BaseInput v-model="form.email" placeholder="example@email.com" />
              </BaseFormField>

              <BaseFormField label="사용자 역할">
                <BaseSelect v-model="form.role" :options="roleOptions" />
              </BaseFormField>
            </div>

            <BaseFormField label="자기소개" help="최대 100자까지 입력 가능합니다.">
              <BaseTextarea v-model="form.description" placeholder="내용을 입력하세요" />
            </BaseFormField>

            <div class="space-y-3 pt-2">
              <div class="flex items-center gap-2">
                <BaseCheckbox id="noti-check" v-model:checked="form.notifications" />
                <BaseLabel for="noti-check" class="cursor-pointer">알림 받기</BaseLabel>
              </div>
              <div class="flex items-center gap-2">
                <BaseSwitch id="marketing-switch" v-model:checked="form.marketing" />
                <BaseLabel for="marketing-switch" class="cursor-pointer"
                  >마케팅 정보 수신</BaseLabel
                >
              </div>
            </div>
          </div>

          <div class="bg-gray-900 rounded-xl overflow-hidden text-sm shadow-lg h-fit">
            <div
              class="px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-400 text-xs font-mono"
            >
              Usage
            </div>
            <pre
              class="p-4 overflow-x-auto text-gray-300 font-mono leading-relaxed"
            ><code>&lt;!-- 1. Input Group --&gt;
&lt;BaseFormField 
  <span class="text-blue-400">label</span>="Email" 
  <span class="text-blue-400">required</span> 
  <span class="text-blue-400">error-message</span>="error"
&gt;
  &lt;BaseInput <span class="text-green-400">v-model</span>="form.email" /&gt;
&lt;/BaseFormField&gt;

&lt;!-- 2. Select --&gt;
&lt;BaseSelect 
  <span class="text-green-400">v-model</span>="form.role" 
  <span class="text-purple-400">:options</span>="[
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' }
  ]" 
/&gt;

&lt;!-- 3. Checkbox & Switch --&gt;
&lt;div class="flex items-center gap-2"&gt;
  &lt;BaseSwitch 
    <span class="text-blue-400">id</span>="marketing" 
    <span class="text-green-400">v-model:checked</span>="form.marketing" 
  /&gt;
  &lt;BaseLabel <span class="text-blue-400">for</span>="marketing"&gt;수신 동의&lt;/BaseLabel&gt;
&lt;/div&gt;</code></pre>
          </div>
        </div>
      </section>

      <section id="layout" class="space-y-6 scroll-mt-24">
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Layout & Containers
          </h3>
          <p class="text-gray-500 mt-1">콘텐츠를 구조화하는 카드와 탭 컴포넌트입니다.</p>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-4">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Preview</h4>

            <BaseTabs v-model="currentTabDemo" :items="tabItems">
              <template #content-account>
                <BaseCard title="계정 정보" description="정보를 수정합니다." class="mt-4">
                  <div class="space-y-4">
                    <BaseFormField label="닉네임"><BaseInput /></BaseFormField>
                  </div>
                  <template #footer>
                    <BaseButton>저장하기</BaseButton>
                  </template>
                </BaseCard>
              </template>
              <template #content-password>
                <div class="p-4 text-gray-500">비밀번호 탭 내용...</div>
              </template>
            </BaseTabs>
          </div>

          <div class="bg-gray-900 rounded-xl overflow-hidden text-sm shadow-lg h-fit">
            <div
              class="px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-400 text-xs font-mono"
            >
              Usage
            </div>
            <pre
              class="p-4 overflow-x-auto text-gray-300 font-mono leading-relaxed"
            ><code>&lt;!-- Tabs --&gt;
&lt;BaseTabs <span class="text-green-400">v-model</span>="currentTab" <span class="text-purple-400">:items</span>="items"&gt;
  
  <span class="text-gray-500">&lt;!-- 슬롯 이름: content-{value} --&gt;</span>
  &lt;template <span class="text-blue-400">#content-account</span>&gt;
    
    &lt;!-- Card --&gt;
    &lt;BaseCard 
      <span class="text-blue-400">title</span>="계정 정보" 
      <span class="text-blue-400">description</span>="..."
    &gt;
      &lt;div&gt;Content...&lt;/div&gt;
      
      &lt;template <span class="text-blue-400">#footer</span>&gt;
        &lt;BaseButton&gt;Save&lt;/BaseButton&gt;
      &lt;/template&gt;
    &lt;/BaseCard&gt;

  &lt;/template&gt;
&lt;/BaseTabs&gt;</code></pre>
          </div>
        </div>
      </section>

      <section id="data" class="space-y-6 scroll-mt-24">
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">Data Display</h3>
          <p class="text-gray-500 mt-1">테이블, 배지, 드롭다운 등 데이터 시각화 요소입니다.</p>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-6">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Preview</h4>

            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <BaseBadge>Default</BaseBadge>
                <BaseBadge variant="success">Success</BaseBadge>
                <BaseBadge variant="warning">Warning</BaseBadge>
                <BaseBadge variant="destructive">Destructive</BaseBadge>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <h4 class="font-bold text-sm">User List</h4>
                <BaseDropdown :items="dropdownItems">
                  <BaseButton variant="outline" size="sm">
                    Options <MoreHorizontal class="ml-2 w-4 h-4" />
                  </BaseButton>
                </BaseDropdown>
              </div>

              <BaseTable
                :columns="tableColumns"
                :data="tableData"
                :total="50"
                v-model:page="tablePage"
                row-key="id"
              >
                <template #cell-status="{ value }">
                  <BaseBadge :variant="value === 'active' ? 'success' : 'secondary'">
                    {{ value === 'active' ? 'Active' : 'Inactive' }}
                  </BaseBadge>
                </template>
              </BaseTable>
            </div>
          </div>

          <div class="bg-gray-900 rounded-xl overflow-hidden text-sm shadow-lg h-fit">
            <div
              class="px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-400 text-xs font-mono"
            >
              Usage
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto text-gray-300 font-mono leading-relaxed"
            ><code>&lt;!-- Badge --&gt;
&lt;BaseBadge <span class="text-blue-400">variant</span>="success"&gt;Active&lt;/BaseBadge&gt;

&lt;!-- Dropdown --&gt;
&lt;BaseDropdown <span class="text-purple-400">:items</span>="items"&gt;
  &lt;BaseButton&gt;Menu&lt;/BaseButton&gt;
&lt;/BaseDropdown&gt;

&lt;!-- Table with Custom Slot --&gt;
&lt;BaseTable 
  <span class="text-purple-400">:columns</span>="columns" 
  <span class="text-purple-400">:data</span>="data"
  <span class="text-blue-400">row-key</span>="id"
&gt;
  <span class="text-gray-500">&lt;!-- 커스텀 셀: cell-{key} --&gt;</span>
  &lt;template <span class="text-blue-400">#cell-status</span>="{ value }"&gt;
    &lt;BaseBadge&gt;{{ value }}&lt;/BaseBadge&gt;
  &lt;/template&gt;
&lt;/BaseTable&gt;</code></pre>
          </div>
        </div>
      </section>

      <section id="feedback" class="space-y-6 scroll-mt-24">
        <div class="border-b pb-4">
          <h3 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Feedback & Overlays
          </h3>
          <p class="text-gray-500 mt-1">사용자 피드백을 위한 모달과 알림 요소입니다.</p>
        </div>

        <div class="space-y-4">
          <div class="p-6 border rounded-xl bg-white space-y-4">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider">Preview</h4>
            <div class="flex flex-wrap gap-4">
              <BaseButton @click="isDialogOpen = true" variant="outline">Open Dialog</BaseButton>
              <BaseButton @click="handleConfirmTest" variant="danger">Confirm Hook</BaseButton>

              <BaseTooltip content="알림 설정으로 이동합니다">
                <BaseButton variant="ghost" size="sm"><Bell class="w-5 h-5" /></BaseButton>
              </BaseTooltip>
            </div>

            <BaseDialog v-model:open="isDialogOpen" title="제목" description="설명 텍스트입니다.">
              <p class="text-sm text-gray-600 py-4">모달 컨텐츠 영역</p>
              <template #footer>
                <BaseButton @click="isDialogOpen = false">Close</BaseButton>
              </template>
            </BaseDialog>
          </div>

          <div class="bg-gray-900 rounded-xl overflow-hidden text-sm shadow-lg h-fit">
            <div
              class="px-4 py-2 bg-gray-800 border-b border-gray-700 text-gray-400 text-xs font-mono"
            >
              Usage
            </div>
            <pre
              class="p-4 overflow-x-auto text-gray-300 font-mono leading-relaxed"
            ><code>&lt;!-- 1. Dialog --&gt;
&lt;BaseDialog 
  <span class="text-green-400">v-model:open</span>="isOpen" 
  <span class="text-blue-400">title</span>="제목"
&gt;
  &lt;div&gt;Content...&lt;/div&gt;
  &lt;template <span class="text-blue-400">#footer</span>&gt;
    &lt;BaseButton&gt;Close&lt;/BaseButton&gt;
  &lt;/template&gt;
&lt;/BaseDialog&gt;

&lt;!-- 2. Tooltip --&gt;
&lt;BaseTooltip <span class="text-blue-400">content</span>="설명"&gt;
  &lt;BaseButton&gt;Hover Me&lt;/BaseButton&gt;
&lt;/BaseTooltip&gt;

&lt;!-- 3. Confirm Hook (Script) --&gt;
const result = await <span class="text-yellow-400">useConfirm</span>({
  title: '삭제하시겠습니까?',
  variant: 'danger'
})</code></pre>
          </div>
        </div>
      </section>
    </div>

    <aside class="hidden 2xl:block w-64 shrink-0">
      <div class="sticky top-24">
        <h4 class="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4 px-4">Contents</h4>
        <nav class="space-y-1">
          <button
            v-for="item in ['actions', 'forms', 'layout', 'data', 'feedback']"
            :key="item"
            @click="scrollTo(item)"
            class="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors capitalize"
          >
            {{ item }}
          </button>
        </nav>
      </div>
    </aside>
  </div>
</template>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
