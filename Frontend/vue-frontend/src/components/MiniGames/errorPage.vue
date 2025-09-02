<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-background text-ternary">
    
    <h1 class="text-4xl font-bold mb-4">Game Not Found</h1>
    <p class="text-lg text-gray-600 mb-6">The game you are looking for does not exist.</p>
    <RouterLink
      :to="{ name: 'MiniGames' }"
      class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      
        >
      Back to MiniGames
    </RouterLink>
  </div>
</template>

<style scoped>
/* Add any additional styles here if needed */
</style>