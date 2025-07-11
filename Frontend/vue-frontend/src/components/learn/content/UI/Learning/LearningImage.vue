<script setup lang="ts">
defineProps<{
  image?: string
  source?: string
}>()
</script>

<template>
  <div>
    <img v-if="image" :src="image" alt="Learning content image" class="h-96 rounded-lg shadow-md mb-6" />
    <i>(Image Source :<span>{{ source }}</span>)</i> 
  </div>
</template>
