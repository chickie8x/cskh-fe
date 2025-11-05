<template>
  <div class="p-4 bg-gray-100 h-full dark:bg-background">
    <div class="flex items-center justify-between gap-2">
      <div class="flex flex-col gap-2">
        <span class="text-2xl font-bold">
          {{ t('ticketsManagement') }}
        </span>
        <span class="text-muted-foreground text-sm">
          {{ t('ticketsManagementDescription') }}
        </span>
      </div>
      <div>
        <Button
          :variant="showCreateTicket ? 'outline' : 'default'"
          @click="showCreateTicket = !showCreateTicket"
          class="min-w-28"
        >
          <PlusIcon v-if="!showCreateTicket" class="w-4 h-4" />
          <XIcon v-else class="w-4 h-4" />
          {{ showCreateTicket ? t('cancel') : t('createTicket') }}
        </Button>
      </div>
    </div>
    <!-- Create Ticket section -->
    <div
      class="mt-4 bg-white dark:bg-card shadow-sm rounded-md transition-all duration-300 overflow-hidden"
      :class="[showCreateTicket ? 'max-h-auto' : 'max-h-0']"
    >
      <div class="p-4 flex flex-col gap-1">
        <span class="text-xl font-bold text-indigo-500">{{ t('createTicket') }}</span>
        <span class="text-sm flex items-center text-orange-500"
          ><Info class="size-4 mr-1" />{{ t('enterOrderNumberHints') }}</span
        >
      </div>
      <div class="px-4 flex items-center gap-4">
        <Select v-model="selectTicketCategory">
          <SelectTrigger>
            <SelectValue :placeholder="t('selectTicketCategory')" class="w-48" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="category in TICKET_CATEGORY"
              :key="category.key"
              :value="category.value"
            >
              {{ t(category.key) }}
            </SelectItem>
          </SelectContent>
        </Select>
        <input
          type="text"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive max-w-72"
          :placeholder="t('enterTicketNote')"
          v-model="ticketNote"
        />
        <input
          type="text"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1"
          :placeholder="t('enterTrackingNumbers')"
          v-model="orderNumbers"
        />
        <Button variant="default" @click="doSearchOrder"
          ><Search class="size-4" />{{ t('searchOrder') }}</Button
        >
      </div>
      <div v-if="missingOrders.length > 0" class="p-4">
        <span class="font-medium">{{ t('missingOrders') }}</span>
        <ul class="list-disc">
          <li v-for="(order, idx) in missingOrders" :key="idx" class="flex items-center gap-4 p-2">
            <MissingOrder :order="order" @syncOrderCarrier="syncOrderCarrier" />
          </li>
        </ul>
      </div>
      <div v-if="searchOrders.length > 0" class="p-4">
        <span class="font-medium">{{ t('ticketItems') }}</span>
        <div>
          <div
            v-for="(order, idx) in searchOrders"
            :key="idx"
            class="flex items-center justify-between gap-2 p-2"
            :class="[idx % 2 === 0 ? 'bg-gray-100 dark:bg-background' : 'bg-white dark:bg-card']"
          >
            <input
              class="scale-125"
              type="checkbox"
              v-model="selectedOrders"
              :value="{ waybill: order.waybill, carrier: order.carrier }"
            />
            <span>{{ order.waybill }}</span>
            <span>{{ order.carrier }}</span>
            <span>{{ order.rawData.ORDER_STATUS }}</span>
            <span>{{ order.rawData.ORDER_STATUSDATE }}</span>
          </div>
        </div>
      </div>
      <div class="p-4 flex items-center justify-end gap-2">
        <Button @click="createTicket" class="min-w-28" variant="default"
          ><CircleCheck class="size-4" />{{ t('createTicket') }}</Button
        >
      </div>
    </div>
    <!-- General info section -->
    <div class="flex items-center justify-between gap-2 mt-4">
      <Card v-for="info in generalInfo" :key="info.key" class="w-64 border-transparent">
        <CardHeader>
          <CardTitle>
            {{ t(info.label) }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span>{{ info.value }}</span>
        </CardContent>
      </Card>
    </div>
    <div class="mt-4">
      <Table :tbHeader="TICKET_TABLE_HEADER" :data="tickets" :styling="tableStyling" @actionEdit="handleEdit" @actionDelete="handleDelete"/>
    </div>
    <Dialog
      :open="open"
      @close="open = false"
      title="Ticket"
      description="Chi tiết ticket"
      :btnSubmitShow="false"
      cancelText="close"
    >
      <template #content>
        <div class="text-sm">
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span>Ngày tạo</span>
            <span class="font-semibold">{{ formatDateTime(selectedTicket.createdAt) }}</span>
          </div>
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span>SLA</span>
            <span class="font-semibold">{{ formatDateTime(selectedTicket.slaDueAt) }}</span>
          </div>
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span>Mức độ ưu tiên</span>
            <span class="font-semibold">{{ selectedTicket.priority }}</span>
          </div>
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span>Khách hàng</span>
            <span class="font-semibold">{{ selectedTicket.ticketUser.name }}</span>
          </div>
          <div class="flex flex-col p-4 border-b border-border">
            <span>Vận đơn</span>
            <span class="font-semibold" v-for="item in selectedTicket.ticketItems" :key="item.id">{{ item.waybill }}({{ item.carrier }}),  </span>
          </div>
          <div v-if="selectedTicket.status" class="flex items-center justify-between p-4 border-b border-border">
            <span>Trạng thái {{ selectedTicket.status }}</span>
            <span>{{ t(BADGE_STATUS.find((item) => item.value === selectedTicket.status).label) }}</span>
          </div>
      </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { PlusIcon, XIcon, Info, Search, CircleCheck, RefreshCw } from 'lucide-vue-next'
import Table from '@/components/kits/table/index.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Dialog from '@/components/kits/dialog/index.vue'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select'
import {
  TICKET_TABLE_HEADER,
  BADGE_STATUS,
  TICKET_CATEGORY,
  BADGE_PRIORITY,
  CARRIERS,
} from '@/utils/config'
import api from '@/api/axios'
import { formatDateTime } from '@/utils/format'
import MissingOrder from '@/components/kits/missingOrder/index.vue'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const tickets = ref([])
const selectedTicket = ref(null)
const showCreateTicket = ref(false)
const selectTicketCategory = ref(null)
const orderNumbers = ref('')
const ticketNote = ref('')
const searchOrders = ref([])
const missingOrders = ref([])
const selectedOrders = ref([])
const open = ref(false)
const generalInfo = [
  {
    key: 'openTicket',
    label: 'openTicket',
    value: 0,
  },
  {
    key: 'processingTicket',
    label: 'processingTicket',
    value: 0,
  },
  {
    key: 'urgentTicket',
    label: 'urgentTicket',
    value: 0,
  },
  {
    key: 'resolveToday',
    label: 'resolveToday',
    value: 0,
  },
]

const orderCarriers = ref({})

const tableStyling = {
  category: {
    colName: 'category',
    classFn: (col) => {
      return 'font-bold'
    },
    valueFn: (col) => {
      return t(TICKET_CATEGORY.find((item) => item.value === col.category).key)
    },
  },
  slaDueAt: {
    colName: 'slaDueAt',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return formatDateTime(col.slaDueAt)
    },
  },
  createdAt: {
    colName: 'createdAt',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return formatDateTime(col.createdAt)
    },
  },
  status: {
    colName: 'status',
    classFn: (col) => {
      return BADGE_STATUS.find((item) => item.value === col.status).style
    },
    valueFn: (col) => {
      return t(BADGE_STATUS.find((item) => item.value === col.status).label)
    },
  },
  priority: {
    colName: 'priority',
    classFn: (col) => {
      return BADGE_PRIORITY.find((item) => item.value === col.priority).style
    },
    valueFn: (col) => {
      return t(BADGE_PRIORITY.find((item) => item.value === col.priority).label)
    },
  },
  ticketUser: {
    colName: 'ticketUser',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return col.ticketUser.name
    },
  },
}

const fetchTickets = async () => {
  try {
    const response = await api.get('/customer/tickets')
    tickets.value = response.data.data
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}

const doSearchOrder = async () => {
  if (!orderNumbers.value) {
    return
  }
  try {
    const response = await api.get('/common/orders', {
      params: {
        orderNumber: orderNumbers.value,
      },
    })
    searchOrders.value = response.data.data.orders
    missingOrders.value = response.data.data.missingOrders
  } catch (error) {
    console.error('Error fetching orders:', error)
  }
}

const createTicket = async () => {
  if (!selectedOrders.value.length) {
    toast.error(t('trackingNumbersRequiredForTicketCreation'))
    return
  }
  if (!selectTicketCategory.value) {
    toast.error(t('ticketCategoryRequiredForTicketCreation'))
    return
  }
  try {
    const response = await api.post('/customer/ticket/create', {
      category: selectTicketCategory.value,
      description: ticketNote.value,
      ticketItems: selectedOrders.value,
    })
    console.log(response.data)
    await fetchTickets()
    showCreateTicket.value = false
  } catch (error) {
    console.error('Error creating ticket:', error)
  }
}

const syncOrderCarrier = (order) => {
  const index = missingOrders.value.findIndex((item) => item === order.waybill)
  if (index > -1) {
    missingOrders.value.splice(index, 1)
  }
  searchOrders.value.push(order)
}

const handleEdit = (ticket) => {
  selectedTicket.value = ticket
  console.log(selectedTicket.value)
  open.value = true
}

const handleDelete = (ticket) => {
  toast.warning(t('notPermissionDeleteTicket'))
}

const handleUpdateTicket = async () => {
  try {
    const response = await api.put(`/customer/ticket/${selectedTicket.value.id}`, {
      status: selectedTicket.value.status,
    })
    console.log(response.data)
    await fetchTickets()
    open.value = false
  } catch (error) {
    console.error('Error updating ticket:', error)
  }
}

watch(missingOrders, () => {
  if (missingOrders.value.length > 0) {
    missingOrders.value.forEach((order) => {
      orderCarriers.value[order] = null
    })
  }
})

onMounted(() => {
  fetchTickets()
})
</script>
