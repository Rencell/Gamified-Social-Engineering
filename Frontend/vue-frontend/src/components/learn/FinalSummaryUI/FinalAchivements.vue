<template>
  <div class="min-h-screen flex items-center justify-center p-4 w-full">
    <div class="w-xl max-w-md mx-auto text-center space-y-4 animate-parent">
      <div class="space-y-5">
        <img class="mx-auto" :src="star" alt="">
        <h1 class="text-white text-2xl font-bold">Congratulations, you finished the Social Engineering course!</h1>
      </div>

      <!-- Display the current data item -->
      <div class="space-y-6" :key="currentIndex">
        <div class="flex justify-center items-center relative">
          <div class="size-50 relative z-10 rounded-full flex justify-center items-center">
            <div class="size-30">
              <img :src="currentData.image" class="rounded-full object-cover" />
            </div>
          </div>
          <img class="size-50 absolute opacity-30 animate-spin [animation-duration:15s]" :src="radial" />
        </div>

        <div class="flex flex-col items-center space-y-2">
          <div class="text-yellow-400 font-extrabold text-lg animate-pulse">
            {{ currentData.title }}
          </div>
          <div class="text-white text-sm">
            {{ currentData.description }}
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="space-y-4 mt-10">
        <div>
          <Button :disabled="loading" @click="nextLesson" size="lg"
            class="w-full font-bold border-b-4 border-primary/30 transition-all duration-200">
            Next
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import asset from "/Home/image.png";
import star from "/Home/star.png";
import radial from "/radial2.png";
import { computed, ref } from "vue";
import email from "/Phishing.webp";

const emit = defineEmits(['toggleSummary']);

const loading = ref(false);
const nextLesson = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    
    currentIndex.value++;
    if (currentIndex.value >= data.length) emit('toggleSummary');
  }, 1000);
};

const data = [
  {
    image: asset,
    title: "New Badge",
    description: "You’ve earned a special badge for completing this course!",
  },
  {
    image: asset,
    title: "Phishing is Unlocked",
    description: "Check out the new phishing course to learn more about online security.",
  },
];

const currentIndex = ref(0);
const currentData = computed(() => data[currentIndex.value]);
</script>

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