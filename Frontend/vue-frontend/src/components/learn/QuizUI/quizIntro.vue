<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 py-6">
    
    
    
    <div class="relative w-full max-w-md sm:max-w-lg flex flex-col items-center gap-4 animate-parent">
      <QuizIntroInstruction :steps="QuizIntro.introStep">
        <template #trigger>
          <button
            type="button"
            class="absolute -top-20 sm:top-0 right-4 inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 p-2 text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
            aria-label="Quiz instructions"
          >
            <Info class="h-5 w-5 text-blue-500 cursor-pointer" />
          </button>
        </template>
      </QuizIntroInstruction>
      <div class="relative flex items-center justify-center w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60">
        <img class="absolute opacity-30 animate-spin [animation-duration:15s]" :src="radial" />
        <LearningImage class="relative" :image="QuizIntro.image" />
      </div>

      <p class="font-bold text-xl sm:text-2xl text-center">{{ QuizIntro.title }}</p>
      <p class="font-bold text-sm sm:text-lg leading-relaxed text-primary/30 text-center mb-10">
        {{ QuizIntro.description }}
      </p>

      <Button @click="emit('startQuiz')" size="lg" class="w-full border-b-4 border-primary/40 font-bold text-base sm:text-lg">
        Play
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import LearningImage from '../content/UI/Learning/Image/LearningImage.vue';
import QuizIntroInstruction from './quizIntroInstruction.vue';
import radial from "/radial.png";
import { Info } from 'lucide-vue-next';
const emit = defineEmits(['startQuiz']);

defineProps({
  QuizIntro: {
    type: Object,
    default: () => ({})
  }
});

</script>


<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }

}

.animate-parent {
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
}
</style>