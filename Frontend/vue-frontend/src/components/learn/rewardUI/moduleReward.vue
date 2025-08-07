<script setup lang="ts">
import { Button } from '@/components/ui/button';
import LearningImage from '../content/UI/Learning/Image/LearningImage.vue';
import moneyBag from '/Home/money-bag.svg';
import { Card } from '@/components/ui/card';
import CardContent from '@/components/ui/card/CardContent.vue';
import LearningSpan from '../content/UI/Learning/Highlight/LearningSpan.vue';
import { useLearningStore } from '@/stores/learning';
import { computed, ref } from 'vue';
import { useRewardStore } from '@/stores/reward';
import LearningSection from '../content/UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../content/UI/Learning/Core/LearningHeader.vue';
const rewardStore = useRewardStore();
const learningStore = useLearningStore();

const isRewardClaimed = computed(() => learningStore.selectedModule?.interactive);


const props = defineProps<{
  totalLength: number
}>()

const coinAnimate = ref(false);

const toggleReward = () => {

  if (!isRewardClaimed.value) {
    learningStore.activateModuleInteraction();
    const coins = props.totalLength * 2
    const xp = props.totalLength * 4

    rewardStore.increaseUserRewards(rewardStore.REASONS.content, coins, xp)
    coinAnimate.value = true;
  } else {
    learningStore.nextModule();
  }
};


</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-25">
    <!-- Header Section -->
    <div class="flex flex-col items-center justify-center">
      <LearningImage :image="moneyBag" class=" throb" />
      <LearningSection class="text-center">
        <LearningHeader class="text-xl font-bold">You have completed the module!</LearningHeader>
        <LearningHeader class="text-lg text-ternary">Claim your rewards below!</LearningHeader>
      </LearningSection>
    </div>


    <!-- Reward Summary -->
    <div class="space-y-4 animate-parent relative ">
      <Card>
        <CardContent class="flex">
          <div class="flex-2 border-r-2 border-primary/30 pr-4 space-y-1">
            <div class="flex justify-between">
              <p class="text-sm font-semibold">Total Modules</p>
              <p>12</p>
            </div>
            <div class="flex justify-between">
              <p class="text-sm font-semibold">Level 1 Multiplier</p>
              <p>x 10</p>
            </div>
          </div>
          <div class="flex-1 text-center space-y-1">
            <p class="text-xs font-bold">
              <LearningSpan>EARNED</LearningSpan>
            </p>
            <p class="text-xl font-bold counter">120 XP</p>
          </div>
        </CardContent>
      </Card>
      <!-- Coin Animation -->
      <div v-show="coinAnimate" class="coin-animation-container">
        <div class="coin text-slate-900 text-xs flex items-center justify-center" v-for="n in 5" :key="n">
          +20
        </div>

      </div>
      <Button @click="toggleReward" size="lg"
        class="w-sm font-bold border-b-4 border-primary/30 transition-all duration-200">
        {{ isRewardClaimed ? 'Next Module' : 'Claim Reward' }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* Coin Animation */
.coin-animation-container {

  top: -200px;
  right: -40px;
  position: absolute;
  width: 100%;
  height: 300px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coin {
  position: absolute;
  width: 30px;
  height: 30px;
  background: gold;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  animation: drop 1s ease-in;
  opacity: 0;
}

.coin:nth-child(1) {
  left: 10%;
  animation-delay: 0.3s;
}

.coin:nth-child(2) {
  left: 20%;
  animation-delay: 0.5s;
}

.coin:nth-child(3) {
  left: 30%;
  animation-delay: 0.7s;
}

.coin:nth-child(4) {
  left: 40%;
  animation-delay: 0.9s;
}

.coin:nth-child(5) {
  left: 50%;
  animation-delay: 1.1s;
}


@keyframes throb {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}

.throb {
  animation: throb 1s ease-in-out infinite;
  display: inline-block;
}



@keyframes drop {
  0% {
    transform: translateY(300%) scale(0.7) rotate(0deg);
    opacity: 0;
    filter: brightness(1.2);
  }

  20% {
    transform: translateY(0) scale(1.1) rotate(20deg);
    opacity: 1;
    filter: brightness(1.4);
  }

  40% {
    transform: translateY(-20%) scale(1) rotate(-10deg);
    opacity: 1;
    filter: brightness(1.1);
  }

  60% {
    transform: translateY(-100%) scale(1.05) rotate(10deg);
    opacity: 1;
    filter: brightness(1.3);
  }

  80% {
    transform: translateY(-300%) scale(0.95) rotate(-15deg);
    opacity: 0.2;
    filter: brightness(1.2);
  }

  100% {
    transform: translateY(-500%) scale(0.8) rotate(30deg);
    opacity: 0;
    filter: brightness(1);
  }
}
</style>