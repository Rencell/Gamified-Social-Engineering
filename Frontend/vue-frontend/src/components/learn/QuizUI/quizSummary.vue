<script setup lang="ts">
import { Button } from "@/components/ui/button";
import coins from "/Home/coin.svg";
import my_xp from "/Home/exp.png";
import { Card, CardContent } from "@/components/ui/card";
import LearningSpan from "../content/UI/Learning/Highlight/LearningSpan.vue";
import RivePlayer from "@/components/RivePlayer.vue";
import radial from "/radial.png";
import { Crown, Info } from "lucide-vue-next";

const props = defineProps({
  score: {
    type: Number,
    default: 0,
  },
  length: {
    type: Number,
    default: 0,
  },
  totalCoin: {
    type: Number,
    default: 0,
  },
  totalExp: {
    type: Number,
    default: 0,
  },
  rewardState: {
    type: String,
    default: 'reward',
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

import { computed } from 'vue';

const percentage = (props.score / props.length) * 100;
const performanceMessage = computed(() => {

  if (percentage < 10) {
    return 'Let’s try again!';
  } else if (percentage < 50) {
    return 'Good effort!';
  } else if (percentage < 80) {
    return 'Great job!';
  } else if (percentage < 100) {
    return 'Excellent work!';
  } else {
    return 'Outstanding Performance!';
  }
});

const emit = defineEmits(['retryQuiz', 'nextLesson', 'toggleCoins']);

const toggleCoin = defineModel('toggleCoin', { type: Boolean, default: true });

const nextLesson = () => {
  emit('nextLesson');
};
const retryQuiz = () => {
  emit('retryQuiz');
};

interface Rewards{
  text: string;
  value: number;
  icon: string;
  type: 'percentage' | 'time' | 'default';
}
const rewardIcons: Rewards[] = [

  {
    text: 'Accuracy',
    value: percentage,
    icon: "https://cdn-icons-png.freepik.com/256/12635/12635783.png?semt=ais_white_label",
    type: 'percentage',
  },
  {
    text: 'Time Spent',
    value: props.timeSpent,
    icon: "https://media.lordicon.com/icons/wired/flat/46-timer-stopwatch.svg",
    type: 'time',
  },
  {
    text: 'Time Spent',
    value: props.attempts,
    icon: "https://cdn-icons-png.flaticon.com/512/13951/13951389.png",
    type: 'default',
  },
]

</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-3 sm:p-4 md:p-6 w-full flex-col">
    
    <div class="w-full max-w-2xl mx-auto text-center space-y-4 sm:space-y-6 animate-parent">
      <!-- Score and Title -->
      <div class="space-y-3 sm:space-y-5">
        <!-- <p class="text-slate-600 text-XS font-bold">SCORE</p> -->
        <div class="bg-accent/20 rounded-full w-12 h-12 sm:w-15 sm:h-15 mx-auto flex items-center justify-center">
          <h1 class="text-white text-base sm:text-lg md:text-xl font-bold">
            <span class="text-accent dark:text-yellow-500">{{ score }}/{{ length }}</span>
          </h1>
        </div>
        <h1 class="text-white text-xl sm:text-2xl md:text-3xl font-bold px-2">{{ performanceMessage }}</h1>
      </div>

      <!-- Rive Player Section -->
      <div class="flex justify-center items-center relative py-4 sm:py-6">
        <div class="size-32 sm:size-40 md:size-50 relative z-10">
          <RivePlayer :celebrate-state="false" />
        </div>
        <img class="size-32 sm:size-40 md:size-50 absolute opacity-30 animate-spin [animation-duration:15s]" :src="radial" />
      </div>

      <!-- Alert Messages -->
      <div v-if="rewardState === 'no-reward'"
        class="flex gap-2 sm:gap-3 text-center justify-center items-center text-xs sm:text-sm text-blue-400 border border-blue-600 rounded-lg p-2 sm:p-3 mx-2">
        <Info class="flex-shrink-0" />
        <p>Score more than your Max score to be rewarded</p>
      </div>
      <div v-if="rewardState === 'max-reward'"
        class="flex gap-2 sm:gap-3 text-center justify-center items-center text-xs sm:text-sm text-yellow-400 border border-yellow-600 rounded-lg p-2 sm:p-3 mx-2">
        <Crown class="flex-shrink-0" />
        <p>You've mastered this quiz! No more reward to gain.</p>
      </div>

      <!-- Reward Stats (Coins & XP) -->
      <div v-if="!toggleCoin && rewardState === 'reward'" class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full px-2">
        <Card class="border-2 border-ternary py-3 sm:py-4">
          <CardContent>
            <div class="flex justify-between items-center gap-2">
              <div class="text-xs sm:text-sm font-bold truncate">LESSON COINS</div>
              <div class="flex items-center gap-1 sm:gap-2">
                <div class="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0">
                  <img :src="coins" class="w-full h-full text-white" />
                </div>
                <div class="text-left">
                  <div class="text-base sm:text-lg md:text-xl font-bold counter">
                    {{ totalCoin }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
  
        <Card class="border-2 border-ternary py-3 sm:py-4">
          <CardContent>
            <div class="flex justify-between items-center gap-2">
              <div class="text-xs sm:text-sm font-bold truncate">LESSON XP</div>
  
              <div class="flex items-center gap-1 sm:gap-2">
                <div class="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0">
                  <img :src="my_xp" class="w-full h-full text-white" />
                </div>
                <div class="text-left">
                  <div class="text-base sm:text-lg md:text-xl font-bold counter">
                    {{ totalExp }}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Stats Grid (Accuracy, Time, Attempts) -->
      <div class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full px-2">
        <!-- Accuracy Card -->
        <Card class="py-3 sm:py-4 dark:bg-secondary bg-white/80 backdrop-blur shadow-md transform transition-all hover:scale-105" v-for="reward in rewardIcons" :key="reward.text">
          <CardContent class="flex flex-col items-center gap-1 sm:gap-2">
            <img class="size-8 sm:size-10 md:size-12" :src="reward.icon" :alt="reward.text.toLowerCase()">
            <div class="flex-1">
              <p class="text-center font-bold text-lg sm:text-xl md:text-2xl">
                <span v-if="reward.type == 'default'">{{ reward.value.toFixed(0) }}</span>
                <span v-else-if="reward.type == 'percentage'">{{ reward.value.toFixed(0) }}%</span>
                <span v-else-if="reward.type == 'time'">{{ Math.floor(reward.value / 60) || 0 }}:{{ String(reward.value % 60 || 0).padStart(2, '0') }}</span>
              </p>
              <p class="font-semibold text-xs sm:text-sm">{{ reward.text }}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2 sm:space-y-3 mt-6 sm:mt-8 md:mt-10 px-2 w-full">
        <Button 
          @click="nextLesson" 
          size="lg"
          class="w-full font-bold border-b-4 border-primary/30 transition-all duration-200 text-sm sm:text-base"
        >
          Next Lesson
        </Button>
        <Button 
          @click="retryQuiz" 
          size="lg" 
          variant="ghost" 
          class="w-full font-medium bg-background text-sm sm:text-base"
        >
          Retry Quiz
        </Button>
      </div>
    </div>
  </div>
</template>


<style scoped>
@keyframes pop {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.counter {
  opacity: 0;
  animation: pop 0.3s ease-out 1s forwards;
}





@keyframes drop-in {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }

  60% {
    opacity: 1;
    transform: scale(1.15);
  }

  80% {
    transform: scale(0.95);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-parent>* {
  opacity: 0;
  animation: drop-in 0.5s ease-out forwards;
}

/* Optional: staggered effect */
.animate-parent>*:nth-child(1) {
  animation-delay: 0.1s;
}

.animate-parent>*:nth-child(2) {
  animation-delay: 0.3s;
}

.animate-parent>*:nth-child(3) {
  animation-delay: 0.5s;
}

.animate-parent>*:nth-child(4) {
  animation-delay: 0.7s;
}

.animate-parent>*:nth-child(5) {
  animation-delay: 1s;
}
</style>
