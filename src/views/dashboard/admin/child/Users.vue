<template>
  <div class="flex flex-col h-full p-4 gap-4">
    <h1
      @click="console.log(totalUsersCount)"
      class="font-bold text-2xl text-gray-600 dark:text-gray-400"
    >
      Users
    </h1>
    <div class="flex gap-8">
      <Card v-for="stat in userGeneralStats" :key="stat.title" class="w-full">
        <component :is="stat.icon" :class="stat.iconClass" />
        <CardHeader>
          <CardTitle>{{ stat.title }}</CardTitle>
          <CardDescription>{{ stat.description }}</CardDescription>
        </CardHeader>
        <CardContent>
          <span :class="stat.statsClass">{{ stat.count }}</span>
        </CardContent>
      </Card>
    </div>
    <div class="flex items-center gap-8 border border-border p-6 rounded-md">
      <div class="relative w-full max-w-sm items-center">
        <Input v-model="search" id="search" type="text" placeholder="Search..." class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
      <div>
        <Select v-model="role">
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="null">All</SelectItem>
            <SelectItem v-for="role in roles" :key="role" :value="role">{{ role }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select v-model="status">
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="null">All</SelectItem>
            <SelectItem v-for="status in statuses" :key="status" :value="status">{{
              status
            }}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button @click="fetchUsers">Search</Button>
    </div>
    <div>
      <Table
        :tbHeader="tbHeader"
        :data="users"
        :styling="styling"
        @actionDelete="handleDeleteUser"
        @actionEdit="handleOpenDialog"
      />
    </div>
    <div>
      <Pagination :configs="paginationConfig" @pageChange="handlePageChange" />
    </div>
    <Dialog
      :open="open"
      :title="'Edit User'"
      :description="'Change only role and status of user'"
      @submit="handleEditUser"
      @close="open = false"
    >
      <template #content>
        <div>
          <span
            >Name: <span class="font-bold">{{ selectedUser.name }}</span></span
          >
        </div>
        <div class="flex items-center gap-4">
          <div>
            <Label for="role">Role</Label>
            <Select v-model="selectedUser.role">
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="role in roles" :key="role" :value="role">{{ role }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label for="status">Status</Label>
            <Select v-model="selectedUser.status">
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="status in statuses" :key="status" :value="status">{{
                  status
                }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Table from '@/components/kits/table/index.vue'
import { onMounted, ref, computed } from 'vue'
import { getUsers } from '@/api/user'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User, Shield, UserCheck, UserPlus, Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/kits/pagination/index.vue'
import { formatDate } from '@/utils/format'
import { DEFAULT_PAGE, DEFAULT_LIMIT, DEFAULT_ROLE, DEFAULT_STATUS } from '@/utils/config'
import { deleteUser, editUser } from '@/api/user'
import { toast } from 'vue-sonner'
import Dialog from '@/components/kits/dialog/index.vue'
import { USER_TABLE_HEADER } from '@/utils/config'

const allUserCount = ref(0)
const users = ref([])
const open = ref(false)

//top card info
const totalUsersCount = ref(0)
const activeUsersCount = ref(0)
const adminUsersCount = ref(0)
const newUsersCount = ref(0)

const userGeneralStats = ref([
  {
    title: 'All Users',
    description: 'All users in the system',
    count: computed(() => totalUsersCount.value),
    icon: User,
    iconClass:
      'w-10 h-10 mx-auto text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full p-2',
    statsClass: 'text-blue-600 dark:text-blue-400 text-2xl font-bold',
  },
  {
    title: 'Admin',
    description: 'Admin users in the system',
    count: computed(() => adminUsersCount.value),
    icon: Shield,
    iconClass:
      'w-10 h-10 mx-auto text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900 rounded-full p-2',
    statsClass: 'text-amber-600 dark:text-amber-400 text-2xl font-bold',
  },
  {
    title: 'Active Users',
    description: 'All active users in the system',
    count: computed(() => activeUsersCount.value),
    icon: UserCheck,
    iconClass:
      'w-10 h-10 mx-auto text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900 rounded-full p-2',
    statsClass: 'text-emerald-600 dark:text-emerald-400 text-2xl font-bold',
  },
  {
    title: 'New Users',
    description: 'Recently registered users',
    count: computed(() => newUsersCount.value),
    icon: UserPlus,
    iconClass:
      'w-10 h-10 mx-auto text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900 rounded-full p-2',
    statsClass: 'text-violet-600 dark:text-violet-400 text-2xl font-bold',
  },
])

const styling = ref({
  email: {
    colName: 'email',
    classFn: (col) => {
      return 'font-bold'
    },
    valueFn: (col) => {
      return col.email
    },
  },
  createdAt: {
    colName: 'createdAt',
    classFn: (col) => {
      return ''
    },
    valueFn: (col) => {
      return formatDate(col.createdAt)
    },
  },
})

const page = ref(DEFAULT_PAGE)
const limit = ref(DEFAULT_LIMIT)
const role = ref(DEFAULT_ROLE)
const status = ref(DEFAULT_STATUS)
const search = ref(null)
const selectedUser = ref({})
const tbHeader = ref(USER_TABLE_HEADER)

const query = ref({
  search,
  page,
  limit,
  role,
  status,
})
const paginationConfig = ref({
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
})

const roles = ref([])
const statuses = ref([])

const fetchUsers = async () => {
  try {
    const data = await getUsers(query.value)
    page.value = data.pagination
    roles.value = data.role
    statuses.value = data.status
    users.value = data.users
    paginationConfig.value = data.pagination
    totalUsersCount.value = data.countAll
    activeUsersCount.value = data.countAll - 2
    adminUsersCount.value = 1
    newUsersCount.value = 2
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

const handlePageChange = (page) => {
  query.value.page = page
  fetchUsers()
}

const handleDeleteUser = async (row) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    const res = await deleteUser(row.id)
    if (res.success) {
      toast.success('User deleted successfully')
      users.value = users.value.filter((user) => user.id !== row.id)
    } else {
      toast.error('Failed to delete user')
    }
  } else {
    return
  }
}

const handleOpenDialog = (row) => {
  selectedUser.value = { ...row }
  open.value = true
}

const handleEditUser = async () => {
  const data = {
    userId: selectedUser.value.id,
    role: selectedUser.value.role,
    status: selectedUser.value.status,
  }
  const res = await editUser(data)
  console.log(res)
  if (res.success) {
    users.value.forEach((user) => {
      if (user.id === selectedUser.value.id) {
        user.role = selectedUser.value.role
        user.status = selectedUser.value.status
      }
    })
    toast.success('User updated successfully')
    open.value = false
  } else {
    toast.error('Failed to update user')
  }
}

onMounted(async () => {
  fetchUsers()
})
</script>
