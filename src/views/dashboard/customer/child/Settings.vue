<template>
  <div class="p-4 flex flex-col gap-4">
    <h1 class="font-bold text-2xl">{{ t('userSetting') }}</h1>

    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h2>{{ t('connectedCarriers') }}</h2>
        <Button variant="default" @click="open = true"><CirclePlus /> Connect</Button>
      </div>
      <div v-if="carrierGeneralInfo.length > 0">
        <Card v-for="stat in carrierGeneralInfo" :key="stat.title" class="max-w-[250px]">
          <div class="flex flex-col gap-4" :class="!stat.active ? 'grayscale-100' : ''">
            <div class="w-16 h-16 rounded-md mx-auto overflow-hidden">
              <img :src="stat.icon" :class="stat.iconClass" />
            </div>
            <CardHeader>
              <CardTitle>{{ stat.title }}</CardTitle>
              <CardDescription class="flex items-center gap-2"
                >{{ stat.description }}
                <span
                  class="ml-auto"
                  :class="
                    stat.active
                      ? 'text-green-500 font-bold bg-green-100 border-green-500 px-2 py-1 rounded-md text-xs'
                      : 'text-red-500 font-bold bg-red-100 border-red-500 px-2 py-1 rounded-md text-xs'
                  "
                  >{{ stat.active ? 'Active' : 'Inactive' }}</span
                >
              </CardDescription>
            </CardHeader>
            <CardContent class="flex items-center justify-between">
              <div class="text-sm">
                <span class="font-bold block">Expired at:</span>
                <span class="block text-muted-foreground">{{ stat.expiredAt }}</span>
              </div>
              <Button variant="ghost" :disabled="!stat.active" @click="handleRefresh(stat)"
                ><RefreshCcw
              /></Button>
            </CardContent>
          </div>
        </Card>
      </div>
      <div v-else>
        <p class="text-center">No carriers connected</p>
      </div>
    </div>
    <Dialog
      :open="open"
      :title="'Connect Carrier'"
      :description="'Connect your carrier to start using it'"
      :submitText="'Connect'"
      @submit="handleConnect"
      @close="open = false"
    >
      <template #content class="flex flex-col gap-4">
        <div class="flex flex-col w-full">
          <label for="carrier" class="text-sm font-semibold">Carrier</label>
          <Select v-model="carrier">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a carrier" />
            </SelectTrigger>
            <SelectContent class="w-full">
              <SelectItem v-for="carrier in carriers" :key="carrier.value" :value="carrier.value">
                {{ carrier.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex flex-col w-full">
          <label for="username" class="text-sm font-semibold">username</label>
          <input
            type="text"
            id="username"
            class="w-full px-2 py-1 border rounded-md"
            v-model="vtpUsername"
          />
        </div>
        <div class="flex flex-col w-full">
          <label for="password" class="text-sm font-semibold">password</label>
          <input
            type="password"
            id="password"
            class="w-full px-2 py-1 border rounded-md"
            v-model="vtpPassword"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CirclePlus, RefreshCcw } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { getCarriers, connectCarrier } from '@/api/setting'
import { formatDate } from '@/utils/format'
import { useI18n } from 'vue-i18n'
import Dialog from '@/components/kits/dialog/index.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const vtpUsername = ref('')
const vtpPassword = ref('')
const carrierGeneralInfo = ref([])
const open = ref(false)
const carrier = ref(null)
const connectedCarrier = ref([])
const carriers = [
  {
    value: 'VIETTEL_POST',
    label: 'Viettel Post',
  },
]
const getCustomerCarriers = async () => {
  try {
    const res = await getCarriers()
    if (res.carriers) {
      res.carriers.forEach((carrier) => {
        carrierGeneralInfo.value.push({
          title: carrier.carrier,
          description: 'Partner status',
          active: new Date(carrier.expiredAt) > new Date(),
          icon: '/images/carrier-logos/vtp.png',
          iconClass: 'object-cover w-full h-full scale-110',
          expiredAt: formatDate(carrier.expiredAt),
        })
        connectedCarrier.value.push(carrier.carrier)
      })
    }
  } catch (error) {
    console.log(error)
  }
}

const handleRefresh = async () => {
  console.log('refresh')
}

const handleConnect = async () => {
  if (connectedCarrier.value.includes(carrier.value)) {
    toast.error('Carrier already connected')
    return
  }
  try {
    const res = await connectCarrier({
      carrier: carrier.value,
      username: vtpUsername.value,
      password: vtpPassword.value,
    })
    open.value = false
    getCustomerCarriers()
  } catch (error) {
    console.log(error)
    toast.error(error.response.data.message)
  }
}

onMounted(() => {
  getCustomerCarriers()
})
</script>
