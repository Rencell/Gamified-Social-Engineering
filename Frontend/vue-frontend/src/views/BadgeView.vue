<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useBadgesStore } from '@/stores/badges';
import { onMounted } from 'vue';

const badgesStore = useBadgesStore();

onMounted(() => {
  badgesStore.fetchBadges();
});
</script>

<template>
  <RouterLink :to="{ name: 'Profile' }">
    <div class="flex gap-2 mb-5 text-sm items-center text-accent">
      <ArrowLeft :size="15"></ArrowLeft> Back
    </div>
  </RouterLink>

  <p class="text-2xl font-bold">Badges</p>

  <div v-if="badgesStore.isLoading" class="text-center text-gray-500">
    Loading badges...
  </div>

  <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
    <div class="p-6 space-y-4" v-for="badge in badgesStore.badges" :key="badge.name">
      <img :src="badgesStore.getBadgeSrc(badge.name)" alt="">
      <p class="text-md text-center font-display font-bold">{{ badge.name }}</p>
    </div>
  </div>
</template>