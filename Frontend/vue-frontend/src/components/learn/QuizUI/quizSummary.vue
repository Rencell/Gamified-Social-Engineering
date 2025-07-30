<script setup lang="ts">
import { Button } from "@/components/ui/button";
import asset from "/Home/image.png";
import coins from "/Home/coin.svg";
import my_xp from "/Home/exp.png";
import { onMounted, ref, onActivated, watch } from "vue";
import LearningImage from '../content/UI/Learning/Image/LearningImage.vue'
import { Card, CardContent } from "@/components/ui/card";
import LearningSpan from "../content/UI/Learning/Highlight/LearningSpan.vue";
import { CountTo } from 'vue3-count-to';
import NumberCountdown from './numberCountdown.vue'

const props = defineProps({
  score: {
    type: Number,
    default: 8,
  },
  length: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(['retryQuiz']);


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
                <div class="text-white text-xl font-bold counter">
                  {{score}}
                </div>
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
                <div class="text-white text-xl font-bold counter">
                  8
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>




      <!-- Continue Button -->
      <div class="space-y-4 mt-10">
        <div >
          <Button  
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
