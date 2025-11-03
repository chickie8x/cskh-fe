<template>
  <div class="flex flex-col h-full">
    <div>
      <Navbar />
    </div>
    <div class="flex h-[calc(100vh-4rem)]">
      <Sidebar @sidebar-item-click="menuClick" />
      <div class="flex-1 h-[calc(100vh-4rem)] overflow-auto">
        <KeepAlive>
          <component :is="components[currComponent]"></component>
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/kits/sidebar/index.vue'
import Navbar from '@/components/kits/navbar/index.vue'
import Dashboard from '@/views/dashboard/admin/child/Dashboard.vue'
import Tickets from '@/views/dashboard/admin/child/Tickets.vue'
import Shipments from '@/views/dashboard/admin/child/Shipments.vue'
import Logs from '@/views/dashboard/admin/child/Logs.vue'
import Users from '@/views/dashboard/admin/child/Users.vue'
import Settings from '@/views/dashboard/admin/child/Settings.vue'
import { ref } from 'vue'

const components = {
  Dashboard: Dashboard,
  Tickets: Tickets,
  Shipments: Shipments,
  Logs: Logs,
  Users: Users,
  Settings: Settings,
}
const currComponent = ref('Dashboard')

const menuClick = (componentName, id) => {
  currComponent.value = componentName
}
</script>
