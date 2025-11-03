<template>
  <div class="flex items-center justify-center py-4">
    <Button
      variant="ghost"
      :disabled="currentPage === 1 || configs.totalPages === 1"
      @click="handleFirst"
      >First</Button
    >
    <Button variant="ghost" @click="handlePrev" :disabled="currentPage === 1">Prev</Button>
    <div v-for="page in configs.totalPages" :key="page">
      <Button
        v-if="page < currentPage + 3 && page > currentPage - 3"
        variant="ghost"
        :disabled="currentPage === page"
        @click="handlePageChange(page)"
        >{{ page }}</Button
      >
    </div>
    <Button variant="ghost" @click="handleNext" :disabled="currentPage === configs.totalPages"
      >Next</Button
    >
    <Button
      variant="ghost"
      :disabled="currentPage === configs.totalPages || configs.totalPages === 1"
      @click="handlePageLast"
      >Last</Button
    >
  </div>
</template>

<script setup>
import Button from '@/components/ui/button/Button.vue'
import { computed, ref } from 'vue'

const props = defineProps({
  configs: {
    type: Object,
    required: true,
    default: () => {
      return {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      }
    },
  },
})

const emits = defineEmits(['pageChange'])
const currentPage = ref(props.configs.page)

const handleFirst = () => {
  currentPage.value = 1
  emits('pageChange', currentPage.value)
}

const handlePrev = () => {
  currentPage.value -= 1
  emits('pageChange', currentPage.value)
}

const handleNext = () => {
  currentPage.value += 1
  emits('pageChange', currentPage.value)
}

const handlePageChange = (page) => {
  currentPage.value = page
  emits('pageChange', currentPage.value)
}

const handlePageLast = () => {
  currentPage.value = props.configs.totalPages
  emits('pageChange', currentPage.value)
}
</script>
