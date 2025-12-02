<template>
  <div class="p-4 bg-gray-100 h-full dark:bg-background overflow-auto">
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
      v-if="showCreateTicket"
      class="mt-4 bg-white dark:bg-card shadow-sm rounded-md transition-all duration-300 overflow-hidden"
    >
      <div class="p-4 flex flex-col gap-1">
        <span class="text-xl font-bold text-indigo-500">{{ t('createTicket') }}</span>
        <span class="text-sm flex items-center text-orange-500"
          ><Info class="size-4 mr-1" />{{ t('enterOrderNumberHints') }}</span
        >
      </div>
      <div class="px-4 flex items-center gap-8">
        <Select v-model="selectTicketCategory">
          <SelectTrigger class="w-1/2">
            <SelectValue :placeholder="t('selectTicketCategory')" />
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
        <Select v-model="ticketCarrier">
          <SelectTrigger class="w-1/2">
            <SelectValue :placeholder="t('selectTicketCarrier')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="carrier in CARRIERS" :key="carrier.value" :value="carrier.value">
              {{ carrier.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="p-4 flex items-center justify-between gap-2">
        <input
          type="text"
          class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex-1"
          :placeholder="t('enterTrackingNumbers')"
          v-model="orderNumbers"
        />
      </div>
      <div class="p-4 flex items-center justify-center">
        <textarea
          v-model="ticketNote"
          class="w-full text-sm min-h-32 p-4 border border-border rounded-md"
          :placeholder="t('enterTicketNote')"
        ></textarea>
      </div>
      <div class="p-4">
        <span class="text-sm font-semibold">{{ t('ticketAttachedments') }}</span>
        <div>
          <input
            type="file"
            ref="imageInput"
            multiple
            accept="image/*"
            class="hidden"
            @change="onImageAttachChange"
          />
          <Button @click="handleImageAttach" variant="outline" class="min-w-32">
            <ImagePlus class="size-4" />
            {{ t('ticketImages') }}
          </Button>
          <div class="py-4 flex items-center gap-8">
            <div
              v-for="(image, idx) in ticketAttachedmentsImageThumbnails"
              :key="idx"
              class="w-48 h-48 rounded-md border border-border shadow-sm relative"
            >
              <img :src="image" class="h-full w-full object-cover rounded-md" />
              <Button class="absolute -top-3 -right-3 rounded-full w-6 h-6" variant="destructive" @click="removeImageAttach(idx)">
                <Trash2 class="size-4" />
              </Button>
            </div>
          </div>
          <input
            type="file"
            ref="fileInput"
            multiple
            accept=".xlsx,.xls,.pdf,.doc,.docx,.txt"
            class="hidden"
            @change="onFileAttachChange"
          />
          <Button @click="handleFileAttach" variant="outline" class="min-w-32">
            <Paperclip class="size-4" />
            {{ t('ticketFiles') }}
          </Button>
          <div class="py-2 grid grid-cols-2 gap-2">
            <div v-for="(file, idx) in ticketAttachedmentsFile" :key="idx" class="flex items-center gap-1 px-2 py-1 bg-muted rounded-md">
              <FileText class="size-4 text-green-600"/>
              <span class="truncate">{{ file.name }}</span>
              <button @click="removeFileAttach(idx)" class="ml-auto hover:text-red-600 p-1 rounded-full hover:bg-red-100 transition-colors"><Trash2 class="size-4" /></button>
            </div>
          </div>
        </div>
      </div>
      <div class="p-4 flex justify-end">
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
    <div class="mt-4 border-y border-border py-4 flex items-center gap-8">
      <Select v-model="searchTicketCategory">
        <SelectTrigger>
          <SelectValue :placeholder="t('selectTicketCategory')" class="w-48" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="category in TICKET_CATEGORY"
            :key="category.value"
            :value="category.value"
          >
            {{ t(category.key) }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="searchTicketPriority">
        <SelectTrigger>
          <SelectValue :placeholder="t('selectTicketPriority')" class="w-48" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="priority in BADGE_PRIORITY"
            :key="priority.value"
            :value="priority.value"
          >
            {{ t(priority.value) }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Select v-model="searchTicketStatus">
        <SelectTrigger>
          <SelectValue :placeholder="t('selectTicketStatus')" class="w-48" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="status in BADGE_STATUS" :key="status.value" :value="status.value">
            {{ t(status.value) }}
          </SelectItem>
        </SelectContent>
      </Select>

      <Button @click="fetchTickets" variant="default"
        ><Search class="w-4 h-4" />{{ t('searchOrder') }}</Button
      >
    </div>
    <div class="mt-4">
      <Table
        :tbHeader="TICKET_TABLE_HEADER"
        :data="tickets"
        :styling="tableStyling"
        @actionEdit="handleEdit"
        @actionDelete="handleDelete"
      />
    </div>
    <div>
      <Pagination :configs="pagination" @pageChange="handlePageChange()" />
    </div>
    <Dialog
      :open="open"
      @close="open = false"
      title="Ticket"
      description="Chi tiết ticket"
      :btnSubmitShow="false"
      cancelText="close"
      :styling="'min-w-[1024px]'"
    >
    <template #content>
        <div class="text-sm h-[400px] grid grid-cols-2 gap-x-24 gap-y-4 overflow-y-auto">
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
            <span
              :class="BADGE_PRIORITY.find((item) => item.value === selectedTicket.priority).style"
              >{{ selectedTicket.priority }}</span
            >
          </div>
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span>Khách hàng</span>
            <span class="font-semibold">{{ selectedTicket.ticketUser.name }}</span>
          </div>
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span>Đơn vị vận chuyển</span>
            <span class="font-semibold">{{ selectedTicket.carrier }}</span>
          </div>
          <div class="flex flex-col p-4 border-b border-border">
            <span>Vận đơn</span>
            <div class="flex flex-wrap gap-4">
              <span class="font-semibold" v-for="item in selectedTicket.ticketItems" :key="item.id"
                >{{ item.waybill }}
              </span>
            </div>
          </div>
          <div
            v-if="selectedTicket.status"
            class="flex items-center justify-between p-4 border-b border-border"
          >
            <span>Trạng thái</span>
            <span
              :class="BADGE_STATUS.find((item) => item.value === selectedTicket.status).style"
              >{{
                t(BADGE_STATUS.find((item) => item.value === selectedTicket.status).label)
              }}</span
            >
          </div>
          <div class="flex items-center justify-between p-4 border-b border-border">
            <span>Ghi chú</span>
            <span class="font-semibold">{{ selectedTicket.description }}</span>
          </div>
          <div v-if="selectedTicket.ticketAttachments.length" class="col-span-2 p-4"> 
            <span class="font-semibold block mb-4">Đính kèm</span>
            <div class="flex items-center gap-4">
              <div v-for="item in selectedTicketAttachmentImg" :key="item.id">
                <LazyImg v-if="item.type==='image'"  :src="item.url" alt=""/>
              </div>
            </div>
            <div class="flex flex-col gap-4 mt-4 p-4 border-t border-border">
              <div v-for="item in selectedTicketAttachmentFile" :key="item.id" class="flex items-start gap-2">
                <FileText class="size-4 text-green-500"/>
                <a v-if="item.type==='document'" class="text-blue-500 hover:underline"  :href="item.url" target="_blank">{{ item.name }}</a>
              </div>
            </div>
          </div>
        </div>
    </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { PlusIcon, XIcon, Info, Search, CircleCheck, Paperclip, ImagePlus, Trash2, FileText, X } from 'lucide-vue-next'
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
import { toast } from 'vue-sonner'
import Pagination from '@/components/kits/pagination/index.vue'
import LazyImg from '@/components/kits/lazyImg/index.vue'

const { t } = useI18n()
const tickets = ref([])
const selectedTicket = ref(null)
const selectedTicketAttachmentImg = computed(() => {
  if (!selectedTicket.value) return []
  return selectedTicket.value.ticketAttachments.filter((item) => item.type === 'image')
})
const selectedTicketAttachmentFile = computed(() => {
  if (!selectedTicket.value) return []
  return selectedTicket.value.ticketAttachments.filter((item) => item.type === 'document')
})
const showCreateTicket = ref(false)
const selectTicketCategory = ref(null)
const ticketCarrier = ref(null)
const searchTicketCategory = ref(null)
const searchTicketStatus = ref(null)
const orderNumbers = ref('')
const ticketNote = ref('')
const ticketAttachedmentsImage = ref([])
const ticketAttachedmentsImageThumbnails = ref([])
const ticketAttachedmentsFile = ref([])
const imageInput = ref(null)
const fileInput = ref(null)
const searchTicketPriority = ref(null)
const open = ref(false)
const query = ref({
  category: null,
  priority: null,
  status: null,
  page: 1,
  limit: 10,
})
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
})

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

const tableStyling = {
  carrier: {
    colName: 'carrier',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return col.carrier
    },
  },
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
    const response = await api.get('/customer/tickets', { params: query.value })
    tickets.value = response.data.data
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}

const createTicket = async () => {
  if (!selectTicketCategory.value) {
    toast.error(t('ticketCategoryRequiredForTicketCreation'))
    return
  }
  if (!orderNumbers.value.length) {

    toast.error(t('trackingNumbersRequiredForTicketCreation'))
    return
  }
  const formData = new FormData();
  formData.append('category', selectTicketCategory.value);
  formData.append('carrier', ticketCarrier.value);
  formData.append('description', ticketNote.value);
  formData.append('ticketItems', orderNumbers.value.trim().split(',').join(','));

  // Append images
  ticketAttachedmentsImage.value.forEach((image) => {
    formData.append('files', image);
  });
  
  // Append files
  ticketAttachedmentsFile.value.forEach((file) => {
    formData.append('files', file);
  });
  
  try {
    const response = await api.post('/customer/ticket/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data)
    await fetchTickets()
    showCreateTicket.value = false
  } catch (error) {
    console.error('Error creating ticket:', error)
  }
}

const handleEdit = (ticket) => {
  selectedTicket.value = ticket
  open.value = true
}

const handleDelete = (ticket) => {
  toast.warning(t('notPermissionDeleteTicket'))
}

const handlePageChange = async (page) => {
  query.value.page = page
  await fetchTickets()
}

const handleImageAttach = () => {
  imageInput.value.value = ''
  imageInput.value.click()
}

const handleFileAttach = () => {
  fileInput.value.value = ''
  fileInput.value.click()
}

const onImageAttachChange = (event) => {
  ticketAttachedmentsImage.value = []
  ticketAttachedmentsImageThumbnails.value = []
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    ticketAttachedmentsImage.value = files
    files.map((file, idx) => {
      const thumbnail = URL.createObjectURL(file)
      ticketAttachedmentsImageThumbnails.value[idx] = thumbnail
    })
  }
}

const onFileAttachChange = (event) => {
  ticketAttachedmentsFile.value = []
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    ticketAttachedmentsFile.value = files
    console.log(ticketAttachedmentsFile.value)
  }
}

const removeImageAttach = (idx) => {
  ticketAttachedmentsImage.value.splice(idx, 1)
  ticketAttachedmentsImageThumbnails.value.splice(idx, 1)
}

const removeFileAttach = (idx) => {
  ticketAttachedmentsFile.value.splice(idx, 1)
}



watch(searchTicketCategory, () => {
  query.value.category = searchTicketCategory.value
})
watch(searchTicketPriority, () => {
  query.value.priority = searchTicketPriority.value
})
watch(searchTicketStatus, () => {
  query.value.status = searchTicketStatus.value
})

onMounted(() => {
  fetchTickets()
})
</script>
