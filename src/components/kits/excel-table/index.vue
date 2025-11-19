<template>
  <table class="text-sm border border-border w-full relative border-separate border-spacing-0">
    <thead>
      <tr class="border-b border-border divide-x divide-border">
        <th
          class="min-w-25 whitespace-nowrap px-4 py-2 sticky left-0 z-20 bg-gray-300 dark:bg-gray-800 border-r border-b border-border sticky-fix"
        >
          {{ t('colState') }}
        </th>
        <th
          class="min-w-25 whitespace-nowrap px-4 py-2 sticky left-[100px] z-20 bg-gray-300 dark:bg-gray-800 border-r border-b border-border sticky-fix"
        >
          {{ t('colTotalMoney') }}
        </th>
        <th class="whitespace-nowrap px-4 py-2 bg-gray-200 dark:bg-gray-800">STT</th>
        <th
          v-for="header in tbHeaders"
          :key="header.key"
          class="whitespace-nowrap px-4 py-2 bg-gray-200 dark:bg-gray-800"
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
          class="sticky left-0 z-10 bg-gray-200 border-r border-b border-border sticky-fix font-bold text-center"
          :class="[
            row.VERIFY_STATE === 'SUCCESS'
              ? 'text-blue-500 bg-blue-200 dark:bg-blue-900 dark:text-blue-400'
              : '',
            row.VERIFY_STATE === 'FAILED' || row.VERIFY_STATE === 'CREATED_FAILURE'
              ? 'text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-400'
              : '',
            row.VERIFY_STATE === 'CREATED'
              ? 'text-green-500 bg-green-200 dark:bg-green-900 dark:text-green-400'
              : '',
          ]"
        >
          {{ row.VERIFY_STATE ? row.VERIFY_STATE : '' }}
        </td>
        <td
          class="sticky left-[100px] z-10 bg-gray-200 border-r border-b border-border sticky-fix font-bold text-center"
          :class="[
            row.VERIFY_STATE === 'SUCCESS'
              ? 'text-blue-500 bg-blue-200 dark:bg-blue-900 dark:text-blue-400'
              : '',
            row.VERIFY_STATE === 'FAILED' || row.VERIFY_STATE === 'CREATED_FAILURE'
              ? 'text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-400'
              : '',
            row.VERIFY_STATE === 'CREATED'
              ? 'text-green-500 bg-green-200 dark:bg-green-900 dark:text-green-400'
              : '',
          ]"
        >
          {{ row.TOTAL_MONEY ? formatCurrency(row.TOTAL_MONEY) : '' }}
        </td>
        <td class="px-4 py-2 border-b border-border text-center">{{ idx + 1 }}</td>
        <td v-for="header in tbHeaders" :key="header.key" class="px-4 py-2 border-b border-border">
          {{ row[header.key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { formatCurrency } from '@/utils/format'

const { t } = useI18n()

defineProps({
  data: Array,
  tbHeaders: Array,
})
</script>
