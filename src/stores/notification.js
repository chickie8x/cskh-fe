import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
  }),

  actions: {
    setNotifications(notifications) {
      this.notifications = notifications
    },
    addNotification(notification) {
      this.notifications.push(notification)
    },
    clearNotifications() {
      this.notifications = []
    },
  },

  getters: {
    getNotifications: (state) => state.notifications,
  },
})
