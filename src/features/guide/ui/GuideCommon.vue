<script setup lang="ts">
import { User, Settings, LogOut, MoreHorizontal, Bell } from 'lucide-vue-next'
import dayjs from 'dayjs'

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

// Datepicker State
const singleDate = ref(dayjs().format('YYYY-MM-DD'))

const rangeDate = ref({
  start: dayjs().format('YYYY-MM-DD'),
  end: dayjs().add(7, 'day').format('YYYY-MM-DD'),
})

// --- 2. Dialog State ---
const isDialogOpen = ref(false)

// --- 3. Confirm & Alert Hook State ---
const handleConfirmTest = async () => {
  const result = await useConfirm({
    title: '정말 삭제하시겠습니까?',
    description: '이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.',
    confirmText: '삭제',
    cancelText: '취소',
    variant: 'danger',
  })

  if (result) {
    toast.success('성공적으로 삭제되었습니다.')
  } else {
    toast('삭제가 취소되었습니다.')
  }
}

const handleAlertTest = async () => {
  await useAlert({
    title: '세션 만료 안내',
    description: '안전한 환경을 위해 로그아웃 되었습니다. 다시 로그인해 주세요.',
    confirmText: '확인',
  })
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
  status: i % 3 === 0 ? 'active' : 'inactive',
}))

// --- 5. Dropdown Items ---
const dropdownItems = [
  { label: '프로필', icon: User, onClick: () => toast('Profile') },
  { label: '설정', icon: Settings },
  { separator: true },
  { label: '로그아웃', icon: LogOut, danger: true, onClick: () => handleConfirmTest() },
]

// --- 6. Layout Demo (Tabs & Accordion) ---
const tabItems = [
  { label: '계정 설정', value: 'account' },
  { label: '비밀번호 변경', value: 'password' },
]
const currentTabDemo = ref('account')

const accordionItems = [
  {
    value: 'item-1',
    title: 'Startkit의 장점은 무엇인가요?',
    content: 'Vue 3, Reka UI, Tailwind CSS를 활용해 빠르고 일관된 개발이 가능합니다.',
  },
  {
    value: 'item-2',
    title: '디자인 시스템 커스텀이 가능한가요?',
    content: '네, 모든 Base 컴포넌트는 cn 유틸리티를 통해 쉽게 스타일을 덮어쓸 수 있습니다.',
  },
]
const accordionValue = ref('item-1')

// --- 7. Pagination State ---
const paginationPage = ref(1)

// --- 8. Toast Demo ---
const handleToast = (type: 'default' | 'success' | 'error' | 'action') => {
  if (type === 'default') {
    toast('기본 토스트 알림입니다.')
  } else if (type === 'success') {
    toast.success('성공적으로 저장되었습니다.')
  } else if (type === 'error') {
    toast.error('요청 처리 중 오류가 발생했습니다.')
  } else if (type === 'action') {
    toast('데이터가 삭제되었습니다.', {
      action: {
        label: '실행 취소',
        onClick: () => toast.success('실행이 취소되었습니다.'),
      },
    })
  }
}

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

          <div class="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm shadow-lg">
            <div
              class="px-4 py-2 bg-[#2d2d2d] border-b border-[#3c3c3c] text-[#cccccc] text-xs font-mono"
            >
              Usage
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto text-[#d4d4d4] bg-[#1e1e1e] font-mono leading-relaxed tracking-wide"
            ><code><span class="text-[#6a9955]">&lt;!-- Variants --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">저장</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span> <span class="text-[#9cdcfe]">variant</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"outline"</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">취소</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span> <span class="text-[#9cdcfe]">variant</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"danger"</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">삭제</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- States --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span> <span class="text-[#9cdcfe]">loading</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">로딩 중...</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span> <span class="text-[#9cdcfe]">disabled</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">비활성화</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- As Link (Router) --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span> <span class="text-[#9cdcfe]">to</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"/login"</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">로그인으로 이동</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span></code></pre>
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
                <BaseCheckbox id="noti-check" v-model="form.notifications" />
                <BaseLabel for="noti-check" class="cursor-pointer">알림 받기</BaseLabel>
              </div>
              <div class="flex items-center gap-2">
                <BaseSwitch id="marketing-switch" v-model="form.marketing" />
                <BaseLabel for="marketing-switch" class="cursor-pointer"
                  >마케팅 정보 수신</BaseLabel
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 mt-6 border-t border-gray-100">
              <BaseFormField label="날짜 선택 (단일)">
                <BaseDatepicker v-model="singleDate" mode="single" />
              </BaseFormField>

              <BaseFormField label="기간 선택 (Range)">
                <BaseDatepicker v-model:range="rangeDate" mode="range" />
              </BaseFormField>
            </div>
          </div>

          <div class="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm shadow-lg h-fit">
            <div
              class="px-4 py-2 bg-[#2d2d2d] border-b border-[#3c3c3c] text-[#cccccc] text-xs font-mono"
            >
              Usage
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto text-[#d4d4d4] bg-[#1e1e1e] font-mono leading-relaxed tracking-wide"
            ><code><span class="text-[#6a9955]">&lt;!-- 1. Input Group --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseFormField</span> 
  <span class="text-[#9cdcfe]">label</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"Email"</span> 
  <span class="text-[#9cdcfe]">required</span> 
  <span class="text-[#9cdcfe]">error-message</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"error"</span>
<span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseInput</span> <span class="text-[#9cdcfe]">v-model</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">form</span><span class="text-[#d4d4d4]">.</span><span class="text-[#9cdcfe]">email</span>" <span class="text-[#808080]">/&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseFormField</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- 2. Select --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseSelect</span> 
  <span class="text-[#9cdcfe]">v-model</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">form</span><span class="text-[#d4d4d4]">.</span><span class="text-[#9cdcfe]">role</span>"
  :<span class="text-[#9cdcfe]">options</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#d4d4d4]">[</span>
    <span class="text-[#d4d4d4]">{</span> <span class="text-[#9cdcfe]">label</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'Admin'</span><span class="text-[#d4d4d4]">,</span> <span class="text-[#9cdcfe]">value</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'admin'</span> <span class="text-[#d4d4d4]">},</span>
    <span class="text-[#d4d4d4]">{</span> <span class="text-[#9cdcfe]">label</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'User'</span><span class="text-[#d4d4d4]">,</span> <span class="text-[#9cdcfe]">value</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'user'</span> <span class="text-[#d4d4d4]">}</span>
  <span class="text-[#d4d4d4]">]</span><span class="text-[#ce9178]">"</span> 
<span class="text-[#808080]">/&gt;</span>

<span class="text-[#6a9955]">&lt;!-- 3. Datepicker --&gt;</span>
<span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">singleDate</span> <span class="text-[#d4d4d4]">=</span> <span class="text-[#dcdcaa]">ref</span><span class="text-[#d4d4d4]">(</span><span class="text-[#dcdcaa]">dayjs</span><span class="text-[#d4d4d4]">().</span><span class="text-[#dcdcaa]">format</span><span class="text-[#d4d4d4]">(</span><span class="text-[#ce9178]">'YYYY-MM-DD'</span><span class="text-[#d4d4d4]">))</span>
<span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">rangeDate</span> <span class="text-[#d4d4d4]">=</span> <span class="text-[#dcdcaa]">ref</span><span class="text-[#d4d4d4]">({</span>
  <span class="text-[#9cdcfe]">start</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#dcdcaa]">dayjs</span><span class="text-[#d4d4d4]">().</span><span class="text-[#dcdcaa]">format</span><span class="text-[#d4d4d4]">(</span><span class="text-[#ce9178]">'YYYY-MM-DD'</span><span class="text-[#d4d4d4]">),</span>
  <span class="text-[#9cdcfe]">end</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#dcdcaa]">dayjs</span><span class="text-[#d4d4d4]">().</span><span class="text-[#dcdcaa]">add</span><span class="text-[#d4d4d4]">(</span><span class="text-[#b5cea8]">7</span><span class="text-[#d4d4d4]">,</span> <span class="text-[#ce9178]">'day'</span><span class="text-[#d4d4d4]">).</span><span class="text-[#dcdcaa]">format</span><span class="text-[#d4d4d4]">(</span><span class="text-[#ce9178]">'YYYY-MM-DD'</span><span class="text-[#d4d4d4]">),</span>
<span class="text-[#d4d4d4]">})</span>

<span class="text-[#6a9955]">&lt;!-- Single --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseFormField</span> <span class="text-[#9cdcfe]">label</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"날짜 선택 (단일)"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseDatepicker</span> <span class="text-[#9cdcfe]">v-model</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">singleDate</span>" <span class="text-[#9cdcfe]">mode</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"single"</span> <span class="text-[#808080]">/&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseFormField</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- Range --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseFormField</span> <span class="text-[#9cdcfe]">label</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"기간 선택 (Range)"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseDatepicker</span> <span class="text-[#9cdcfe]">v-model:range</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">rangeDate</span>" <span class="text-[#9cdcfe]">mode</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"range"</span> <span class="text-[#808080]">/&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseFormField</span><span class="text-[#808080]">&gt;</span></code></pre>
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

            <div class="space-y-4 pt-6 mt-6 border-t border-gray-100">
              <h4 class="font-bold text-sm">Accordion</h4>
              <BaseAccordion v-model="accordionValue" :items="accordionItems">
                <template #content-item-2="{ item }">
                  <div class="bg-blue-50 p-3 rounded text-blue-800">
                    {{ item.content }} <br />
                    <span class="text-xs font-semibold mt-1 inline-block">* 슬롯 커스텀 예시</span>
                  </div>
                </template>
              </BaseAccordion>
            </div>
          </div>

          <div class="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm shadow-lg h-fit">
            <div
              class="px-4 py-2 bg-[#2d2d2d] border-b border-[#3c3c3c] text-[#cccccc] text-xs font-mono"
            >
              Usage
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto text-[#d4d4d4] bg-[#1e1e1e] font-mono leading-relaxed tracking-wide"
            ><code><span class="text-[#6a9955]">&lt;!-- 1. Tabs & Card --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseTabs</span> <span class="text-[#9cdcfe]">v-model</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">currentTab</span>" :<span class="text-[#9cdcfe]">items</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">items</span>"<span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> <span class="text-[#9cdcfe]">#content-account</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseCard</span> <span class="text-[#9cdcfe]">title</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"제목"</span><span class="text-[#808080]">&gt;</span>
      <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">Content...</span><span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseCard</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseTabs</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- 2. Accordion --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseAccordion</span> 
  <span class="text-[#9cdcfe]">v-model</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">accordionValue</span>" 
  <span class="text-[#9cdcfe]">:items</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">accordionItems</span>"
<span class="text-[#808080]">&gt;</span>
  <span class="text-[#6a9955]">&lt;!-- 특정 항목 슬롯 커스텀 (옵션) --&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> <span class="text-[#9cdcfe]">#content-item-2</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#d4d4d4]">{ </span><span class="text-[#9cdcfe]">item</span><span class="text-[#d4d4d4]"> }</span>"<span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">{{</span> <span class="text-[#9cdcfe]">item</span><span class="text-[#d4d4d4]">.</span><span class="text-[#9cdcfe]">content</span> <span class="text-[#d4d4d4]">}}</span><span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseAccordion</span><span class="text-[#808080]">&gt;</span></code></pre>
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

            <div class="space-y-4 pt-6 mt-6 border-t border-gray-100">
              <h4 class="font-bold text-sm">Pagination</h4>
              <BasePagination
                v-model:page="paginationPage"
                :total="120"
                :items-per-page="10"
                show-edges
              />
            </div>
          </div>

          <div class="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm shadow-lg h-fit">
            <div
              class="px-4 py-2 bg-[#2d2d2d] border-b border-[#3c3c3c] text-[#cccccc] text-xs font-mono"
            >
              Usage
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto text-[#d4d4d4] bg-[#1e1e1e] font-mono leading-relaxed tracking-wide"
            ><code><span class="text-[#6a9955]">&lt;!-- Badge --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseBadge</span> <span class="text-[#9cdcfe]">variant</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"success"</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">Active</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseBadge</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- Dropdown --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseDropdown</span> :<span class="text-[#9cdcfe]">items</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">items</span>"<span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">Menu</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseDropdown</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- Table with Custom Slot --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseTable</span> 
  :<span class="text-[#9cdcfe]">columns</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">columns</span>" 
  :<span class="text-[#9cdcfe]">data</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">data</span>"
  <span class="text-[#9cdcfe]">row-key</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"id"</span>
<span class="text-[#808080]">&gt;</span>
  <span class="text-[#6a9955]">&lt;!-- 커스텀 셀: cell-{key} --&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> <span class="text-[#9cdcfe]">#cell-status</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#d4d4d4]">{ </span><span class="text-[#9cdcfe]">value</span><span class="text-[#d4d4d4]"> }</span>"<span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseBadge</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">{{</span> <span class="text-[#9cdcfe]">value</span> <span class="text-[#d4d4d4]">}}</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseBadge</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseTable</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- Pagination --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BasePagination</span> 
  <span class="text-[#9cdcfe]">v-model</span>:<span class="text-[#9cdcfe]">page</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">page</span>"
  :<span class="text-[#9cdcfe]">total</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#b5cea8]">120</span>"
  :<span class="text-[#9cdcfe]">items-per-page</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#b5cea8]">10</span>"
  <span class="text-[#9cdcfe]">show-edges</span>
<span class="text-[#808080]">/&gt;</span></code></pre>
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
            <div class="flex flex-wrap gap-4 items-center">
              <BaseButton @click="isDialogOpen = true" variant="outline">Open Dialog</BaseButton>
              <BaseButton @click="handleConfirmTest" variant="danger">Confirm Hook</BaseButton>
              <BaseButton @click="handleAlertTest" variant="secondary">Alert Hook</BaseButton>

              <BaseTooltip content="알림 설정으로 이동합니다">
                <BaseButton variant="ghost" size="sm"><Bell class="w-5 h-5" /></BaseButton>
              </BaseTooltip>
            </div>

            <div class="space-y-4 pt-6 mt-6 border-t border-gray-100">
              <h4 class="font-bold text-sm">Toast (vue-sonner)</h4>
              <div class="flex flex-wrap gap-4">
                <BaseButton @click="handleToast('default')" variant="outline"
                  >Default Toast</BaseButton
                >
                <BaseButton @click="handleToast('success')" variant="outline"
                  >Success Toast</BaseButton
                >
                <BaseButton @click="handleToast('error')" variant="danger">Error Toast</BaseButton>
                <BaseButton @click="handleToast('action')" variant="secondary"
                  >Action Toast</BaseButton
                >
              </div>
            </div>

            <BaseDialog v-model:open="isDialogOpen" title="제목" description="설명 텍스트입니다.">
              <p class="text-sm text-gray-600 py-4">모달 컨텐츠 영역</p>
              <template #footer>
                <BaseButton @click="isDialogOpen = false">Close</BaseButton>
              </template>
            </BaseDialog>
          </div>

          <div class="bg-[#1e1e1e] rounded-xl overflow-hidden text-sm shadow-lg h-fit">
            <div
              class="px-4 py-2 bg-[#2d2d2d] border-b border-[#3c3c3c] text-[#cccccc] text-xs font-mono"
            >
              Usage
            </div>
            <pre
              v-pre
              class="p-4 overflow-x-auto text-[#d4d4d4] bg-[#1e1e1e] font-mono leading-relaxed tracking-wide"
            ><code><span class="text-[#6a9955]">&lt;!-- 1. Dialog --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseDialog</span> 
  <span class="text-[#9cdcfe]">v-model</span>:<span class="text-[#9cdcfe]">open</span><span class="text-[#d4d4d4]">=</span>"<span class="text-[#9cdcfe]">isOpen</span>" 
  <span class="text-[#9cdcfe]">title</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"제목"</span>
<span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">Content...</span><span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">div</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#569cd6]">template</span> <span class="text-[#9cdcfe]">#footer</span><span class="text-[#808080]">&gt;</span>
    <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">Close</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;/</span><span class="text-[#569cd6]">template</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseDialog</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- 2. Tooltip --&gt;</span>
<span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseTooltip</span> <span class="text-[#9cdcfe]">content</span><span class="text-[#d4d4d4]">=</span><span class="text-[#ce9178]">"설명"</span><span class="text-[#808080]">&gt;</span>
  <span class="text-[#808080]">&lt;</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span><span class="text-[#d4d4d4]">Hover Me</span><span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseButton</span><span class="text-[#808080]">&gt;</span>
<span class="text-[#808080]">&lt;/</span><span class="text-[#4ec9b0]">BaseTooltip</span><span class="text-[#808080]">&gt;</span>

<span class="text-[#6a9955]">&lt;!-- 3. Confirm Hook & Alert Hook (Script) --&gt;</span>
<span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">handleDelete</span> <span class="text-[#d4d4d4]">=</span> <span class="text-[#569cd6]">async</span> <span class="text-[#d4d4d4]">()</span> <span class="text-[#569cd6]">=&gt;</span> <span class="text-[#d4d4d4]">{</span>
  <span class="text-[#569cd6]">const</span> <span class="text-[#4fc1ff]">isConfirmed</span> <span class="text-[#d4d4d4]">=</span> <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">useConfirm</span><span class="text-[#d4d4d4]">({</span>
    <span class="text-[#9cdcfe]">title</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'삭제하시겠습니까?'</span><span class="text-[#d4d4d4]">,</span>
    <span class="text-[#9cdcfe]">description</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'이 작업은 되돌릴 수 없습니다.'</span><span class="text-[#d4d4d4]">,</span>
    <span class="text-[#9cdcfe]">confirmText</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'삭제'</span><span class="text-[#d4d4d4]">,</span>
    <span class="text-[#9cdcfe]">variant</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'danger'</span>
  <span class="text-[#d4d4d4]">})</span>
  <span class="text-[#c586c0]">if</span> <span class="text-[#d4d4d4]">(</span><span class="text-[#4fc1ff]">isConfirmed</span><span class="text-[#d4d4d4]">) {</span> <span class="text-[#6a9955]">/* 승인 로직 */</span> <span class="text-[#d4d4d4]">}</span>
<span class="text-[#d4d4d4]">}</span>

<span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">showNotice</span> <span class="text-[#d4d4d4]">=</span> <span class="text-[#569cd6]">async</span> <span class="text-[#d4d4d4]">()</span> <span class="text-[#569cd6]">=&gt;</span> <span class="text-[#d4d4d4]">{</span>
  <span class="text-[#c586c0]">await</span> <span class="text-[#dcdcaa]">useAlert</span><span class="text-[#d4d4d4]">({</span>
    <span class="text-[#9cdcfe]">title</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'안내'</span><span class="text-[#d4d4d4]">,</span>
    <span class="text-[#9cdcfe]">description</span><span class="text-[#d4d4d4]">:</span> <span class="text-[#ce9178]">'세션이 만료되었습니다.'</span><span class="text-[#d4d4d4]">,</span>
  <span class="text-[#d4d4d4]">})</span>
<span class="text-[#d4d4d4]">}</span>

<span class="text-[#6a9955]">&lt;!-- 4. Toast (vue-sonner) --&gt;</span>
<span class="text-[#c586c0]">import</span> <span class="text-[#d4d4d4]">{</span> <span class="text-[#9cdcfe]">toast</span> <span class="text-[#d4d4d4]">}</span> <span class="text-[#c586c0]">from</span> <span class="text-[#ce9178]">'vue-sonner'</span>

<span class="text-[#dcdcaa]">toast</span><span class="text-[#d4d4d4]">.</span><span class="text-[#dcdcaa]">success</span><span class="text-[#d4d4d4]">(</span><span class="text-[#ce9178]">'성공적으로 저장되었습니다.'</span><span class="text-[#d4d4d4]">)</span>
<span class="text-[#dcdcaa]">toast</span><span class="text-[#d4d4d4]">.</span><span class="text-[#dcdcaa]">error</span><span class="text-[#d4d4d4]">(</span><span class="text-[#ce9178]">'오류가 발생했습니다.'</span><span class="text-[#d4d4d4]">)</span></code></pre>
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
