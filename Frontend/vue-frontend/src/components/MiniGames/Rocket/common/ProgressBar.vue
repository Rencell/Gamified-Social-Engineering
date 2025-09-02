<script setup lang="ts">
defineProps<{
  progress: number;
}>();
</script>

<template>
  <div class="absolute right-4 top-20 bottom-20 w-5 bg-ternary rounded-full z-10">
    <div
      class="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
      :style="{ height: `${Math.max(0, progress)}%` }"
    ></div>
  </div>
</template>
