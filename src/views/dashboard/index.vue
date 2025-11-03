<template>
  <div>
    <component :is="components()" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminDashboard from './admin/index.vue'
import CustomerDashboard from './customer/index.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const components = () => {
  if (
    authStore.getUser?.role === 'ADMIN' ||
    authStore.getUser?.role === 'CS_LEAD' ||
    authStore.getUser?.role === 'CS_STAFF'
  ) {
    return AdminDashboard
  } else {
    return CustomerDashboard
  }
}
</script>
