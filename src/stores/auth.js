import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshRun: false,
    user: null,
  }),

  actions: {
    decodeToken(token) {
      try {
        const decoded = jwtDecode(token)
        return decoded
      } catch (error) {
        console.error('Invalid token:', error)
        return null
      }
    },

    setAccessToken(token) {
      if (token) {
        this.accessToken = token
        this.user = this.decodeToken(token)
      }
    },

    clearAccessToken() {
      this.accessToken = null
      this.user = null
    },

    setRefreshRun(run) {
      this.refreshRun = run
    },
  },

  getters: {
    getAccessToken: (state) => state.accessToken,
    getRefreshRun: (state) => state.refreshRun,
    getUser: (state) => state.user,
  },
})
