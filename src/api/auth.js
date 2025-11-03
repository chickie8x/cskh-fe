import api from './axios'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password })
  const authStore = useAuthStore()
  authStore.setAccessToken(res.data.accessToken)
  return res.data
}

export async function logout() {
  try {
    await api.get('/auth/logout')
    const authStore = useAuthStore()
    authStore.clearAccessToken()
    const notificationStore = useNotificationStore()
    notificationStore.clearNotifications()

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export async function register(email, password) {
  const res = await api.post('/auth/register', { email, password })
  const authStore = useAuthStore()
  authStore.setAccessToken(res.data.accessToken)
  return res.data
}
