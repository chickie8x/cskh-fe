<template>
  <table class="text-sm border border-border w-full relative border-separate border-spacing-0">
    <thead>
      <tr class="border-b border-border divide-x divide-border">
        <th
          class="min-w-25 whitespace-nowrap px-4 py-2 sticky left-0 z-20 bg-gray-300 dark:bg-background border-r border-b border-border sticky-fix"
        >
          {{ t('colState') }}
        </th>
        <th
          class="min-w-25 whitespace-nowrap px-4 py-2 sticky left-25 z-20 bg-gray-300 dark:bg-background border-r border-b border-border sticky-fix"
        >
          {{ t('colTotalMoney') }}
        </th>
        <th
          class="min-w-50 whitespace-nowrap px-4 py-2 sticky left-50 z-20 bg-gray-300 dark:bg-background border-r border-b border-border sticky-fix"
        >
          {{ t('colService') }}
        </th>
        <th
          class="whitespace-nowrap px-4 py-2 bg-gray-200 dark:bg-background border-b border-border"
        >
          STT
        </th>
        <th
          v-for="header in tbHeaders"
          :key="header.key"
          class="whitespace-nowrap px-4 py-2 bg-gray-200 dark:bg-background border-b border-border"
        >
          {{ header.label }}
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(row, idx) in data"
        :key="idx"
        class="border-b border-border divide-x divide-border"
      >
        <td
          class="sticky left-0 z-10 bg-gray-200 dark:bg-background border-r border-b border-border sticky-fix font-bold text-center"
          :class="[
            row.VERIFY_STATE === 'VERIFIED_FAILURE' || row.VERIFY_STATE === 'CREATED_FAILURE'
              ? 'text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-400'
              : '',
            row.VERIFY_STATE === 'CREATED'
              ? 'text-green-500 bg-green-200 dark:bg-green-900 dark:text-green-400'
              : '',
          ]"
        >
          {{ row.VERIFY_STATE ? stateMap[row.VERIFY_STATE] : stateMap['PENDING'] }}
        </td>
        <td
          class="sticky left-25 z-10 bg-gray-200 dark:bg-background border-r border-b border-border sticky-fix font-bold text-center"
          :class="[
            row.VERIFY_STATE === 'VERIFIED_FAILURE' || row.VERIFY_STATE === 'CREATED_FAILURE'
              ? 'text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-400'
              : '',
            row.VERIFY_STATE === 'CREATED'
              ? 'text-green-500 bg-green-200 dark:bg-green-900 dark:text-green-400'
              : '',
          ]"
        >
          {{ row.MONEY_TOTAL ? formatCurrency(row.MONEY_TOTAL) : '' }}
        </td>
        <td
          class="sticky left-50 z-10 bg-gray-200 dark:bg-background px-2 border-r border-b border-border sticky-fix text-center"
        >
          <select
            v-model="services[idx]"
            @change="handleChangeService(idx, $event)"
            class="px-2 py-1 border border-border bg-white dark:bg-background rounded-md block min-w-40 mx-auto"
          >
            <option
              v-for="service in row.AVAILABLE_SERVICES"
              :key="service.id"
              :value="service.MA_DV_CHINH"
            >
              {{ `${service.MA_DV_CHINH} - ${service.TEN_DICHVU}` }}
            </option>
          </select>
        </td>
        <td class="px-4 py-2 border-b border-border text-center">{{ idx + 1 }}</td>
        <td
          v-for="header in tbHeaders"
          :key="header.key"
          class="px-4 py-2 border-b border-border"
          :class="[header.key === 'RECEIVER_ADDRESS' ? 'min-w-80' : '']"
        >
          {{ row[header.label] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { formatCurrency } from '@/utils/format'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { watch, ref } from 'vue'

const { t } = useI18n()

const props = defineProps({
  data: Array,
  tbHeaders: Array,
})
console.log(props.data)

const emits = defineEmits(['updateService'])

const stateMap = {
  PENDING: 'Chưa có dịch vụ',
  VERIFIED: 'Chọn dịch vụ',
  VERIFIED_FAILURE: 'Đơn không hợp lệ',
  CREATED: 'Tạo đơn thành công',
  CREATED_FAILURE: 'Tạo đơn thất bại',
}

const services = ref(props.data.map((item) => item.MA_DV_CHINH))

function handleChangeService(idx, event) {
  emits('updateService', idx, event.target.value)
}
</script>
