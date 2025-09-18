<template>
  <div class="w-2xl mx-auto space-y-5">
    
    <ProgressHeader 
      :length="questions.length"
      :currentIndex="currentIndex"
      :score="score"
      ref="timerRef"
      @finish="emit('finish', score, $event)"
    />
    <!-- Quiz Content -->
   
     <div class="relative flex flex-col items-center">
        <MultipleChoice
          v-if="currentTest.type == 'multiple-choice'"
          :Question="currentTest"
          :key="currentIndex"
          @isAnswered="toggleAnswered"
          @isCorrect="toggleCorrect"
          @addScore="score += 1"
        />
  
        <TwoImageTest
          v-if="currentTest.type == 'two-image'"
          :Question="currentTest"
          @isAnswered="toggleAnswered"
          @isCorrect="toggleCorrect"
          @addScore="score += 1"
        />
  
        <TrueFalse
          v-if="currentTest.type == 'true-false'"
          :Question="currentTest"
          @isAnswered="toggleAnswered"
          @isCorrect="toggleCorrect"
          @addScore="score += 1"
        />
        
        <ResultFooter 
          :isAnswered="isAnswered" 
          :isCorrect="isCorrect" 
          :explanation="currentTest.explanation" 
          @toggleNext="toggleNext"
        />
     </div>
    
  </div>
</template>

<script setup lang="ts">
import LearningContent from '../../content/UI/Learning/Core/LearningContent.vue';
import type { Test } from './type';
import MultipleChoice from './multipleChoice.vue';
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import TwoImageTest from './twoImageTest.vue';
import TrueFalse from './TrueFalse.vue';
import { Progress } from '@/components/ui/progress';
import ProgressHeader from './common/ProgressHeader.vue'
import ResultFooter from './common/resultFooter.vue'
const timerRef = ref<InstanceType<typeof ProgressHeader> | null>(null);

const props = defineProps<{
  questions: Test[];
}>();

const emit = defineEmits(['finish']);

const currentIndex = ref(0);
const currentTest = computed(() => props.questions[currentIndex.value]);
const score = ref(0);

const isAnswered = ref(false);

const toggleAnswered = (value: boolean) => {
  isAnswered.value = value;
}

const isCorrect = ref(false);

const toggleCorrect = (value: boolean) => {
  isCorrect.value = value;
}

// Computed property for progress bar


// Function to handle the next question or finish the quiz

const toggleNext = () => {
  if (currentIndex.value < props.questions.length - 1) {
    currentIndex.value++;
  } else {
    emit('finish', score.value, timerRef.value?.timeLeft); // Emit score and time left
  }
  isAnswered.value = false;
  isCorrect.value = false;
};


</script>