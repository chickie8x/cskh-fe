<template>
  <div class="flex flex-col h-full overflow-auto bg-gray-100 dark:bg-background p-4 gap-8">
    <h1 class="text-2xl font-bold">Quản lý tickets</h1>
    <div class="bg-white dark:bg-card p-4 rounded-lg shadow-lg flex-1">
      <div class="flex gap-4">
        <Card class="w-48">
          <CardHeader>
            <CardTitle>Tổng số tickets</CardTitle>
            <CardDescription>0</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div class="flex items-end gap-4 mt-4">
        <div v-if="ticketCategories.length">
          <Label for="ticketCategory">Trạng thái ticket</Label>
          <Select v-model="ticketStatus">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Lọc theo trạng thái ticket  " />
            </SelectTrigger>
            <SelectContent class="w-48">
              <SelectItem :value="null">Tất cả</SelectItem>
              <SelectItem v-for="item in ticketCategories" :key="item.value" :value="item.value">{{
                t(item.label)
              }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div v-if="ticketPriorities.length">
          <Label for="ticketPriority">Mức độ ưu tiên</Label>
          <Select v-model="ticketPriority">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Lọc theo mức độ ưu tiên" />
            </SelectTrigger>
            <SelectContent class="w-48">
              <SelectItem :value="null">Tất cả</SelectItem>
              <SelectItem v-for="item in ticketPriorities" :key="item.value" :value="item.value">{{
                t(item.label)
              }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div v-if="customers.length">
          <Label for="customer">Khách hàng</Label>
          <Select v-model="customer">
            <SelectTrigger class="w-48">
              <SelectValue placeholder="Lọc theo khách hàng" />
            </SelectTrigger>
            <SelectContent class="w-48">
              <SelectItem :value="null">Tất cả</SelectItem>
              <SelectItem v-for="item in customers" :key="item.id" :value="item.id">{{
                item.name
              }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" @click="resetFilter"><RefreshCcw />Reset</Button>
        <Button variant="default" @click="searchTickets"><Search />Tìm kiếm</Button>
      </div>
      <div class="mt-4">
        <Table
          :tbHeader="TICKET_TABLE_HEADER"
          :data="tickets"
          :styling="tableStyling"
          @actionEdit="handleEdit"
          @actionDelete="handleDelete"
        ></Table>
      </div>
    </div>
    <Dialog
      :open="open"
      @close="open = false"
      title="Cập nhật ticket"
      description="Chuyển trạng thái ticket"
      submitText="Cập nhật"
      cancelText="Hủy"
      @submit="handleUpdateTicket"
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
            <span class="font-semibold" v-for="item in selectedTicket.ticketItems" :key="item.id"
              >{{ item.waybill }}({{ item.carrier }}),
            </span>
          </div>
          <div
            v-if="selectedTicket.status"
            class="flex items-center justify-between p-4 border-b border-border"
          >
            <span>Trạng thái {{ selectedTicket.status }}</span>
            <Select v-model="selectedTicket.status" :disabled="selectedTicket.status === 'CLOSED'">
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">Tất cả</SelectItem>
                <SelectItem
                  v-for="item in ticketCategories"
                  :key="item.value"
                  :value="item.value"
                  >{{ t(item.label) }}</SelectItem
                >
              </SelectContent>
            </Select>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'
import Card from '@/components/ui/card/Card.vue'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ticketPropMap } from '@/utils/helper'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { RefreshCcw, Search } from 'lucide-vue-next'
import Table from '@/components/kits/table/index.vue'
import Dialog from '@/components/kits/dialog/index.vue'
import { TICKET_TABLE_HEADER, BADGE_PRIORITY, BADGE_STATUS, TICKET_CATEGORY } from '@/utils/config'
import { formatDateTime } from '@/utils/format'

const authStore = useAuthStore()
const ticketCategories = ref([])
const ticketStatus = ref(null)
const ticketPriorities = ref([])
const ticketPriority = ref(null)
const customers = ref([])
const customer = ref(null)
const tickets = ref([])
const open = ref(false)
const selectedTicket = ref({})

const queryParams = ref({
  status: null,
  priority: null,
  ticketUserId: null,
  page: 1,
  limit: 10,
})

const t = useI18n().t

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

const getTickets = async () => {
  try {
    const data = await api.get(`/ticket/get`, {
      params: queryParams.value,
    })
    tickets.value = data.data.tickets
    ticketCategories.value = ticketPropMap(data.data.VALID_STATUS)
    ticketPriorities.value = ticketPropMap(data.data.VALID_PRIORITY)
  } catch (error) {
    console.log(error)
  }
}

const resetFilter = () => {
  ticketStatus.value = null
  ticketPriority.value = null
  customer.value = null
  queryParams.value = {
    status: null,
    priority: null,
    ticketUserId: null,
    page: 1,
    limit: 10,
  }
  getTickets()
}

const searchTickets = () => {
  queryParams.value.status = ticketStatus.value
  queryParams.value.priority = ticketPriority.value
  queryParams.value.ticketUserId = customer.value
  getTickets()
}

const handleEdit = (row) => {
  console.log(row)
  selectedTicket.value = { ...row }
  open.value = true
}

const handleDelete = (row) => {
  console.log(row)
}

const handleUpdateTicket = async () => {
  try {
    const data = await api.post(`/ticket/update`, {
      id: selectedTicket.value.id,
      status: selectedTicket.value.status,
    })
    console.log(data)
    open.value = false
    getTickets()
  } catch (error) {
    console.log(error)
  }
}

watch(tickets, () => {
  let ids = []
  customers.value = []
  tickets.value.forEach((ticket) => {
    if (!ids.includes(ticket.ticketUser.id)) {
      ids.push(ticket.ticketUser.id)
      customers.value.push(ticket.ticketUser)
    }
  })
})

onMounted(() => {
  getTickets()
})
</script>
