<script setup lang="ts">
defineProps<{
  image?: string
  source?: string
}>()
</script>

<template>
  <div class="relative h-40 mb-2">
    <img v-if="image" :src="image" alt="Learning content image" class="h-full rounded-lg mb-2" />
    <!-- <i class="text-xs absolute right-0 bottom-3 p-4 bg-black/50 rounded-s-full">(Image Source: <span>{{ source }}</span>)</i>  -->
  </div>
</template>
