<template>
  <component v-if="!quizCompleted" :is="quizComponent" :questions="questions" @finish="finishQuiz" />

  <QuizSummary v-else :score="score" :length="total_questions" @retryQuiz="resetQuiz" @nextLesson="nextLesson" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import QuizSummary from './quizSummary.vue'
import { useLearningStore } from '@/stores/learning';
import { useAuthStore } from '@/stores/auth';
import { useRewardStore } from '@/stores/reward';
import { QuizService } from '@/services';
import Question from '../content/introToSocialEngineering/CommonAttacks/question.vue';
const learningStore = useLearningStore();
const rewardStore = useRewardStore();
const authStore = useAuthStore();

interface QuizProps {
  quizComponent: any;
  questions: any[];
}


const emit = defineEmits(['toggleA', 'showDown']);


const props = defineProps<QuizProps>();

const score = ref(0)
const total_questions = ref(props.questions.length)
const quizCompleted = ref(false)
const max_score = ref(0)

const finishQuiz = (finalScore: number) => {
  score.value = finalScore
  quizCompleted.value = true
  emit('toggleA', false)

  if (score.value <= max_score.value)
    return;

  saveQuizResult();
}


const resetQuiz = () => {
  quizCompleted.value = false
  max_score.value = score.value
  score.value = 0
}

const nextLesson = () => {
  learningStore.activateModuleInteraction();
  learningStore.nextModule();
}


onMounted(async () => {
  try {
    const response = await QuizService.get_by_user_and_module(authStore.User.pk, learningStore.selectedModule?.module_order ?? 0)
    
    if (response) {
      const quiz = response;
      quizCompleted.value = true;
      score.value = quiz.score || 0;
      total_questions.value = quiz.total_questions || 0;
    } 
  } catch (error) {
    console.error('Error during quiz initialization:', error);
  }

});

async function saveQuizResult() {
  try {
    await QuizService.create_quiz({
      score: score.value,
      total_questions: total_questions.value,
      user: authStore.User.pk,
      module: learningStore.selectedModule?.module_order ?? 0
    });
  } catch (error) {
    console.error('Failed to create quiz:', error);
  }

  const reason = rewardStore.REASONS.quiz
  const coin = 10
  const xp = 20
  rewardStore.increaseUserRewards(reason, coin, xp)
}


</script>