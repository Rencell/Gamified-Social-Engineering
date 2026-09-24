<template>
 
 <div class="relative flex items-center justify-center">
    <div class="rounded-full border-4 animate-spin " :class="[
      colorClass,
      sizeClass
    ]">
    </div>
    <div class="absolute font-bold text-2xl">{{text}}</div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'default' | 'white',
  size?: 'sm' | 'lg' | 'xl'
  text?: string
}>()

const colorClass = computed(() => {
  return props.variant === 'white' ? 'border-t-white border-white/30' : 'border-t-accent border-accent/30'
})


const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4'
    case 'lg':
      return 'h-12 w-12'
    case 'xl':
      return 'h-16 w-16'
    default:
      return 'h-8 w-8'
  }
})
</script>
