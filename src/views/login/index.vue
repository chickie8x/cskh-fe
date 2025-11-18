<template>
  <div class="w-full h-screen flex items-center">
    <div class="w-1/2 h-full flex items-center justify-center">
      <LoginForm />
    </div>
    <div class="w-1/2 h-full relative">
      <img src="/images/login-splash.avif" alt="" class="w-full h-full object-cover" />
      <div class="w-full h-full bg-black/70 absolute inset-0">
        <div class="w-full h-full flex flex-col items-center justify-center">
          <h1 class="text-xl font-bold text-white">Logistics Tracking Dashboard</h1>
          <span class="text-white block mx-auto max-w-[500px] mt-4"
            >Streamline your logistics operations with real-time tracking, analytics, and
            comprehensive fleet management</span
          >
          <div>
            <div class="flex items-center gap-4 text-white mt-8">
              <ChartLine class="w-16 h-16 p-2 rounded-md bg-white/30" />
              <div class="flex flex-col gap-2">
                <span class="text-xl">Delivery analytics</span>
                <span>Comprehensive reports and insights to improve performance</span>
              </div>
            </div>
            <div class="flex items-center gap-4 text-white mt-4">
              <MapPin class="w-16 h-16 p-2 rounded-md bg-white/30" />
              <div class="flex flex-col gap-2">
                <span class="text-xl">Route optimization</span>
                <span>Smart routing algorithms to reduce costs and delivery times</span>
              </div>
            </div>
            <div class="flex items-center gap-4 text-white mt-4">
              <Truck class="w-16 h-16 p-2 rounded-md bg-white/30" />
              <div class="flex flex-col gap-2">
                <span class="text-xl">Real-time Tracking</span>
                <span>Monitor your entire fleet with live GPS tracking and status updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChartLine, MapPin, Truck } from 'lucide-vue-next'
import LoginForm from '@/components/kits/login-form/index.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (!authStore.getAccessToken) {
    try {
      const res = await api.post('/auth/refresh', {
        refreshToken: authStore.getRefreshToken,
      })
      authStore.setTokens(res.data.token, res.data.refreshToken)
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  } else {
    router.push('/')
  }
})
</script>
