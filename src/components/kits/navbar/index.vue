<template>
  <div v-if="showNavbar" class="h-16 flex items-center border-b border-border shadow-sm">
    <div class="flex items-center justify-between w-full px-8 mx-auto">
      <div class="flex items-center gap-2">
        <Warehouse />
        Centralized Management
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <img v-if="selectedLanguage.value === 'vi'" src="/images/flags/vn.svg" alt="vn" />
          <img v-else src="/images/flags/zh.svg" alt="zh" />
          <Select v-model="selectedLanguage.value">
            <SelectTrigger>
              <SelectValue :placeholder="selectedLanguage.label" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Language</SelectLabel>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="flex items-center gap-1 border border-border rounded-md p-2 shadow-sm">
          <Sun class="w-5 h-5" :class="[isDark ? 'opacity-50' : 'opacity-100']" />
          <Switch v-model="isDark" @click="toggleDark" />
          <Moon class="w-5 h-5" :class="[isDark ? 'opacity-100' : 'opacity-50']" />
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                class="relative select-none focus:bg-accent active:bg-accent/80"
              >
                <Bell class="size-5 opacity-50 hover:opacity-100 cursor-pointer" />
                <div
                  v-if="haveUnreadNotication"
                  class="w-2 h-2 bg-red-500 rounded-full absolute top-2 right-3"
                ></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="max-w-96 h-96 overflow-y-auto space-y-2 relative">
              <div
                class="flex items-center justify-between p-2 border-b border-border sticky -top-1 left-0 bg-background z-10"
              >
                <span class="font-semibold">Notifications</span>
                <span class="text-xs text-gray-600 dark:text-gray-400 underline cursor-pointer"
                  >Mark all as read</span
                >
              </div>
              <div v-for="item in notificationList" :key="item.id">
                <DropdownMenuItem :class="!item.isRead ? 'opacity-100 bg-accent' : 'opacity-50'">
                  <div class="min-w-64 flex flex-col gap-1 p-2">
                    <span class="font-semibold flex items-center gap-2"
                      ><MailPlus v-if="!item.isRead" class="size-4" /><MailOpen
                        v-else
                        class="size-4"
                      />{{ item.title }}</span
                    >
                    <span class="text-sm">{{ item.message }}</span>
                    <span class="text-xs text-gray-500 ml-auto">{{
                      formatDateTime(item.createdAt)
                    }}</span>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div class="relative select-none">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                class="relative select-none focus:bg-accent active:bg-accent/80 flex items-center gap-2"
              >
                <User
                  class="size-5 opacity-50 hover:opacity-100 hover:border border-border rounded-full shadow-sm cursor-pointer"
                />
                {{ user?.name || '' }}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem v-for="item in userMenu" :key="item.name">
                <Button variant="ghost" @click="item.action()" class="w-full h-full">{{
                  item.name
                }}</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Switch from '@/components/ui/switch/Switch.vue'
import { Moon, Sun, Bell, User, Warehouse, MailPlus, MailOpen } from 'lucide-vue-next'
import { useDark } from '@vueuse/core'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Button from '@/components/ui/button/Button.vue'
import { logout } from '@/api/auth'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { formatDateTime } from '@/utils/format'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notification'
import { getNotifications } from '@/api/notification'

const { locale } = useI18n()
const authStore = useAuthStore()
const user = authStore.getUser
const router = useRouter()
const route = useRoute()
const showNavbar = computed(() => route.name !== 'login')
const languages = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'zh', label: '中文' },
]
const selectedLanguage = ref(languages[0])
const temp = computed(() => selectedLanguage.value.value)
watch(temp, (newLang) => {
  locale.value = newLang
})
const isDark = useDark()
const toggleDark = () => {
  isDark.value = !isDark.value
}

const userMenu = ref([
  {
    name: 'Profile',
    action: () => {
      // router.push('/profile')
    },
  },
  {
    name: 'Settings',
    action: () => {
      // router.push('/settings')
    },
  },
  {
    name: 'Logout',
    action: async () => {
      const res = await logout()
      if (res) {
        setTimeout(() => {
          router.push('/login')
        }, 300)
      } else {
        console.log('Logout failed')
      }
    },
  },
])

const notificationStore = useNotificationStore()

// Use computed to reactively track store changes
const notificationList = computed(() => notificationStore.getNotifications)

const haveUnreadNotication = computed(() =>
  notificationList.value.some((notification) => notification.isRead === false),
)

onMounted(async () => {
  const notificationData = await getNotifications()
  if (notificationData && notificationData.success) {
    notificationStore.setNotifications(notificationData.data || [])
  }
})

onUnmounted(() => {})
</script>
