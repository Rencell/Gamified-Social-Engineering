<template>
  <div class="flex justify-center gap-4 mt-4">
    <Button @click="startRandomToggle">Start</Button>
    <Button @click="stopRandomToggle">Stop</Button>
  </div>
  <div class="bg-[#afe57f] scale-75">
    <div class=" text-center text-3xl font-bold text-black p-4">
      <p class="text-[#022d11]">Score: {{ score }}</p>
    </div>
    <div class="grid grid-cols-3 gap-0">
      <Whack
        v-for="(isVisible, index) in visibility"
        :key="index"
        :show="isVisible"
        @whack="handleWhack(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Whack from './whack.vue';
import { Button } from '@/components/ui/button';

const visibility = ref([false, false, false, false, false, false]); // Array to manage visibility of each Whack
const score = ref(0); // Track the player's score
let intervalId: number | null = null;

// Function to randomly toggle visibility
const randomToggle = () => {
  const randomIndex = Math.floor(Math.random() * visibility.value.length); // Pick a random index
  visibility.value = visibility.value.map((_, index) => index === randomIndex); // Only one is visible at a time
};

// Start the random toggling
const startRandomToggle = () => {
  if (!intervalId) {
    intervalId = setInterval(() => {
      randomToggle();
    }, 600); // Toggle every 400ms
  }
};

// Stop the random toggling
const stopRandomToggle = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    visibility.value = visibility.value.map(() => false); // Reset visibility
  }
};

// Handle whack event
const handleWhack = (index: number) => {
  if (visibility.value[index]) {
    score.value += 1; // Increment score if the mole is visible
    visibility.value[index] = false; // Hide the mole after it's whacked
  }
};
</script>