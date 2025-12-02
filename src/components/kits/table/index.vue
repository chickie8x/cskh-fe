<template>
  <div>
    <div v-if="data.length === 0" class="flex items-center justify-center gap-2 p-4 text-red-500">
      <CircleAlert class="w-4 h-4" />
      <span>{{ t('noData') }}</span>
    </div>
    <Table v-else class="w-full border border-border">
      <TableHeader class="bg-gray-200 dark:bg-gray-800">
        <TableRow class="divide-x divide-gray-300 dark:divide-gray-700">
          <TableHead v-for="header in tbHeader" :key="header.key" class="font-bold uppercase">{{
            header.label
          }}</TableHead>
          <TableHead v-if="actionCol" class="font-bold uppercase">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="item in data"
          :key="item.id"
          class="divide-x divide-gray-200 dark:divide-gray-700"
        >
          <TableCell
            v-for="header in tbHeader"
            :key="header.key"
            class="text-gray-600 dark:text-gray-400 px-4 py-2 max-w-[200px] break-words whitespace-normal"
          >
            <span
              @click="
                styling[header.key]?.actionColFn
                  ? handleColAction($event, item, styling[header.key].actionColFn)
                  : ''
              "
              :class="
                styling[header.key]?.colName === header.key ? styling[header.key].classFn(item) : ''
              "
              >{{ styling[header.key]?.valueFn(item) || item[header.key] }}</span
            >
          </TableCell>
          <TableCell v-if="actionCol" class="flex items-center gap-2">
            <Pencil
              @click="handleEdit($event, item)"
              class="w-6 h-6 opacity-60 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-400 rounded-sm p-1"
            />
            <Trash2
              @click="handleDelete($event, item)"
              class="w-6 h-6 text-red-500 opacity-60 hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-red-100 border border-red-500 rounded-sm p-1"
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<script setup>
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { CircleAlert, Pencil, Trash2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  tbHeader: {
    type: Array,
    required: true,
    default: () => [],
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  styling: {
    type: Object,
    default: () => ({}),
  },
  actionCol: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['actionEdit', 'actionDelete', 'colAction'])

const handleDelete = async (e, row) => {
  e.stopPropagation()
  emits('actionDelete', row)
}

const handleEdit = (e, row) => {
  e.stopPropagation()
  emits('actionEdit', row)
}

const handleColAction = (e, row, actionFn) => {
  e.stopPropagation()
  emits('colAction', row, actionFn)
}
</script>
