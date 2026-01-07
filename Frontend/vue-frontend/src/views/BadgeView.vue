<script setup lang="ts">
import { ArrowLeft, Lock } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useBadgesStore } from '@/stores/badges';
import { onMounted } from 'vue';

const badgesStore = useBadgesStore();

const isUnlocked = (badgeName: string) => {
  return badgesStore.badgesUnlocked.some((b) => b.badge.name === badgeName);
};

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
    <div
      class="p-6 space-y-3 rounded-lg  relative transition"
      v-for="badge in badgesStore.badges"
      :key="badge.name"
      :class="!isUnlocked(badge.name) ? 'opacity-60 grayscale' : ''"
    >
      <div class="relative">
        <img :src="badge.image" :alt="badge.name" class="mx-auto" />

        <div
          v-if="!isUnlocked(badge.name)"
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="rounded-full bg-black/50 p-2">
            <Lock class="text-white" :size="18" />
          </div>
        </div>
      </div>

      <p class="text-md text-center font-display font-bold truncate">
        {{ badge.name }}
      </p>

      <p v-if="!isUnlocked(badge.name)" class="text-xs text-center text-muted-foreground">
        Locked
      </p>
    </div>

    <!-- <div class="w-[400px] h-[400px] bg-no-repeat bg-cover"
      :class="true ? 'bg-[position:0_0]' : 'bg-[position:-400px_0]'"
      style="background-image: url('/badges/PhishingBadg.svg')">
    </div> -->

  </div>
</template>