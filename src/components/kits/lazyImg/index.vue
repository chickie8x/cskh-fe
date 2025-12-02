<template>
  <div
    class="relative overflow-hidden bg-gray-200 flex items-center justify-center"
    :style="{ width, height }"
  >
    <!-- Loading Spinner -->
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center"
    >
      <span class="loader"></span>
    </div>

    <!-- Image -->
     <a :href="src" target="_blank">
         <img
           v-if="showImage"
           :src="src"
           :alt="alt"
           loading="lazy"
           @load="onLoad"
           @error="onError"
           class="w-full h-full object-cover transition-opacity duration-300 cursor-pointer hover:opacity-70"
           :class="isLoading ? 'opacity-0' : 'opacity-100'"
         />
     </a>

    <!-- Error fallback -->
    <div
      v-if="isError"
      class="text-gray-500 text-sm absolute inset-0 flex items-center justify-center"
    >
      Failed to load image
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  width: { type: String, default: '200px' },
  height: { type: String, default: '200px' },
})

const isLoading = ref(true)
const isError = ref(false)
const showImage = ref(true)

const onLoad = () => {
  isLoading.value = false
}

const onError = () => {
  isLoading.value = false
  isError.value = true
  showImage.value = false
}
</script>

<style>
/* spinner */
.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #ddd;
  border-top-color: #4ade80;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
