<template>
  <div class="flex items-center pb-4 mb-4 border-b border-gray-200">
    <div class="flex-shrink-0 mr-4">
      <img :src="imageSrc" :alt="altText" class="w-12 h-12 object-cover rounded-full" />
    </div>
    <div class="flex-grow text-sm/loose font-medium">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  imageSrc: string;
  altText: string | null;
}>();
</script>

<style scoped>
/* Add any additional scoped styles here if needed */
</style>