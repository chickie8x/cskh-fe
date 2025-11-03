import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(({ store }) => {
  // 1. F5 → tự đọc từ localStorage
  const saved = localStorage.getItem(`pinia_${store.$id}`)
  if (saved) store.$patch(JSON.parse(saved))

  // 2. Mỗi lần store thay đổi → tự lưu
  store.$subscribe((_, state) => {
    localStorage.setItem(`pinia_${store.$id}`, JSON.stringify(state))
  })
})

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
