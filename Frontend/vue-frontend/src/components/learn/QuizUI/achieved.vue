<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { CardContent,Card } from "@/components/ui/card";
import { Star, Coins, Shield } from "lucide-vue-next";
import coins from "/Home/coin.svg";
import star from "/Home/star.png";
import my_xp from "/Home/my_xp.svg";
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md mx-auto text-center space-y-8 animate-parent">
      <!-- Stars -->
      <div class="flex justify-center animate-in fade-in zoom-in duration-300">
        <img :src="star" alt="">
      </div>

      <!-- Score and Title -->
      <div class="space-y-2">
        <p class="text-green-400 text-sm font-bold">You scored 80%</p>
        <h1 class="text-white text-2xl font-bold">Outstanding performance</h1>
      </div>


      <!-- Stats -->
      <Card>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center gap-2">
              <div class="w-12 h-12 rounded-full flex items-center justify-center">
                <img :src="coins" class="w-full h-full text-white" />
              </div>
              <div class="text-left">
                <div class="text-white text-xl font-bold">8</div>
                <div class="text-slate-400 text-sm">Coins</div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="w-10 h-10 rounded-full flex items-center justify-center">
                <img :src="my_xp" class="w-full h-full text-white" />
              </div>
              <div class="text-left">
                <div class="text-white text-xl font-bold">16</div>
                <div class="text-slate-400 text-sm">Xp</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Progress Bars -->
      <Card>
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
            <div class="w-full bg-slate-600 rounded-full h-2">
              <div class="bg-orange-500 h-2 rounded-full" :style="{ width: '75%' }"></div>
            </div>
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
            <div class="w-full bg-slate-600 rounded-full h-2">
              <div class="bg-orange-500 h-2 rounded-full" :style="{ width: '45%' }"></div>
            </div>
          </div>
        </CardContent class="space-y-4">
      </Card>

      <!-- Continue Button -->
      <div>
        <Button class="w-full font-medium">
          Continue
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
