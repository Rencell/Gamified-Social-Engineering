<script setup lang="ts">
import { Button } from "@/components/ui/button";
import asset from "/Home/image.png";
import coins from "/Home/coin.svg";
import my_xp from "/Home/exp.png";
import { onMounted, ref } from "vue";
import LearningImage from '../content/UI/Learning/Image/LearningImage.vue'
import { Card, CardContent } from "@/components/ui/card";
import LearningSpan from "../content/UI/Learning/Highlight/LearningSpan.vue";
import LearningSpan2 from "../content/UI/Learning/Highlight/LearningSpan2.vue";

const animatedCoins = ref(0);
const animatedXp = ref(0);

const finalCoins = 8;
const finalXp = 16;

const animationDuration = 2000; // in milliseconds

// You can use setTimeout or setInterval, but requestAnimationFrame is preferred for smooth UI animations.
// If you want to use setTimeout, here's how you could rewrite it:

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

onMounted(() => {
  animateValue(0, finalCoins, animationDuration, (value) => {
    animatedCoins.value = value;
  });
  animateValue(0, finalXp, animationDuration, (value) => {
    animatedXp.value = value;
  });
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md mx-auto text-center space-y-4 animate-parent">


      <!-- Score and Title -->
      <div class="space-y-5">
        <!-- <p class="text-slate-600 text-XS font-bold">SCORE</p> -->
        <div class=" bg-accent/20 rounded-full w-15 h-15 mx-auto flex items-center justify-center">
          <h1 class="text-white text-xl font-bold">
            <LearningSpan>8/10</LearningSpan>
          </h1>
        </div>
        <h1 class="text-white text-2xl font-bold">Outstanding Performance</h1>
      </div>

      <div class="flex justify-center">
        <LearningImage :image="asset" />
      </div>

      <!-- Stats -->

      <Card class="border-2 border-accent/20 py-4">
        <CardContent>
          <div class="flex justify-between items-center gap-2">
            <div class="text-sm font-bold">LESSON COINS</div>
            <div class="flex items-center gap-2 w-15">
              <div class="w-9 h-9 rounded-full flex items-center justify-center">
                <img :src="coins" class="w-full h-full text-white" />
              </div>
              <div class="text-left">
                <div class="text-white text-xl font-bold">{{ animatedCoins }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="border-2 border-accent/20 py-4">
        <CardContent>
          <div class="flex justify-between items-center gap-2">
            <div class="text-sm font-bold">LESSON XP</div>

            <div class="flex items-center gap-2 w-15">
              <div class="w-9 h-9 rounded-full flex items-center justify-center">
                <img :src="my_xp" class="w-full h-full text-white" />
              </div>
              <div class="text-left">
                <div class="text-white text-xl font-bold">{{ animatedXp }}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>




      <!-- Continue Button -->
      <div class="space-y-4 mt-10">
        <Button size="lg" class="w-full font-bold border-b-4 border-primary/30 transition-all duration-200">
          NEXT LESSON
        </Button>
        <Button size="lg" variant="ghost" class="w-full font-medium bg-background">
          Retry Quiz
        </Button>
      </div>
    </div>
  </div>
</template>


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
