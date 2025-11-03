import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = () => useAuthStore()

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // include cookies
  timeout: 3000,
})

// Attach token before every request
api.interceptors.request.use((config) => {
  const token = authStore().getAccessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto refresh expired access token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      try {
        const res = await axios.get('/auth/refresh', { withCredentials: true })
        if (res.data.success) {
          authStore().setAccessToken(res.data.token)
          error.config.headers.Authorization = `Bearer ${res.data.token}`
          return api(error.config)
        }
      } catch (refreshError) {
        console.error('Token refresh failed')
      }
    }
    return Promise.reject(error)
  },
)

export default api
