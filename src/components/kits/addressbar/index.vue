<template>
  <div
    class="flex items-center gap-2 border border-border rounded-md w-fit px-2 py-1"
    :class="isEditing ? 'bg-white dark:bg-card' : 'bg-gray-50 dark:bg-card'"
  >
    <input
      class="text-sm outline-none border-none"
      v-model="address.address"
      type="text"
      ref="addressInput"
      :disabled="!isEditing"
      :style="{ width: inputWidth }"
    />
    <Button variant="ghost" @click="editAddress" v-if="!isEditing"><Pencil /></Button>
    <Button variant="ghost" @click="cancelEdit" v-if="isEditing"><X /></Button>
    <Button variant="ghost" @click="handleUpdateAddress" v-if="isEditing"><Check /></Button>
    <Button variant="ghost" v-if="!isEditing" @click="handleCopyAddress" :disabled="copyDisabled"
      ><Copy v-if="!isCoppied" /><CheckCheck v-else
    /></Button>
  </div>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Pencil, Copy, Check, CheckCheck, X } from 'lucide-vue-next'
import api from '@/api/axios'
import { toast } from 'vue-sonner'

const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
})

const address = ref(props.address)
const isEditing = ref(false)
const isCoppied = ref(false)
const copyDisabled = ref(false)
const addressInput = ref(null)
const inputWidth = computed(() => {
  return address.value.address.length + 'ch'
})
const handleUpdateAddress = async () => {
  try {
    const res = await api.put('/customer/address', {
      address: address.value.address,
      id: address.value.id,
    })
    if (res.data.success) {
      isEditing.value = false
      toast.success('Update address successfully')
    }
  } catch (error) {
    console.log(error)
    toast.error('Update address failed')
  }
}

const handleCopyAddress = () => {
  navigator.clipboard.writeText(address.value)
  isCoppied.value = true
  copyDisabled.value = true
  setTimeout(() => {
    isCoppied.value = false
    copyDisabled.value = false
  }, 5000)
}
const editAddress = () => {
  isEditing.value = true
  nextTick(() => {
    addressInput.value.focus()
  })
}
const cancelEdit = () => {
  isEditing.value = false
}
</script>
