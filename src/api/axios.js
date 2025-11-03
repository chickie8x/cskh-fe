import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const authStore = () => useAuthStore()

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://14.225.1.34/api',
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
    if (error.response?.status === 401 && !error.config._retry && authStore().getRefreshToken) {
      error.config._retry = true
      try {
        const res = await api.post('http://14.225.1.34/api/auth/refresh',{
          refreshToken: authStore().getRefreshToken
        })
        console.log(res.data)
        if (res.data.success) {
          authStore().setTokens(res.data.token, res.data.refreshToken)
          console.log(res.data.token)
          error.config.headers.Authorization = `Bearer ${res.data.token}`
          return api(error.config)
        }
      } catch (refreshError) {
        console.error('Token refresh failed')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
