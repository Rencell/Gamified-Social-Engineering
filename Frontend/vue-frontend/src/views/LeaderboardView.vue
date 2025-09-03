<script setup lang="ts">
import silver from '/Leaderboard/leaderboard-podium-silver.svg';
import gold from '/Leaderboard/leaderboard-podium-gold.svg';
import bronze from '/Leaderboard/leaderboard-podium-bronze.svg';
import Badge3 from '/levels/badge3.svg';
import RobotSilver from '/Leaderboard/robotSilver.svg';
import RobotBronze from '/Leaderboard/robotBronze.svg';
import GoldMedal from '/Leaderboard/goldMedal.svg';
import background from '/Leaderboard/background.png';
import { RewardService } from '@/services';
import { useAuthStore } from '@/stores/auth';
import { computed, ref } from 'vue';

const authStore = useAuthStore();

interface UserStats {
  exp: number | null;
  coins: number | null;
  user_name: string | null;
  level: number | null;
}

const stats = ref<UserStats[]>([]);
const topThree = ref<UserStats[]>([]); // Top 3 users
const restOfStats = ref<UserStats[]>([]); // Remaining users

const leaderboard = async () => {
    const fetchedStats = await RewardService.get_stats();
    stats.value = fetchedStats
        .filter((user: UserStats) => user.exp !== 0) // Exclude users with 0 exp
        .sort((a: UserStats, b: UserStats) => (b.exp || 0) - (a.exp || 0));

    // Split the stats into top 3 and the rest
    topThree.value = stats.value.slice(0, 3);
    restOfStats.value = stats.value.slice(3);
};

const isExpZero = computed(() => {
    return stats.value.some(user => user.exp === 0);
});
const isEmpty = computed(() => {
    return stats.value.length === 0;
});

leaderboard();
</script>

<template>
  <div>
    <p class="font-bold text-3xl mb-4">Leaderboard</p>
    
    <div
      class="h-[80dvh] w-full bg-[#3635b7] rounded-2xl flex justify-center bg-top bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${background})` }"
    >
      <div class="flex items-end">
        <!-- Top 2 -->
        <div  class="flex flex-col items-center">
          <img v-if="topThree[1]" :src="`/levels/badge${topThree[1].level}.svg`" class="w-16 popup-animate delay-4" alt="" />
          <img v-if="topThree[1]" :src="RobotSilver" class="relative w-20 scale-120 popup-animate delay-2" alt="" />
          <div class="relative flex items-center justify-center flex-col">
            <img :src="silver" alt="" />
            <div class="absolute text-center">
              <p class="text-6xl font-bold">2</p>
              <p class="text-sm font-bold">{{ topThree[1] ? topThree[1].user_name : '?' }}</p>
              <p class="text-xs opacity-50">{{ topThree[1] ? topThree[1].exp : 0}} XP</p>
            </div>
          </div>
        </div>

        <!-- Top 1 -->
        <div  class="flex flex-col items-center gap-3">
          <img v-if="topThree[0]" :src="`/levels/badge${topThree[0].level}.svg`" class="w-16 popup-animate delay-4" alt="" />
          <img v-if="topThree[0]" :src="GoldMedal" class="relative w-20 scale-150 z-50 popup-animate delay-3" alt="" />
          <div class="relative flex items-center justify-center">
            <img :src="gold" alt="" />
            <div class="absolute text-center">
              <p class="text-6xl font-bold">1</p>
              <p class="text-sm font-bold">{{ topThree[0] ? topThree[0].user_name : '?' }}</p>
              <p class="text-xs opacity-50">{{ topThree[0] ? topThree[0].exp : 0}} XP</p>
            </div>
          </div>
        </div>

        <!-- Top 3 -->
        <div class="flex flex-col items-center">
          <img v-if="topThree[2]" :src="`/levels/badge${topThree[2].level}.svg`" class="w-16 popup-animate delay-4" alt="" />
          <img v-if="topThree[2]" :src="RobotBronze" class="relative w-20 scale-120 popup-animate delay-1" alt="" />
          <div class="relative flex items-center justify-center">
            <img :src="bronze" alt="" />
            <div class="absolute text-center">
              <p class="text-6xl font-bold">3</p>
              <p class="text-sm font-bold">{{ topThree[2] ? topThree[2].user_name : '?' }}</p>
              <p class="text-xs opacity-50">{{ topThree[2] ? topThree[2].exp : 0}} XP</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Rest of the Leaderboard -->
    <div class="bg-secondary mt-5 rounded-2xl flex flex-col">
      <div
        v-for="(stat, index) in restOfStats"
        :key="index"
        class="p-5 flex justify-between"
        :class="stat.user_name === authStore.User.username ? 'bg-accent/20 border-2 border-accent rounded-xl' : 'border-b border-border'"
      >
        <div class="flex gap-4">
          <p class="font-semibold">{{ index + 4 }}</p>
          <p class="font-semibold">{{ stat.user_name }}</p>
        </div>
        <p class="font-bold">{{ stat.exp }} XP</p>
      </div>
    </div>
    
    <div v-show="isExpZero" class="mt-4 text-center text-sm text-ternary brightness-125">
      Earn XP by completing lessons and quizzes to see your rank on the leaderboard!

    </div>
    <div v-show="isEmpty" class="mt-4 text-center text-sm text-ternary brightness-125">
      No users have earned XP yet. Be the first to earn XP and get on the leaderboard!
      
    </div>
  </div>
</template>

<style scoped>

@keyframes popup {
    0% {
        transform: scale(0.7);
        opacity: 0;
    }
    70% {
        transform: scale(1.1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}
.popup-animate {
    opacity: 0;
    animation: popup 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.popup-animate.delay-1 {
    animation-delay: 0.1s;
}
.popup-animate.delay-2 {
    animation-delay: 0.4s;
}
.popup-animate.delay-3 {
    animation-delay: 0.7s;
}
.popup-animate.delay-4 {
    animation-delay: 0.9s;
}
</style>