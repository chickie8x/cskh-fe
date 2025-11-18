import axios from 'axios'
import { markRaw } from 'vue'

let authStore = null

export const setAuthStore = (store) => {
  authStore = markRaw(store) // tránh Vue proxy
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
})

// ---------- REQUEST ----------
api.interceptors.request.use((config) => {
  if (authStore?.getAccessToken) {
    config.headers.Authorization = `Bearer ${authStore.getAccessToken}`
  }
  return config
})

// ---------- RESPONSE ----------
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config
    if (error.response?.status === 401 && !orig._retry && authStore?.getRefreshToken) {
      orig._retry = true
      try {
        const { data } = await axios.post('http://localhost:3000/api/auth/refresh', {
          refreshToken: authStore.getRefreshToken,
        })

        if (data.success) {
          const { token, refreshToken } = data.data
          authStore.setTokens(token, refreshToken)
          orig.headers.Authorization = `Bearer ${token}`
          return api(orig)
        }
      } catch (e) {
        console.error('Refresh failed', e)
        authStore.clearTokens()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
