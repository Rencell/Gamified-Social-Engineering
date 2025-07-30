<template>
    <component
      v-if="!quizCompleted"
      :is="quizComponent"
      :questions="questions"
      @finish="finishQuiz"
    />
    
    <QuizSummary
      v-else
      :score="score"
      :length="questions.length"
      @retryQuiz="resetQuiz"
      
    />
  </template>

<script setup lang="ts">
import { ref } from 'vue';
import QuizSummary from './quizSummary.vue'


interface QuizProps {
    quizComponent: any; // Use specific type if available, e.g., defineComponent
    questions: any[];   // Use a specific question type if available
}


const emit = defineEmits(['toggleA']);


const props = defineProps<QuizProps>();

const score = ref(0)
const quizCompleted = ref(false)

const finishQuiz = (finalScore: number) => {
    score.value = finalScore
    quizCompleted.value = true
    emit('toggleA', false)
}

const resetQuiz = () => {
  quizCompleted.value = false
  score.value = 0
}

</script>