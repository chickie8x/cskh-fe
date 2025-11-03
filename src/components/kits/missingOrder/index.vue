<template>
  <div>
    <div class="flex items-center gap-2">
      <span>{{ order }}</span>
      <Select v-model="orderCarriers">
        <SelectTrigger>
          <SelectValue :placeholder="t('selectCarrier')" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="carrier in CARRIERS" :key="carrier.key" :value="carrier.value">
            {{ carrier.label }}
          </SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" @click="syncOrderCarrier" :disabled="!orderCarriers || loading"
        ><RefreshCw class="size-4" :class="{ 'animate-spin': loading }"
      /></Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CARRIERS } from '@/utils/config'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RefreshCw } from 'lucide-vue-next'
import api from '@/api/axios'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const props = defineProps({
  order: {
    type: String,
    default: () => '',
  },
})

const orderCarriers = ref(null)
const loading = ref(false)
const emit = defineEmits(['syncOrderCarrier'])
const syncOrderCarrier = async () => {
  try {
    loading.value = true
    const response = await api.post(`/common/order/sync`, {
      carrier: orderCarriers.value,
      orderId: props.order,
    })
    toast.success(t('syncSuccess'))
    orderCarriers.value = response.data.data
    emit('syncOrderCarrier', response.data.data)
  } catch (error) {
    console.error(error)
    toast.error(t('syncFailed'))
  } finally {
    loading.value = false
  }
}
</script>
