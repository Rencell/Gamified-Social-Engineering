<template>
    <div class="sticky top-0 z-50 bg-[#181c28] pt-5 flex items-center justify-between mb-8">
      <div class="flex-1 max-w-xl mx-auto">
        <Progress class="h-5" bg="bg-yellow-500" :model-value="(timeLeft / totalTime) * 100"></Progress>
        <div class="relative flex items-center justify-center mt-3">
          <p class="text-center text-sm">
            Time Left: {{ Math.floor(timeLeft / 60) }}:{{ String(timeLeft % 60).padStart(2, '0') }}
          </p>
          <div v-if="decreaseVisible" class="decrease-notif">-{{ lastDecreaseText }}</div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { Progress } from '@/components/ui/progress';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const totalTime = 60 * 10; 
const timeLeft = ref(totalTime);
let timer:  ReturnType<typeof setInterval> | null = null;

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

const decreaseTime = (amount: number = 10) => {
  timeLeft.value = Math.max(0, timeLeft.value - amount);
  // show temporary "-Xs" UI
  lastDecreaseText.value = amount % 60 === 0 ? `${amount / 60}m` : `${amount}s`;
  decreaseVisible.value = true;
  // let the animation play then hide
  setTimeout(() => {
    decreaseVisible.value = false;
  }, 2000);

  if (timeLeft.value === 0) {
    toggleFinish();
  }
}

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
  decreaseTime,
});

const decreaseVisible = ref(false);
const lastDecreaseText = ref('');
</script>
<style scoped>
.decrease-notif {
  position: absolute;
  right: 10%;
  color: #fb7185; /* red-400 */
  font-weight: 600;
  background: transparent;
  pointer-events: none;
  animation: fadeUp 1s ease-out forwards;
}

@keyframes fadeUp {
  0% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-18px); }
}
</style>