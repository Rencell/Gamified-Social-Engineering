<script setup lang="ts">
defineProps<{
  image?: string
  source?: string
}>()
</script>

<template>
  <div class="relative mb-5 w-full bg-background p-3 rounded-xl">
    <img v-if="image" :src="image" alt="Learning content image" class="w-full rounded-xl animate-in fade-in duration-700" />
    
  </div>
</template>
