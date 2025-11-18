<template>
    <div class="space-y-8 flex flex-col items-center w-3xl">
      <h2 class="w-full text-xl font-display font-bold text-white text-center text-pretty">
        {{ question.text }}
      </h2>
  
      <div class="grid gap-6 w-full" :class="hasImage ? 'grid-cols-2' : ''">
        <div
          v-if="hasImage"
          class="p-3 bg-black rounded-lg flex items-center justify-center"
        >
          <img class="object-contain max-h-96 w-full" :src="question.image" alt="">
        </div>
  
        <div class="w-full" :class="{'px-20': !hasImage}">
          <div :class="isAnimationFinished ? 'animate-in fade-in duration-500' : 'opacity-0'">
            <div class="grid grid-cols-1 gap-4">
              <div 
                v-for="(option, key) in question.options" 
                :key="option.id || key" 
                :class="[
                  'p-4 cursor-pointer transition-all duration-200 border-2 rounded-lg',
                  getCardClass(option.id || key)
                ]" 
                @click="handleAnswerSelect(option)"
              >
                <div class="flex items-center gap-3">
                  <div :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                    getCircleClass(option.id || key)
                  ]">
                    {{ String.fromCharCode(65 + key) }}
                  </div>
                  <span class="text-slate-200 font-bold">{{ option.text }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="h-20"></div>
    </div>
</template>

<script setup lang="ts">
import type { Option, Question } from '@/services/assessmentService';
import { computed, ref, onMounted } from 'vue';

const props = defineProps<{
  questions: Question;
}>();

const emit = defineEmits<{
  answerSelected: [optionId: Option | null];
}>();

const question = computed(() => {
    return props.questions;
});

const hasImage = computed(() => {
    return question.value.image;
});

// Animation state
const isAnimationFinished = ref(false);

// Selected option state
const selectedOption = ref<Option | null>(null);

onMounted(() => {
  // Trigger animation after component mounts
  setTimeout(() => {
    isAnimationFinished.value = true;
  }, 100);
});

const handleAnswerSelect = (optionId: Option | null) => {
  selectedOption.value = optionId;
  emit('answerSelected', optionId);
};

const getCardClass = (optionId: string | number) => {
  if (selectedOption.value?.id === optionId) {
    return 'border-blue-500 bg-blue-500/20';
  }
  return 'border-slate-600 bg-secondary hover:bg-secondary/70 hover:border-slate-500';
};

const getCircleClass = (optionId: string | number) => {
  if (selectedOption.value?.id === optionId) {
    return 'bg-blue-500 text-white';
  }
  return 'border border-slate-600 text-slate-300';
};
</script>

<style scoped>
/* Add fade-in animation if not defined globally */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fade-in;
}

.duration-500 {
  animation-duration: 500ms;
}
</style>