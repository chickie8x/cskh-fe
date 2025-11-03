<template>
  <div class="p-4 flex flex-col gap-4 bg-gray-100 dark:bg-background">
    <div class="flex justify-between gap-1">
      <div>
        <h1 class="text-2xl font-bold">{{ t('createOrder') }}</h1>
        <span class="text-sm text-muted-foreground">{{ t('createOrderDescription') }}</span>
      </div>
      <div class="flex gap-4">
        <div v-for="carrier in carriers" :key="carrier.id">
          <label
            :for="carrier.value"
            class="flex items-center justify-center cursor-pointer min-w-24"
            :class="[currCarrier === carrier.value ? '' : 'grayscale-100 opacity-50']"
          >
            <input
              class="hidden peer"
              type="radio"
              name="carrier"
              :id="carrier.value"
              :value="carrier.value"
              v-model="currCarrier"
              :disabled="carrier.value !== 'vtp'"
            />
            <span
              class="text-center block min-w-24 px-2 py-1 bg-gray-200 rounded-md border border-border dark:bg-background"
              >{{ carrier.name }}</span
            >
          </label>
        </div>
      </div>
    </div>

    <div class="flex gap-4 h-full w-full">
      <div class="w-full">
        <component :is="currCarrier === 'vtp' ? ViettelPost : GHN"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ViettelPost from '@/components/kits/carriers/viettelpost/createOrder.vue'
import GHN from '@/components/kits/carriers/ghn/createOrder.vue'

const { t } = useI18n()

const carriers = ref([
  {
    id: 1,
    name: 'VIETTELPOST',
    value: 'vtp',
    img: '/images/carrier-logos/vtp.png',
  },
  {
    id: 2,
    name: 'GHN',
    value: 'ghn',
    img: '/images/carrier-logos/ghn.png',
  },
])

const currCarrier = ref(carriers.value[0].value)
</script>
