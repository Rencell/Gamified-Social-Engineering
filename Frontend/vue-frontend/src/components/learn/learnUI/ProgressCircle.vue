<template>
    <div :class="['relative flex items-center justify-center', sizeClass]">
      <!-- Background circle -->
      <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
        <circle
          class="stroke-current text-gray-300 dark:text-white/20"
          stroke-width="4"
          fill="none"
          cx="18"
          cy="18"
          r="16"
        />
      </svg>
  
      <!-- Progress circle -->
      <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
        <circle
          class="stroke-current text-blue-500 dark:text-white transition-all duration-300"
          stroke-width="4"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
          fill="none"
          cx="18"
          cy="18"
          r="16"
          transform="rotate(-90 18 18)"
        />
      </svg>
  
      <!-- Center Text -->
      <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-medium text-slate-800 dark:text-white">
        {{ progress }}%
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    progress: number // percent (0–100)
    size?: 'sm' | 'md' | 'lg'
  }
  
  const props = defineProps<Props>()
  
  const radius = 16
  const circumference = 2 * Math.PI * radius
  
  const dashOffset = computed(() => {
    return circumference - (props.progress / 100) * circumference
  })
  
  const sizeClass = computed(() => {
    switch (props.size) {
      case 'sm':
        return 'w-6 h-6'
      case 'lg':
        return 'w-12 h-12'
      default:
        return 'w-8 h-8'
    }
  })
  </script>
  