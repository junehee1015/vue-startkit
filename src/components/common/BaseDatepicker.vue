<script setup lang="ts">
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
} from 'reka-ui'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { parseDate, type DateValue } from '@internationalized/date'
import dayjs from 'dayjs'
import { cn } from '@/utils/cn'

interface Props {
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '날짜 선택',
})

const modelValue = defineModel<string>({ default: '' })
const isOpen = ref(false)

const calendarValue = computed({
  get: () => (modelValue.value ? parseDate(modelValue.value) : undefined),
  set: (val: DateValue | undefined) => {
    modelValue.value = val ? val.toString() : ''
    isOpen.value = false // 선택 시 팝업 닫기
  },
})

const displayDate = computed(() => {
  return modelValue.value ? dayjs(modelValue.value).format('YYYY년 MM월 DD일') : ''
})
</script>

<template>
  <PopoverRoot v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        :class="
          cn(
            'flex h-10 w-full items-center justify-start rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
            !modelValue && 'text-gray-500',
            props.class,
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4 shrink-0 text-gray-500" />
        {{ modelValue ? displayDate : placeholder }}
      </button>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        align="start"
        :side-offset="4"
        class="z-50 w-auto rounded-md border border-gray-200 bg-white p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
      >
        <CalendarRoot v-model="calendarValue" v-slot="{ grid, weekDays }">
          <CalendarHeader class="flex items-center justify-between pb-4">
            <CalendarPrev
              class="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ChevronLeft class="h-4 w-4" />
            </CalendarPrev>
            <CalendarHeading class="text-sm font-semibold text-gray-900" />
            <CalendarNext
              class="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-700"
            >
              <ChevronRight class="h-4 w-4" />
            </CalendarNext>
          </CalendarHeader>

          <div class="flex flex-col space-y-4 pt-2">
            <CalendarGrid
              v-for="month in grid"
              :key="month.value.toString()"
              class="w-full border-collapse space-y-1"
            >
              <CalendarGridHead>
                <CalendarGridRow class="flex w-full justify-between mb-2">
                  <CalendarHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="w-9 rounded-md text-[0.8rem] font-medium text-gray-500"
                  >
                    {{ day }}
                  </CalendarHeadCell>
                </CalendarGridRow>
              </CalendarGridHead>
              <CalendarGridBody>
                <CalendarGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="`weekDate-${index}`"
                  class="flex w-full justify-between mt-1"
                >
                  <CalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                    class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20"
                  >
                    <CalendarCellTrigger
                      :day="weekDate"
                      :month="month.value"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 data-selected:bg-blue-600 data-selected:font-medium data-selected:text-white data-selected:hover:bg-blue-600 data-outside-view:text-gray-300 data-disabled:text-gray-300 data-disabled:opacity-50"
                    />
                  </CalendarCell>
                </CalendarGridRow>
              </CalendarGridBody>
            </CalendarGrid>
          </div>
        </CalendarRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
