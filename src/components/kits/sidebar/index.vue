<template>
  <div
    :class="showSidebarText ? 'w-64' : ''"
    class="bg-sidebar h-full border-r border-sidebar-border p-4 relative"
  >
    <div>
      <div v-for="item in sidebarItems" :key="item.id">
        <div
          v-if="item.visible"
          @click="menuClick(item.componentName, item.id)"
          class="flex items-center gap-2 h-12 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 opacity-70 hover:opacity-100"
          :class="
            item.id === currId
              ? '!bg-gray-300 opacity-100 dark:!bg-gray-700 dark:hover:bg-gray-800 dark:hover:opacity-100'
              : ''
          "
        >
          <component :is="item.icon" />
          <span v-if="showSidebarText" class="select-none">{{ item.componentName }}</span>
        </div>
      </div>
    </div>
    <div>
      <Button variant="ghost" @click="toggleSidebarText" class="absolute bottom-4 right-4">
        <component :is="showSidebarText ? ChevronsLeft : ChevronsRight" class="size-6" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Ticket,
  Settings,
  MapPin,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import Button from '@/components/ui/button/Button.vue'

const emit = defineEmits(['sidebar-item-click'])

const showSidebarText = ref(false)
const currId = ref(1)
const authStore = useAuthStore()

const toggleSidebarText = () => {
  showSidebarText.value = !showSidebarText.value
}

const sidebarItems = ref([
  {
    id: 1,
    icon: LayoutDashboard,
    componentName: 'Dashboard',
    visible: true,
  },
  {
    id: 2,
    icon: Package,
    componentName: 'Shipments',
    visible: true,
  },
  {
    id: 3,
    icon: Ticket,
    componentName: 'Tickets',
    visible: true,
  },
  {
    id: 4,
    icon: FileText,
    componentName: 'Logs',
    visible: computed(() => {
      if (authStore.getUser?.role === 'ADMIN') {
        return true
      }
      return false
    }),
  },
  {
    id: 5,
    icon: Users,
    componentName: 'Users',
    visible: computed(() => {
      if (authStore.getUser?.role === 'ADMIN') {
        return true
      }
      return false
    }),
  },
  {
    id: 6,
    icon: MapPin,
    componentName: 'LookUp',
    visible: true,
  },
  {
    id: 7,
    icon: Settings,
    componentName: 'Settings',
    visible: true,
  },
])

const menuClick = (componentName, id) => {
  emit('sidebar-item-click', componentName, id)
  currId.value = id
}
</script>
