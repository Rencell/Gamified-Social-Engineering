<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-md max-w-xl mx-auto text-center space-y-8 animate-parent">
      <!-- Stars -->
      <div class="flex justify-center animate-in fade-in zoom-in duration-300">
        <img :src="star" alt="">
      </div>

      <!-- Score and Title -->
      <div class="space-y-2">
        <p :class="isPassed ? 'text-green-400' : 'text-red-400' " class="text-sm font-bold">
          You scored {{ percentage }}%
        </p>
        <h1 v-if="isPassed" class="text-2xl font-bold text-white">You succeeded</h1>
        <h1 v-if="!isPassed" class="text-2xl font-bold text-destructive">You have failed</h1>
      </div>
      <div
        v-if="!isPassed"
        class="flex gap-3 text-center justify-center items-center text-sm text-red-400 border border-red-600 rounded-lg p-3">
        <Crown />
        <p>Score more than 75% to pass the final test!</p>
      </div>

      <!-- Stats -->
      <Card v-if="isPassed">
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center gap-2 justify-center">
              <div class="w-12 h-12 rounded-full flex items-center justify-center">
                <img :src="coins" class="w-full h-full text-white" />
              </div>
              <div class="text-left">
                <div class="text-white text-xl font-bold">{{ animatedCoins }}</div>
                <div class="text-slate-400 text-sm">Coins</div>
              </div>
            </div>

            <div class="flex items-center justify-center gap-2">
              <div class="w-10 h-10 rounded-full flex items-center justify-center">
                <img :src="my_xp" class="w-full h-full text-white" />
              </div>
              <div class="text-left">
                <div class="text-white text-xl font-bold">{{ animatedXp }}</div>
                <div class="text-slate-400 text-sm">Xp</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      <div class="grid grid-cols-3 gap-4 w-full ">
        <Card>
          <CardContent class="flex flex-col items-center gap-2">
            <img class="size-12" src="https://cdn-icons-png.freepik.com/256/12635/12635783.png?semt=ais_white_label" alt="">
            <div class="flex-1">
              <p class="text-center font-bold text-2xl">{{ percentage.toFixed(0) }}%</p>
              <p class="font-semibold text-xs">Accuracy</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="flex flex-col items-center gap-2">
            <img class=" size-12" src="https://media.lordicon.com/icons/wired/flat/46-timer-stopwatch.svg" alt="">
            <div class="flex-2">
              <p class="text-center font-bold text-2xl">{{ Math.floor(timeSpent / 60) || 0 }}:{{ String(timeSpent % 60 || 0).padStart(2, '0') }}</p>
             
              <p class="font-semibold text-xs">Time Spent </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent class="flex flex-col items-center gap-2">
            <img class="size-10" src="https://cdn-icons-png.flaticon.com/512/13951/13951389.png" alt="">
            <div class="flex-1">
              <p class="text-center font-bold text-2xl">{{attempts}}</p>
              <p class="font-semibold text-xs">Attempts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Progress Bars -->
      <!-- <Card>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
              >
                5
              </div>
              <div class="flex-1 text-left">
                <div class="text-white font-medium">Bronze</div>
                <div class="text-slate-400 text-sm">League</div>
              </div>
            </div>
            <Progress :model-value="animatedPercentage" bg="bg-green-500" bg-background="bg-background" class="h-5"></Progress>
          </div>
  
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Shield class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1 text-left">
                <div class="text-white font-medium">Moderate</div>
                <div class="text-slate-400 text-sm">Defence</div>
              </div>
            </div>
            <Progress :model-value="animatedPercentage2" bg="bg-orange-500" bg-background="bg-background" class="h-5"></Progress>
          </div>
        </CardContent>
      </Card> -->

      

      <!-- Continue Button -->
      <div class="space-y-3">
        <Button class="w-full font-medium" @click="toggleNext">
          Go to home
        </Button>
        <Button variant="ghost" class="w-full" @click="emit('retryQuiz')">
           Retry
        </Button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { CardContent,Card } from "@/components/ui/card";
import { Shield } from "lucide-vue-next";
import coins from "/Home/coin.svg";
import star from "/Home/star.png";
import my_xp from "/Home/exp.png";
import { computed, onMounted, ref } from "vue";
import { Progress } from "@/components/ui/progress";


const animatedCoins = ref(0);
const animatedXp = ref(0);
const animatedPercentage = ref(0);
const animatedPercentage2 = ref(0);
const emit = defineEmits(['retryQuiz', 'nextLesson']);

const animationDuration = 2000; // in milliseconds

const props = defineProps({
  score: {
    type: Number,
    default: 8,
  },
  length: {
    type: Number,
    default: 10,
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

const animateValue = (
  start: number,
  end: number,
  duration: number,
  updater: (value: number) => void
) => {
  const frameRate = 60; // frames per second
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let currentFrame = 0;

  const step = () => {
    currentFrame++;
    const progress = Math.min(currentFrame / totalFrames, 1);
    updater(Math.floor(progress * (end - start) + start));
    if (progress < 1) {
      setTimeout(step, 1000 / frameRate);
    }
  };
  step();
};

const toggleNext = () => {
  setTimeout(() => {

    emit('nextLesson')
  },1000)
}

onMounted(() => {
  animateValue(0, props.score, animationDuration, (value) => {
    animatedCoins.value = value;
  });
  animateValue(0, props.score * 2, animationDuration, (value) => {
    animatedXp.value = value;
  });
  animateValue(0, 10 * 4, animationDuration, (value) => {
    animatedPercentage.value = value;
  });
  animateValue(0, 10 * 8, animationDuration, (value) => {
    animatedPercentage2.value = value;
  });
});



const percentage = Math.floor((props.score / props.length) * 100);
const isPassed = computed(() => percentage >= 75);
</script>



<style scoped>
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

.animate-parent > * {
  opacity: 0;
  animation: drop-in 0.5s ease-out forwards;
}

/* Optional: staggered effect */
.animate-parent > *:nth-child(1) {
  animation-delay: 0.1s;
}
.animate-parent > *:nth-child(2) {
  animation-delay: 0.3s;
}
.animate-parent > *:nth-child(3) {
  animation-delay: 0.5s;
}
.animate-parent > *:nth-child(4) {
  animation-delay: 0.7s;
}
.animate-parent > *:nth-child(5) {
  animation-delay: 1s;
}
</style>
