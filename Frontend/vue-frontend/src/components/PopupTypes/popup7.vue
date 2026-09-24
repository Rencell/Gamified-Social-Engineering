<template>
    <div class="relative flex items-center w-fit bg-gray-100/90 rounded-2xl p-3 shadow-md m-4">
      
      <!-- Icon -->
      <img
        src="https://brandlogos.net/wp-content/uploads/2024/01/gcash-logo_brandlogos.net_kiaqh.png"
        alt="icon"
        class="w-12 h-12 rounded-lg object-contain mr-3"
      />
  
      <!-- Text Content -->
      <div class="flex-1 overflow-hidden">
        <div class="font-semibold text-gray-800 text-base">
          Gcash warning
        </div>
  
        <div class="text-sm text-gray-600 truncate">
          It seems your gcash account is not linked. Please link...
        </div>
        <div class="text-sm text-green-600 truncate cursor-pointer" @click="onClick">
          Click here
        </div>
      </div>
  
      <!-- Close Button -->
      <button
        @click="onClose"
        class="text-gray-500 text-xl ml-3 hover:text-gray-700"
      >
        ✕
      </button>
    </div>
  </template>

<script setup lang="ts">
defineOptions({ name: 'PopupType7' })

const emit = defineEmits(['close-action', 'click-action'])

function onClose() {
  emit('close-action')
}

function onClick() {
  emit('click-action')
}
</script>
