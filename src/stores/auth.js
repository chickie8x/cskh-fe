import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    userAddress: null,
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

    setTokens(tk, rt) {
      if (tk) {
        this.accessToken = tk
        this.user = this.decodeToken(tk)
      }
      if (rt) {
        this.refreshToken = rt
      }
    },

    clearTokens() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      this.userAddress = null
    },

    setUserAddress(address) {
      this.userAddress = address
    },
  },

  getters: {
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
    getUser: (state) => state.user,
    getUserAddress: (state) => state.userAddress,
  },
})
