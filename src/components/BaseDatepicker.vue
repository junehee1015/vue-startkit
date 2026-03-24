<script setup lang="ts">
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
  CalendarRoot,
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  RangeCalendarRoot,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNext,
  RangeCalendarPrev,
} from 'reka-ui'
import { parseDate } from '@internationalized/date'
import type { DateValue } from '@internationalized/date'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-vue-next'

type StringRange = { start: string | undefined; end: string | undefined }
type DateValueRange = { start: DateValue | undefined; end: DateValue | undefined }

const { mode = 'single', placeholder = '날짜를 선택하세요' } = defineProps<{
  mode?: 'single' | 'range'
  placeholder?: string
}>()

const singleModel = defineModel<string | undefined>('modelValue')
const rangeModel = defineModel<StringRange | undefined>('range')

const safeParseDate = (dateStr?: string): DateValue | undefined => {
  if (!dateStr) return undefined
  try {
    return parseDate(dateStr)
  } catch {
    return undefined
  }
}

const internalSingleValue = computed({
  get: () => safeParseDate(singleModel.value),
  set: (val: DateValue | undefined) => {
    singleModel.value = val ? val.toString() : undefined
  },
})

const internalRangeValue = computed({
  get: () => {
    return {
      start: safeParseDate(rangeModel.value?.start),
      end: safeParseDate(rangeModel.value?.end),
    }
  },
  set: (val: DateValueRange | undefined) => {
    if (!val) {
      rangeModel.value = undefined
      return
    }
    rangeModel.value = {
      start: val.start ? val.start.toString() : undefined,
      end: val.end ? val.end.toString() : undefined,
    }
  },
})

const displayValue = computed(() => {
  if (mode === 'single' && singleModel.value) {
    return singleModel.value
  }
  if (mode === 'range' && rangeModel.value?.start) {
    const endStr = rangeModel.value.end ? rangeModel.value.end : ''
    return `${rangeModel.value.start} ~ ${endStr}`
  }
  return placeholder
})
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      class="flex items-center gap-2 w-full justify-start text-left border border-gray-300 bg-white px-3 py-2 text-sm rounded-md shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
      :class="
        (mode === 'single' && !singleModel) || (mode === 'range' && !rangeModel?.start)
          ? 'text-gray-500'
          : 'text-gray-900'
      "
    >
      <CalendarIcon class="w-4 h-4 opacity-70" />
      <span>{{ displayValue }}</span>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        class="bg-white p-4 rounded-xl shadow-xl border border-gray-100 z-50 animate-in fade-in zoom-in-95"
      >
        <CalendarRoot
          v-if="mode === 'single'"
          v-model="internalSingleValue"
          v-slot="{ grid, weekDays }"
        >
          <CalendarHeader class="flex items-center justify-between pb-3">
            <CalendarPrev
              class="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronLeft class="w-4 h-4" />
            </CalendarPrev>
            <CalendarHeading class="text-sm font-semibold text-gray-900" />
            <CalendarNext
              class="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronRight class="w-4 h-4" />
            </CalendarNext>
          </CalendarHeader>

          <CalendarGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="w-full border-collapse"
          >
            <CalendarGridHead>
              <CalendarGridRow class="flex mb-2">
                <CalendarHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="w-9 font-medium text-[0.8rem] text-gray-500 text-center"
                >
                  {{ day }}
                </CalendarHeadCell>
              </CalendarGridRow>
            </CalendarGridHead>
            <CalendarGridBody>
              <CalendarGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="flex w-full mt-1"
              >
                <CalendarCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                  class="relative p-0 text-center w-9 h-9"
                >
                  <CalendarCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="w-9 h-9 text-sm font-normal rounded-md inline-flex items-center justify-center transition-colors hover:bg-gray-100 data-selected:bg-gray-900 data-selected:text-white data-selected:font-medium data-selected:hover:bg-gray-800 data-outside-view:text-gray-300 data-outside-view:pointer-events-none"
                  />
                </CalendarCell>
              </CalendarGridRow>
            </CalendarGridBody>
          </CalendarGrid>
        </CalendarRoot>

        <RangeCalendarRoot
          v-else-if="mode === 'range'"
          v-model="internalRangeValue"
          v-slot="{ grid, weekDays }"
        >
          <RangeCalendarHeader class="flex items-center justify-between pb-3">
            <RangeCalendarPrev
              class="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronLeft class="w-4 h-4" />
            </RangeCalendarPrev>
            <RangeCalendarHeading class="text-sm font-semibold text-gray-900" />
            <RangeCalendarNext
              class="inline-flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <ChevronRight class="w-4 h-4" />
            </RangeCalendarNext>
          </RangeCalendarHeader>

          <RangeCalendarGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="w-full border-collapse"
          >
            <RangeCalendarGridHead>
              <RangeCalendarGridRow class="flex mb-2">
                <RangeCalendarHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="w-9 font-medium text-[0.8rem] text-gray-500 text-center"
                >
                  {{ day }}
                </RangeCalendarHeadCell>
              </RangeCalendarGridRow>
            </RangeCalendarGridHead>
            <RangeCalendarGridBody>
              <RangeCalendarGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="flex w-full mt-1"
              >
                <RangeCalendarCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                  class="relative p-0 text-center w-9 h-9"
                >
                  <RangeCalendarCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="w-9 h-9 text-sm font-normal inline-flex items-center justify-center transition-colors hover:bg-gray-100 data-selected:bg-gray-100 data-selected:text-gray-900 data-selection-start:bg-gray-900 data-selection-start:text-white data-selection-start:rounded-l-md data-selection-start:hover:bg-gray-800 data-selection-end:bg-gray-900 data-selection-end:text-white data-selection-end:rounded-r-md data-selection-end:hover:bg-gray-800 data-outside-view:text-gray-300 data-outside-view:pointer-events-none"
                  />
                </RangeCalendarCell>
              </RangeCalendarGridRow>
            </RangeCalendarGridBody>
          </RangeCalendarGrid>
        </RangeCalendarRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
