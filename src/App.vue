<template>
  <div class="h-screen">
    <router-view />
    <Toaster
      position="top-right"
      rich-colors
      :theme="toastTheme"
      expand
      :close-button="true"
      :toast-options="{
        duration: 5000,
        style: {
          top: '40px',
        },
      }"
    />
  </div>
</template>

<script setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
import { useDark, useEventSource } from '@vueuse/core'
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { getNotifications } from '@/api/notification'
import { SSE_URL } from '@/utils/config'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()

const { t } = useI18n()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const isDark = useDark()
const toastTheme = computed(() => {
  return isDark.value ? 'dark' : 'light'
})

// Computed user that reactively updates when auth state changes
const user = computed(() => authStore.getUser)

// SSE connection refs
let sseClose = null

// Watch for user changes and initialize SSE when user becomes available
watch(
  user,
  (newUser) => {
    if (newUser?.id && !sseClose) {
      // Initialize SSE connection when user is available
      const { data, close } = useEventSource(`${SSE_URL}/${newUser.id}`, [], {
        autoReconnect: true,
        serializer: {
          read: (rawData) => JSON.parse(rawData),
        },
      })

      sseClose = close

      // Watch for SSE data
      watch(data, async (newData) => {
        try {
          if (newData) {
            toast.info(t(newData.message), {
              duration: 5000,
            })
            // Refresh notifications when new data arrives
            const notificationData = await getNotifications()
            if (notificationData && notificationData.success) {
              notificationStore.setNotifications(notificationData.data || [])
            }
          }
        } catch (error) {
          console.log(error)
        }
      })
    }
  },
  { immediate: true },
)

onMounted(async () => {
  const token = authStore.getAccessToken
  if (!token) {
    console.log('app run')
    try {
      const res = await api.post('/auth/refresh', {
        refreshToken: authStore.getRefreshToken,
      })
      authStore.setTokens(res.data.token, res.data.refreshToken)
    } catch (error) {
      console.log(error)
      router.push('/login')
    }
  }
  const address = authStore.getUserAddress
  if (!address) {
    try {
      const data = await api.get('/customer/address')
      authStore.setUserAddress(data.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  // Initialize and fetch notifications
  try {
    const notificationData = await getNotifications()
    if (notificationData && notificationData.success) {
      notificationStore.setNotifications(notificationData.data || [])
    }
  } catch (error) {
    console.log('Failed to fetch notifications:', error)
  }
})

onUnmounted(() => {
  if (sseClose) {
    sseClose()
  }
})
</script>
