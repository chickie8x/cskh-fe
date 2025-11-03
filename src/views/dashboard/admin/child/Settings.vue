<template>
  <div class="p-4 flex flex-col gap-4 w-full h-full">
    <h1 class="text-2xl font-bold">Settings</h1>
    <div class="w-full flex flex-col gap-2">
      <h2>Partner Carriers</h2>
      <div class="flex gap-8">
        <Card v-for="stat in ticketGeneralStats" :key="stat.title" class="w-full">
          <div class="flex flex-col gap-4" :class="stat.status !== 'Active' ? 'grayscale-100' : ''">
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
                    stat.status === 'Active'
                      ? 'text-green-500 font-bold bg-green-100 border-green-500 px-2 py-1 rounded-md text-xs'
                      : 'text-red-500 font-bold bg-red-100 border-red-500 px-2 py-1 rounded-md text-xs'
                  "
                  >{{ stat.status }}</span
                >
              </CardDescription>
            </CardHeader>
            <CardContent class="flex items-center justify-between">
              <div class="text-sm">
                <span class="font-bold block">Expired at:</span>
                <span class="block text-muted-foreground">{{ stat.expiredAt }}</span>
              </div>
              <Button
                variant="ghost"
                :disabled="stat.status !== 'Active'"
                @click="handleRefresh(stat)"
                ><RefreshCcw
              /></Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ref, onMounted } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import { RefreshCcw } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { getCarriers } from '@/api/setting'
import { formatDate } from '@/utils/format'

const authStore = useAuthStore()

const ticketGeneralStats = ref({
  VIETTEL_POST: {
    title: 'Viettel Post',
    description: 'Partner status',
    status: 'Active',
    icon: '/images/carrier-logos/vtp.png',
    iconClass: 'object-cover w-full h-full scale-110',
    expiredAt: '',
  },
  GHN: {
    title: 'GHN',
    description: 'Partner status',
    status: 'Inactive',
    icon: '/images/carrier-logos/ghn.png',
    iconClass: 'object-cover w-full h-full scale-110',
    expiredAt: ' ',
  },
  SHOPEE_EXPRESS: {
    title: 'Shopee Express',
    description: 'Partner status',
    status: 'Inactive',
    icon: '/images/carrier-logos/spx.png',
    iconClass: 'object-cover w-full h-full scale-110',
    expiredAt: ' ',
  },
  JT_EXPRESS: {
    title: 'J&T Express',
    description: 'Partner status',
    status: 'Inactive',
    icon: '/images/carrier-logos/jt.png',
    iconClass: 'object-cover w-full h-full scale-110',
    expiredAt: ' ',
  },
})

const fetchPartnerCarriers = async () => {
  const res = await getCarriers('VIETTEL_POST')
  console.log(res)
  ticketGeneralStats.value.VIETTEL_POST.expiredAt = formatDate(res.expiredAt)
}

onMounted(() => {
  fetchPartnerCarriers()
})

const handleRefresh = (stat) => {
  console.log(authStore.getUser.id)
}
</script>
