<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  image?: string
  source?: string
}>()

const fullscreen = ref(false);

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};
</script>

<template>
  <div
    v-if="fullscreen"
    class="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    @click="toggleFullscreen"
  >
    <img :src="image" alt="Fullscreen image" class="max-w-full max-h-full object-contain" />
  </div>
  <div class="relative mb-5 w-full h-100 sm:h-auto bg-background p-3 rounded-xl">
    <img v-if="image" :src="image" alt="Learning content image" class="w-full h-full object-cover rounded-xl" @click="toggleFullscreen" />
    
  </div>

</template>

<style scoped>
/* Disable transitions for the fullscreen div */
.fixed {
  transition: none !important;
}
</style>