<script setup lang="ts">
import { X } from 'lucide-vue-next';
import image from "/Popup/vishing_popup.webp"
import { Button } from '@/components/ui/button';
defineOptions({ name: 'PopupType1' })

const emit = defineEmits(['close-action', 'click-action'])

function onClose() {
  emit('close-action')
}

function onClick() {
  emit('click-action')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-xl border-gray-300 border-1 p-6 max-w-sm w-sm mx-14 relative font-display motion-preset-fade">
      <div class="w-full flex justify-center"><img :src="image" alt="Popup illustration" class="mb-4 w-60 rounded-md" /></div>
      <!-- Close Button -->
      <button
        @click="onClose"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X :size="24" />
      </button>

      <!-- Content -->
      <div class="pt-4">
        <!-- Title -->
        <h2 class="text-sm font-semibold text-gray-800 mb-3">
          Did you mean gohighlevel.com?
        </h2>
        <!-- Description -->
        <p class="text-sm text-gray-600 mb-4">
          Website sometimes pretend to be legitimate. Please confirm you see changes to the web address.
        </p>
      </div>

      <!-- Action Button -->
      <div class="flex justify-end mt-6">
        <Button
          @click="onClick"
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          Yes, continue
        </Button>
      </div>
  </div>
</template>