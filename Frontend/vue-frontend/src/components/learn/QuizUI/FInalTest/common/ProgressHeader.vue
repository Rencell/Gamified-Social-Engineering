<template>
    <div class="space-y-5 sticky top-0 z-50 pt-10 bg-[#181c28]">
      <!-- Progress Bar -->
      <Progress class="w-2xl h-4 mx-auto " :modelValue="progress"></Progress>
  
      <!-- Timer -->
      <div class="ms-auto flex">
        <div class="p-2 px-3 bg-secondary rounded-full flex items-center gap-2">
          <img
            class="h-full size-8"
            src="https://cdn-icons-png.freepik.com/256/1207/1207479.png?semt=ais_white_label"
            alt=""
          />
          <p class="font-semibold">{{ formattedTime }}</p>
        </div>
      </div>
    </div>
</template>

<script script setup lang="ts">
import { Progress } from '@/components/ui/progress';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{
    length: number;
    currentIndex: number;
    score: number;
}>();

const emit = defineEmits(['finish'])

const currentIndex = computed(() => props.currentIndex);

// Timer variables
const totalTime = 120; 
const timeLeft = ref(totalTime);
let timer: number | null = null;

const progress = computed(() => {
  return ((currentIndex.value + 1) / props.length) * 100;
});

// Computed property for formatted time (MM:SS)
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});


// Timer function
const startTimer = () => {
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timer!);
      emit('finish'); 
    }
  }, 1000);
};

// Lifecycle hooks
onMounted(() => {
  startTimer(); 
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer); 
  }
});

</script>