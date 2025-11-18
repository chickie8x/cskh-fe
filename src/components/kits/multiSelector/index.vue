<template>
  <div class="order-status-filter">
    <div class="relative">
      <div
        class="flex flex-wrap gap-1 p-2 border rounded-md min-h-10 bg-white shadow-sm"
        :class="[
          selectedLabels.length ? 'border-blue-500' : 'border-gray-300',
          isDisabled ? 'opacity-50' : '',
        ]"
      >
        <!-- Selected Tags -->
        <div
          v-for="label in selectedLabels"
          :key="label"
          class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md"
          :class="ORDER_STATUS_DETAIL[label]?.color"
        >
          {{ label }}
          <button
            @click="selectedLabels = selectedLabels.filter((l) => l !== label)"
            class="ml-1 text-gray-500 hover:text-gray-700"
          >
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        <!-- Input để mở dropdown -->
        <input
          type="text"
          :disabled="isDisabled"
          @focus="showDropdown = true"
          @blur="closeDropdown"
          placeholder="Tìm trạng thái..."
          class="flex-1 min-w-32 outline-none text-sm"
          :class="selectedLabels.length ? '' : 'text-gray-500'"
        />
      </div>

      <!-- Dropdown -->
      <div
        v-if="showDropdown"
        class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-auto"
      >
        <div
          v-for="label in labelOptions"
          :key="label"
          @mousedown.prevent="toggleLabel(label)"
          class="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
        >
          <span class="text-sm">{{ label }}</span>
          <span
            v-if="selectedLabels.includes(label)"
            class="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-500"
          ></span>
          <span v-else class="w-4 h-4 rounded-full border-2 border-gray-300"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ORDER_STATUS_DETAIL, filterOrdersByLabels } from '@/utils/helper' // điều chỉnh đường dẫn

// Props
const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['updateFilter'])

// State
const selectedLabels = ref([])
const showDropdown = ref(false)

const toggleLabel = (label) => {
  const index = selectedLabels.value.indexOf(label)
  if (index === -1) {
    selectedLabels.value.push(label)
  } else {
    selectedLabels.value.splice(index, 1)
  }
}

const closeDropdown = () => {
  setTimeout(() => (showDropdown.value = false), 200)
}

// Emit khi thay đổi
watch(
  selectedLabels,
  (newVal) => {
    emit('updateFilter', newVal)
  },
  { deep: true },
)

// Danh sách tùy chọn
const labelOptions = Object.keys(ORDER_STATUS_DETAIL)

const resetState = () => {
  selectedLabels.value = []
}

defineExpose({ resetState })
</script>
