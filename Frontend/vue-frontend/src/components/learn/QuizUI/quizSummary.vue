<script setup lang="ts">
import { Button } from "@/components/ui/button";
import asset from "/Home/image.png";
import coins from "/Home/coin.svg";
import my_xp from "/Home/exp.png";
import LearningImage from '../content/UI/Learning/Image/LearningImage.vue'
import { Card, CardContent } from "@/components/ui/card";
import LearningSpan from "../content/UI/Learning/Highlight/LearningSpan.vue";
import RivePlayer from "@/components/RivePlayer.vue";
import radial from "/radial.png";
import { useRewardStore } from '@/stores/reward';
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
  }
});

import { computed } from 'vue';

const performanceMessage = computed(() => {
  const percentage = (props.score / props.length) * 100;

  if (percentage < 10) {
    return 'Nice try, buddy';
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


</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 w-full">
    <div class="w-xl max-w-md mx-auto text-center space-y-4 animate-parent">
      <!-- Score and Title -->
      <div class="space-y-5">
        <!-- <p class="text-slate-600 text-XS font-bold">SCORE</p> -->
        <div class=" bg-accent/20 rounded-full w-15 h-15 mx-auto flex items-center justify-center">
          <h1 class="text-white text-xl font-bold">
            <LearningSpan>{{score}}/{{length}}</LearningSpan>
          </h1>
        </div>
        <h1 class="text-white text-2xl font-bold">{{performanceMessage}}</h1>
      </div>

      <div class="flex justify-center items-center relative">
        <div class="size-50 relative z-10"><RivePlayer :celebrate-state="false" /></div>
        <img class="size-50 absolute opacity-30 animate-spin [animation-duration:15s]" :src="radial"/>
        <!-- <LearningImage :image="asset" /> -->
      </div>

      <!-- Alert -->
       <div v-if="rewardState === 'no-reward'" class="flex gap-3 text-center justify-center items-center text-sm text-blue-400 border border-blue-600 rounded-lg p-3">
        <Info/>
        <p>Score more than your Max score to be rewarded</p>
      </div>
       <div v-if="rewardState === 'max-reward'" class="flex gap-3 text-center justify-center items-center text-sm text-yellow-400 border border-yellow-600 rounded-lg p-3">
        <Crown />
        <p>You've mastered this quiz! No more reward to gain.</p>
      </div>

      <!-- Stats -->

      <Card class="border-2 border-ternary py-4" v-if="!toggleCoin">
        <CardContent>
          <div class="flex justify-between items-center gap-2">
            <div class="text-sm font-bold">LESSON COINS</div>
            <div class="flex items-center gap-2 w-15">
              <div class="w-9 h-9 rounded-full flex items-center justify-center">
                <img :src="coins" class="w-full h-full text-white" />
              </div>
              <div class="text-left">
                <div class="text-white text-xl font-bold counter">
                  {{totalCoin}}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-2 border-ternary py-4" v-if="!toggleCoin">
        <CardContent>
          <div class="flex justify-between items-center gap-2">
            <div class="text-sm font-bold">LESSON XP</div>

            <div class="flex items-center gap-2 w-15">
              <div class="w-9 h-9 rounded-full flex items-center justify-center">
                <img :src="my_xp" class="w-full h-full text-white" />
              </div>
              <div class="text-left">
                <div class="text-white text-xl font-bold counter">
                  {{totalExp}}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>




      <!-- Continue Button -->
      <div class="space-y-4 mt-10">
        <div >
          <Button  @click="nextLesson"
          size="lg" 
          class="w-full font-bold border-b-4 border-primary/30 transition-all duration-200"
          >
            Next Lesson
          </Button>
        </div>
        <Button @click="retryQuiz" size="lg" variant="ghost" class="w-full font-medium bg-background">
          Retry Quiz
        </Button>
      </div>
    </div>
  </div>
</template>


<style scoped>



@keyframes pop {
  0% { opacity: 0; }
  100% { opacity: 1; }
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
