import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n'

import App from './App.vue'
import router from './router'
import api, { setAuthStore } from '@/api/axios'          // <-- import api
import { useAuthStore } from '@/stores/auth'      // <-- import store

const app = createApp(App)
const pinia = createPinia()

// ---------- Persist plugin ----------
pinia.use(({ store }) => {
  const key = `pinia_${store.$id}`
  const saved = localStorage.getItem(key)
  if (saved) store.$patch(JSON.parse(saved))

  store.$subscribe((_, state) => {
    localStorage.setItem(key, JSON.stringify(state))
  })
})

// ---------- Install ----------
app.use(pinia)          // <-- Pinia phải được mount trước
app.use(router)
app.use(i18n)

// ---------- Inject store vào api ----------
setAuthStore(useAuthStore())   // <-- bây giờ Pinia đã active

app.mount('#app')