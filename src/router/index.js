import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
    },
  ],
})

// router.beforeEach((to, from, next) => {
//   if (to.name !== 'login' && !useAuthStore().getAccessToken) {
//     next({ name: 'login' })
//   } else {
//     next()
//   }
// })

export default router
