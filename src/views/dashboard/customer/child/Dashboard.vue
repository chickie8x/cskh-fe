<template>
  <div class="p-4 bg-gray-100 h-full dark:bg-background">
    <div class="flex flex-col gap-1">
      <span class="text-2xl font-bold">{{ t('orderManagement') }}</span>
      <span class="text-muted-foreground text-sm">{{ t('orderManagementDescription') }}</span>
    </div>

    <div class="flex justify-between items-center gap-2 mt-4 border-b border-border pb-8">
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

    <span class="text-sm text-orange-500 flex mt-4">*{{ t('multiOrderSearchGuide') }}</span>
    <div class="mt-1 flex items-stretch gap-4 border-b border-border pb-4">
      <div class="flex flex-col justify-center gap-2 flex-1">
        <div class="flex items-center gap-2">
          <div
            class="flex items-center gap-2 border border-border bg-white dark:bg-card h-9 rounded-sm w-full max-w-96 shadow-sm px-2"
          >
            <input
              v-model="orders"
              type="search"
              :placeholder="t('orderGetByNumber')"
              class="border-none outline-none w-full px-2"
            />
            <Search class="size-6 opacity-50" />
          </div>
          <div>
            <VueDatePicker
              v-model="date"
              range
              :placeholder="t('orderGetByDate')"
              :enable-time-picker="false"
              :format="formatDateRange"
              :dark="isDark"
              locale="vi-VN"
              :disabled="disabledDate"
            />
          </div>
          <div>
            <Select v-model="carrier">
              <SelectTrigger
                class="border-transparent bg-white shadow-sm"
                :class="[carrierError ? 'border-red-500  bg-red-50' : '']"
              >
                <SelectValue
                  :placeholder="t('getOrderByCarrier')"
                  :class="[carrierError ? 'text-red-500' : '']"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="null">
                  {{ t('allCariers') }}
                </SelectItem>
                <SelectItem v-for="carrier in carries" :key="carrier.value" :value="carrier.value">
                  {{ carrier.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <MultiSelector
            ref="multiSelectorRef"
            :orders="data"
            :isDisabled="disabledMultiSelector"
            @updateFilter="updateFilter"
          />
        </div>
      </div>
      <div class="flex flex-col h-full gap-2">
        <Button @click="getOrderList" variant="default">{{ t('searchOrder') }}</Button>
        <Button @click="resetFilterOrders" variant="outline">{{ t('resetFilterBtn') }}</Button>
      </div>
    </div>

    <div v-if="missingOrders.length > 0">
      <div class="py-4">
        <div>
          <span class="text-sm font-semibold">{{ t('totalQueryOrders') }}: </span>
          <span class="font-bold text-blue-500">
            {{ orders.split(',').length }}
          </span>
        </div>
        <div>
          <span class="text-sm font-semibold">{{ t('foundOrders') }}: </span>
          <span class="font-bold text-green-500">
            {{ data.length }}
          </span>
        </div>
        <div>
          <span class="text-sm font-semibold">{{ t('notFoundOrders') }}: </span>
          <span class="font-bold text-red-500">
            {{ missingOrders.length }}
          </span>
        </div>
      </div>
      <span class="text-sm text-red-500 flex font-bold">{{ t('missingOrders') }}</span>  
      <ul class="list-disc px-4 py-2 flex flex-wrap gap-8 text-sm text-orange-500">
        <li v-for="item, idx in missingOrders" :key="idx">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="mt-4" v-if="data.length > 0">
      <Table
        :tb-header="ORDER_TABLE_HEADER"
        :data="data"
        :styling="styling"
        :actionCol="false"
        @colAction="handleColAction"
      />
    </div>
    <div v-if="data.length > 0">
      <Pagination :configs="paginationConfig" @pageChange="handlePageChange"/>
    </div>
  </div>
  <Dialog
    :open="open"
    @close="open = false"
    @submit="handleDialogSubmit"
    :title="t('orderInformation')"
    :description="t('orderInformationDescription')"
    :btnSubmitShow="btnSubmitShow"
    :submitText="submitBtnText"
    :submitBtnVariant="submitBtnVariant"
    :cancelText="t('close')"
    :cancelBtnVariant="'default'"
    :styling="'sm:max-w-none !w-[1200px]'"
  >
    <template #content>
      <OrderInformation
        v-if="selectedDialogContent === 'showOrderInformation'"
        :order="selectedOrder"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import Table from '@/components/kits/table/index.vue'
import Dialog from '@/components/kits/dialog/index.vue'
import OrderInformation from '@/components/kits/orderInformation/index.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ORDER_TABLE_HEADER } from '@/utils/config'
import { formatCurrency, formatDateTime, formatDateRange } from '@/utils/format'
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/api/axios'
import { Search } from 'lucide-vue-next'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { useDark } from '@vueuse/core'
import { orderStatusMap, filterOrdersByLabels } from '@/utils/helper'
import MultiSelector from '@/components/kits/multiSelector/index.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth'
import Pagination from '@/components/kits/pagination/index.vue'
import { ORDER_STATUS_DETAIL } from '@/utils/helper'

const { t } = useI18n()
const isDark = useDark()
const date = ref([])
const data = ref([])
const carrier = ref(null)
const orders = ref('')
const disabledDate = computed(() => orders.value.length > 0)
const disabledMultiSelector = computed(() => orders.value.length > 0)
const carrierError = ref(false)
const totalOrdersCount = ref(0)
const totalCollectedCount = ref(0)
const totalPendingCount = ref(0)
const totalCanceledCount = ref(0)
const open = ref(false)
const selectedOrder = ref(null)
const selectedDialogContent = ref('')
const submitBtnText = ref('')
const btnSubmitShow = ref(false)
const submitBtnVariant = ref('default')
const missingOrders = ref([])
const filteredOrders = ref([])
const multiSelectorRef = ref(null)
const paginationConfig = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
})

const query = ref({
  page: 1,
  limit: 10,
  carrier: carrier.value,
  date: date.value,
  state: filteredOrders.value,
})

const carries = [
  {
    value: 'VIETTEL_POST',
    label: 'Viettel Post',
  },
  {
    value: 'GHN',
    label: 'GHN',
  },
]

const generalInfo = ref([
  {
    key: 'totalOrder',
    label: 'totalOrder',
    value: totalOrdersCount.value,
  },
  {
    key: 'collectSuccessfully',
    label: 'collectSuccessfully',
    value: totalCollectedCount.value,
  },
  {
    key: 'collectPending',
    label: 'collectPending',
    value: totalPendingCount.value,
  },
  {
    key: 'collectCancel',
    label: 'collectCancel',
    value: totalCanceledCount.value,
  },
])

const styling = ref({
  waybill: {
    colName: 'waybill',
    classFn: (col) => {
      return 'font-bold text-green-600 cursor-pointer hover:underline'
    },
    valueFn: (col) => {
      return col.waybill
    },
    actionColFn: 'showOrderInformation',
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
  moneyTotalFee: {
    colName: 'moneyTotalFee',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return formatCurrency(col.rawData?.MONEY_TOTAL)
    },
  },
  carrier: {
    colName: 'carrier',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return col.carrier
    },
  },
  moneyCollection: {
    colName: 'moneyCollection',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return formatCurrency(col.rawData?.MONEY_COLLECTION) || 0
    },
  },
  orderStatus: {
    colName: 'orderStatus',
    classFn: (col) => {
      const ret = orderStatusMap(col.rawData?.ORDER_STATUS) || 'Chưa cập nhật'
      return ret[1].color
    },
    valueFn: (col) => {
      const ret = orderStatusMap(col.rawData?.ORDER_STATUS) || 'Chưa cập nhật'
      return ret[0]
    },
  },
  orderProduct: {
    colName: 'orderProduct',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return col.rawData?.PRODUCT_NAME
    },
  },
  lastUpdate: {
    colName: 'lastUpdate',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return formatDateTime(col.lastSyncedAt || '')
    },
  },
})

const getOrderList = async () => {
  if (orders.value.length > 0 && carrier.value === null) {
    carrierError.value = true
    toast.error(t('carrierRequired'))
    return
  }
  try {
    const res = await api.get('connector/viettelpost/order/list', {
      params: query.value,
    })
    if (res.data.success) {
      data.value = res.data.data
      paginationConfig.value = res.data.pagination
      missingOrders.value = res.data.missingOrders
      if(data.value.length === 0){
        toast.info(t('noData'))
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const getOrderSummary = async () => {
  try {
    const res = await api.get('connector/viettelpost/order/summary')
    if (res.data.success) {
      totalOrdersCount.value = res.data.data.totalOrdersCount
      totalCollectedCount.value = res.data.data.totalCollectedCount
      totalPendingCount.value = res.data.data.totalPendingCount
      totalCanceledCount.value = res.data.data.totalCanceledCount
    }
  } catch (error) {
    console.log(error)
  }
}

const getAddresses = async () => {
  const authStore = useAuthStore()
  const address = authStore.getUserAddress
  if (!address) {
    try {
      const res = await api.get('customer/address')
      if (res.data.success) {
        authStore.setUserAddress(res.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

const handleColAction = (row, actionFn) => {
  console.log(row, actionFn)
  open.value = true
  selectedOrder.value = row
  selectedDialogContent.value = actionFn
  if (actionFn === 'showOrderInformation') {
    btnSubmitShow.value = true
    if (
      selectedOrder.value.rawData.ORDER_STATUS.toString() !== '107' &&
      selectedOrder.value.rawData.ORDER_STATUS.toString() !== '201'
    ) {
      submitBtnText.value = t('cancelOrder')
      submitBtnVariant.value = 'destructive'
    } else {
      submitBtnText.value = t('deleteOrder')
      submitBtnVariant.value = 'destructive'
    }
  }
}

const handleDialogSubmit = async () => {
  if (selectedDialogContent.value === 'showOrderInformation') {
    const type = ['107', '201'].includes(selectedOrder.value.rawData.ORDER_STATUS.toString())
      ? 11
      : 4
    const waybill = selectedOrder.value.waybill
    try {
      const res = await api.post('connector/viettelpost/order/update', {
        type,
        waybill,
      })
      if (res.data.success) {
        open.value = false
        getOrderList()
        getOrderSummary()
        if (Number(type) === 4) {
          toast.success(t('cancelOrderSuccess'))
        } else {
          toast.success(t('deleteOrderSuccess'))
        }
      }
    } catch (error) {
      console.log(error)
      if (Number(type) === 4) {
        toast.error(t('cancelOrderFailed'))
      } else {
        toast.error(t('deleteOrderFailed'))
      }
    }
  }
}

const resetFilterOrders = () => {
  orders.value = ''
  date.value = []
  carrier.value = null
  query.value.state = null
  multiSelectorRef.value.resetState()
}

const handlePageChange = (page) => {
  query.value.page = page
  getOrderList()
}

const updateFilter = (val) => {
  filteredOrders.value = val.map(state => {
    return ORDER_STATUS_DETAIL[state].codes
  })
  filteredOrders.value = filteredOrders.value.flat(Infinity)
  query.value.state = filteredOrders.value.join(',')
  console.log(query.value.state)
}

watch(orders, () => {
  if (orders.value.length > 0) {
    date.value = []
    carrier.value = null
    query.value.orderNumber = orders.value.trim()
  } else {
    query.value.orderNumber = null
  }
})

watch(date, () => {
  if (date.value?.length > 0) {
    orders.value = ''
    query.value.startDate = date.value[0]
    query.value.endDate = date.value[1]
  } else {
    query.value.startDate = null
    query.value.endDate = null
  }
})

watch(carrier, () => {
  if (carrier.value) {
    query.value.carrier = carrier.value
    carrierError.value = false
  } else {
    query.value.carrier = null
  }
})

watch(totalOrdersCount, () => {
  generalInfo.value.find((info) => info.key === 'totalOrder').value = totalOrdersCount.value
})

watch(totalCollectedCount, () => {
  generalInfo.value.find((info) => info.key === 'collectSuccessfully').value =
    totalCollectedCount.value
})

watch(totalPendingCount, () => {
  generalInfo.value.find((info) => info.key === 'collectPending').value = totalPendingCount.value
})

watch(totalCanceledCount, () => {
  generalInfo.value.find((info) => info.key === 'collectCancel').value = totalCanceledCount.value
})

onMounted(() => {
  getOrderList()
  getOrderSummary()
  getAddresses()
})
</script>
