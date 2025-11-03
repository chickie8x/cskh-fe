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
import Dashboard from '@/views/dashboard/customer/child/Dashboard.vue'
import Tickets from '@/views/dashboard/customer/child/Tickets.vue'
import Shipments from '@/views/dashboard/customer/child/Shipments.vue'
import Settings from '@/views/dashboard/customer/child/Settings.vue'
import LookUp from '@/views/dashboard/customer/child/LookUp.vue'
import { ref } from 'vue'

const components = {
  Dashboard: Dashboard,
  Tickets: Tickets,
  Shipments: Shipments,
  Settings: Settings,
  LookUp: LookUp,
}
const currComponent = ref('Dashboard')

const menuClick = (componentName, id) => {
  currComponent.value = componentName
}
</script>
