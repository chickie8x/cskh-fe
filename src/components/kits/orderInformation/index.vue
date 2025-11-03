<template>
  <div>
    <div class="flex gap-2">
      <div class="flex flex-col gap-2 bg-white dark:bg-card p-4 rounded-md shadow-sm">
        <div class="flex items-center gap-2">
          <span class="block min-w-54">{{ t('orderNumber') }}</span>
          <span class="block font-bold">{{ order.waybill }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="block min-w-54">{{ t('orderReference') }}</span>
          <span class="block font-bold">{{ order.rawData.ORDER_REFERENCE || '' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="block min-w-54">{{ t('orderStatus') }}</span>
          <span
            class="block font-bold"
            :class="orderStatusMap(order.rawData.ORDER_STATUS)[1].color"
            >{{ orderStatusMap(order.rawData.ORDER_STATUS)[0] }}</span
          >
        </div>
        <div class="flex items-center gap-2">
          <span class="block min-w-54">{{ t('carrier') }}</span>
          <span class="block font-bold">{{ order.carrier || '' }}</span>
        </div>
        <div class="flex items-center gap-2 border-b border-border pb-2">
          <span class="block min-w-54">{{ t('orderTransportService') }}</span>
          <span class="block font-bold">{{ order.rawData.ORDER_SERVICE }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <span class="block text-indigo-500 font-bold min-w-54">{{ t('senderTitle') }}</span>
          <span class="block font-semibold">{{
            order.rawData.SENDER_FULLNAME + ' - ' + order.rawData.SENDER_PHONE
          }}</span>
          <span class="block">{{ order.rawData.SENDER_ADDRESS || 'N/A' }}</span>
        </div>
        <div class="flex flex-col gap-2 border-b border-border pb-2">
          <span class="block text-indigo-500 font-bold min-w-54">{{ t('receiverTitle') }}</span>
          <span class="block font-semibold">{{
            order.rawData.RECEIVER_FULLNAME + ' - ' + order.rawData.RECEIVER_PHONE
          }}</span>
          <span class="block">{{ order.rawData.RECEIVER_ADDRESS || 'N/A' }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <span class="block text-indigo-500 font-bold min-w-54">{{ t('feeAndCOD') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="block min-w-54">{{ t('isCOD') }}</span>
          <span class="block font-semibold">{{
            order.rawData.MONEY_COLLECTION ? 'Thu hộ tiền hàng' : 'Không thu hộ tiền hàng'
          }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="block min-w-54">{{ t('orderCOD') }}</span>
          <span class="block font-bold">{{ formatCurrency(order.rawData.MONEY_COLLECTION) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="block min-w-54"
            >{{ t('orderTotalFee') }}
            <span class="text-muted-foreground text-sm">{{
              order.rawData.ORDER_PAYMENT === 2 ? '(Người nhận trả)' : '(Người gửi trả)'
            }}</span></span
          >
          <span class="block font-bold">{{ formatCurrency(order.rawData.MONEY_TOTAL) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="block min-w-54">{{ t('receiverPayment') }}</span>
          <span class="block font-bold">{{
            formatCurrency(
              order.rawData.ORDER_PAYMENT === 2
                ? order.rawData.MONEY_COLLECTION + order.rawData.MONEY_TOTAL
                : order.rawData.MONEY_COLLECTION,
            )
          }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-2 bg-white dark:bg-card p-4 rounded-md shadow-sm">
        <div v-if="!order.rawData.LIST_ITEM" class="flex flex-col gap-2">
          <span class="block text-indigo-500 font-bold">{{ t('productInformation') }}</span>
          <div v-for="(item, idx) in order.rawData.PRODUCT_NAME.split(',')" :key="idx">
            <div v-if="item.trim().length > 0" class="flex items-center justify-between gap-2">
              <span class="block min-w-32">{{ t('productName') }}</span>
              <span class="block font-semibold">{{ item.trim() }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 border-t border-border pt-2">
            <span>{{ t('totalWeight') }}</span>
            <span class="font-semibold">{{ order.rawData.PRODUCT_WEIGHT }}g</span>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span>{{ t('totalCost') }}</span>
            <span class="font-semibold">{{ formatCurrency(order.rawData.PRODUCT_PRICE) }}</span>
          </div>
        </div>
        <div v-else class="flex flex-col gap-4">
          <span class="block text-indigo-500 font-bold">{{ t('productInformation') }}</span>
          <div
            v-for="(item, idx) in order.rawData.LIST_ITEM"
            :key="idx"
            class="flex flex-col gap-2 border-b border-border pb-2"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="block min-w-32">{{ t('productName') }}</span>
              <span class="block font-semibold">{{ item.productName }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="block min-w-32">{{ t('productQuantity') }}</span>
              <span class="block font-semibold">{{ item.productQuantity }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="block min-w-32">{{ t('productPrice') }}</span>
              <span class="block font-semibold">{{ formatCurrency(item.productPrice) }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="block min-w-32">{{ t('productWeight') }}</span>
              <span class="block font-semibold">{{ item.productWeight }}g</span>
            </div>
          </div>
          <div class="flex flex-col gap-2 border-b border-border pb-2">
            <div class="flex items-center justify-between gap-2">
              <span>{{ t('totalWeight') }}</span>
              <span class="font-semibold"
                >{{
                  formatNumber(
                    order.rawData.LIST_ITEM.reduce(
                      (total, item) => total + parseInt(item.productWeight),
                      0,
                    ),
                  )
                }}g</span
              >
            </div>
            <div class="flex items-center justify-between gap-2">
              <span>{{ t('totalCost') }}</span>
              <span class="font-semibold">{{
                formatCurrency(
                  order.rawData.LIST_ITEM.reduce(
                    (total, item) => total + parseInt(item.productPrice),
                    0,
                  ),
                )
              }}</span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <span class="block text-indigo-500 font-bold">{{ t('orderNote') }}</span>
            <span>{{ order.rawData.ORDER_NOTE }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 bg-white dark:bg-card p-4 rounded-md shadow-sm flex-1">
        <span class="block text-indigo-500 font-bold">{{ t('orderEvents') }}</span>
        <div class="flex flex-col gap-2">
          <div v-for="event in events" :key="event.id">
            <div class="flex flex-col gap-1">
              <span class="font-medium">{{ formatDateTime(event.time) }}</span>
              <div class="flex flex-col">
                <span>{{ event.statusStd }}</span>
                <span>{{ event.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { orderStatusMap } from '@/utils/helper'
import { formatCurrency, formatDateTime, formatNumber } from '@/utils/format'
import { ref } from 'vue'
import { onMounted } from 'vue'
import api from '@/api/axios'
import { MoveUp } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({
  order: {
    type: Object,
    default: () => ({}),
  },
})

const events = ref([])

const getOrderEvents = async () => {
  try {
    const orderId = props.order.id
    const response = await api.get(`/connector/viettelpost/order/events?orderId=${orderId}`)
    console.log(response.data)
    events.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  getOrderEvents()
})
</script>
