<template>
  <Dialog :open="open" :hideClose="true">
    <DialogContent
      class="[&>button.absolute.top-4.right-4]:hidden bg-gray-100 dark:bg-background"
      :class="styling"
    >
      <DialogTrigger> </DialogTrigger>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          {{ description }}
        </DialogDescription>
      </DialogHeader>

      <slot name="content" />

      <DialogFooter>
        <DialogClose as-child>
          <Button @click="emit('close')" :variant="cancelBtnVariant">{{ cancelText }}</Button>
        </DialogClose>

        <Button v-if="btnSubmitShow" @click="emit('submit')" :variant="submitBtnVariant">{{
          submitText
        }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import { ref } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Edit Dialog',
  },
  description: {
    type: String,
    default: "Make changes to your object here. Click save when you're done.",
  },
  submitText: {
    type: String,
    default: 'Save changes',
  },
  cancelText: {
    type: String,
    default: 'Cancel',
  },
  styling: {
    type: String,
    default: 'sm:max-w-[425px]',
  },
  btnSubmitShow: {
    type: Boolean,
    default: true,
  },
  cancelBtnVariant: {
    type: String,
    default: 'outline',
  },
  submitBtnVariant: {
    type: String,
    default: 'default',
  },
})

const emit = defineEmits(['submit', 'close'])
</script>
