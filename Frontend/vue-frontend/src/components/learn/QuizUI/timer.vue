<template>
    <div class="sticky top-0 z-50 bg-[#181c28] pt-5 flex items-center justify-between mb-8">
      <div class="flex-1 max-w-xl mx-auto">
        <Progress class="h-5" bg="bg-yellow-500" :model-value="(timeLeft / totalTime) * 100"></Progress>
        <p class="text-center text-sm mt-3">
            Time Left: {{ Math.floor(timeLeft / 60) }}:{{ String(timeLeft % 60).padStart(2, '0') }}
        </p>
      </div>
    </div>
</template>

<script setup lang="ts">
import { Progress } from '@/components/ui/progress';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const totalTime = 60 * 10; 
const timeLeft = ref(totalTime);
let timer:  number | null = null;

const emit = defineEmits(['timeUp']);

onMounted(() => {
    timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1;
    } else {
      toggleFinish(); // Finish the game when the timer runs out
    }
  }, 1000);
})

const toggleFinish = () => {
    clearInterval(timer!);
    emit('timeUp', timeLeft.value);
}

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer); // Clear the timer when the component is unmounted
  }
});

defineExpose({
  timeLeft,
});
</script>