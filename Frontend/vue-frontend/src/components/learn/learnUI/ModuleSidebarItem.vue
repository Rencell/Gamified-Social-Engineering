<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';

defineProps({
  active: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="text-sm flex gap-2 items-center mt-6 cursor-pointer">
    <span>
      <svg width="16" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="1" style="overflow: initial;">
        <circle cx="8" cy="8" r="7.25" class="stroke-1 stroke-secondary-foreground"></circle>
        <path v-if="completed" d="M5 6L8 9L16 1" class="stroke-green-500" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </span>
    <span class="font-medium hover:text-accent/40" :class="active ? 'text-accent' : 'text-secondary-foreground'">
      <slot></slot>
    </span>
    <span v-if="active">
      <ChevronRight :class="active ? 'text-accent' : 'text-secondary-foreground'"></ChevronRight>
    </span>
  </div>
</template>
