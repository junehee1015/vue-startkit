<script setup lang="ts">
import { computed } from 'vue'
import { User, Settings, LogOut } from 'lucide-vue-next'
import type { DropdownItem } from '../common/BaseDropdown.vue'
import { toast } from 'vue-sonner'

const route = useRoute()
const authStore = useAuthStore()

const breadcrumbs = computed(() => {
  return route.matched
    .filter((r) => r.meta?.breadcrumb) // breadcrumb 메타가 있는 것만 필터링
    .map((r) => ({
      label: r.meta.breadcrumb as string,
      to: r.path !== route.path ? r.path : undefined, // 현재 페이지가 아니면 링크 부여
    }))
})

const userMenuItems: DropdownItem[] = [
  { label: '프로필', icon: User, onClick: () => alert('Profile') },
  { label: '설정', icon: Settings },
  { separator: true },
  { label: '로그아웃', icon: LogOut, danger: true, onClick: () => logout() },
]

const logout = async () => {
  const isConfirmed = await useConfirm({
    title: '로그아웃 하시겠습니까?',
    cancelText: '취소',
    confirmText: '확인',
  })

  if (!isConfirmed) return

  authStore.logout()

  toast.error('로그아웃 되었습니다.')
}
</script>

<template>
  <header
    class="h-14 border-b bg-white flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-20"
  >
    <div>
      <BaseBreadcrumb :items="breadcrumbs" />
    </div>

    <div class="flex items-center gap-4">
      <BaseDropdown :items="userMenuItems" label="내 계정">
        <button
          type="button"
          class="flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors cursor-pointer outline-none hover:bg-gray-100 data-[state=open]:bg-gray-100 w-auto min-w-32 text-left flex-nowrap"
        >
          <div
            class="h-8 w-8 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs"
          >
            JS
          </div>

          <div class="flex flex-col text-left">
            <span class="text-sm text-gray-700 font-medium leading-none">Juny Jo</span>
            <span class="text-[10px] text-gray-400 leading-none mt-0.5">Admin</span>
          </div>
        </button>
      </BaseDropdown>
    </div>
  </header>
</template>
