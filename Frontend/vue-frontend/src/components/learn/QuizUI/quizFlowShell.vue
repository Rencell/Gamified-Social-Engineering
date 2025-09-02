<template>

  <QuizIntro v-if="quizIntro"
   @start-quiz="toggleStart" 
   :QuizIntro="introMeta" />

  <template v-else>
    <component class="slide-next" v-if="!quizCompleted" 
      :is="quizComponent" 
      :questions="shuffleQuestions" 
      @finish="onFinish"/>

    <QuizSummary v-else 
      :score="score" 
      :length="total_questions"
      :totalExp="totalExp"
      :totalCoin="totalCoin"
      :reward-state="rewardState"
      @retryQuiz="resetQuiz" 
      @nextLesson="nextLesson"
      v-model:toggleCoin="showReward"
       />
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import QuizSummary from './quizSummary.vue'
import QuizIntro from './quizIntro.vue';
import { useLearningStore } from '@/stores/learning';
import { useAuthStore } from '@/stores/auth';
import { useRewardStore } from '@/stores/reward';
import { QuizService } from '@/services';

// Assets
import matching from '/Learning/QuizType/MatchingType.webp'
import ScenarioTraining from '/Learning/QuizType/ScenarioTraining.png'
import DragPair from '/Learning/QuizType/DragPair.png'
import DoDont from '/Learning/QuizType/DoDont.png'
import GuessTactics from '/Learning/QuizType/GuessTactics.svg'
import TwoImage from '/Learning/QuizType/TwoImage.png'
import { shuffle } from '@/composables/shuffleData';

interface QuizProps {
  quizComponent: any;
  questions: any[];
}
const props = defineProps<QuizProps>();

// Emits
const emit = defineEmits(['completeModule', 'showDown']);

// Stores
const learningStore = useLearningStore();
const rewardStore = useRewardStore();
const authStore = useAuthStore();


// Refs
const quizIntro = ref(true);
const score = ref(0)
const quizCompleted = ref(false)
const showReward = ref(false)
const totalExp = ref(0)
const totalCoin = ref(0)
const rewardState = ref('reward')

//  Cached Values
const total_questions = ref(props.questions.length)
const shuffleQuestions = ref(props.questions)
const max_score = ref(0)

const introMeta = computed(() => {
  const map: Record<string, { title: string; description: string, image: string }> = {
    MatchingQuiz: { 
      title: 'Matching Quiz', 
      description: 'Match all the words before the time runs out! Collect the reward ahead',
      image: matching
    },
    DragPair: { 
      title: 'Drag & Drop', 
      description: 'Drag the words to their correct positions.',
      image: DragPair
    },
    DoDont: { 
      title: 'Do & Don\'t Quiz', 
      description: 'Select the correct answer for each question.',
      image: DoDont
    },
    ScenarioTraining: { 
      title: 'Scenario Training Quiz', 
      description: 'Let us see how well you can identify the social engineering attacks in this scenario.',
      image: ScenarioTraining 
    },
    MultipleChoice: { 
      title: 'Final Test', 
      description: 'Let us see how well you can identify the social engineering attacks in this scenario.',
      image: matching
    },
    PhishingTactics: { 
      title: 'Guess the Tactic', 
      description: 'You have to identify the used Phishing tactics on the given Email or Smishing.',
      image: GuessTactics
    },
    TwoImage: { 
      title: '2 Pics Quiz', 
      description: 'You have to identify the used Phishing tactics on the given Email or Smishing.',
      image: TwoImage
    },
  }
  return map[props.quizComponent.name] ?? map.MatchingQuiz
})


/* ---------------------------------------------------------- core handlers */
async function onFinish(finalScore: number) {
  score.value         = finalScore
  quizCompleted.value = true
  showReward.value    = false
  emit('completeModule', false)

  // Only award when the user improved their score
  
  const prevScore = await previousScore();
  if (finalScore > prevScore) {
    await saveQuizResult();
    rewardState.value = 'reward';
  } else {
    rewardState.value = finalScore === prevScore ? 'no-reward' : rewardState.value;
  }

  if(await previousScore() === total_questions.value){
    rewardState.value = 'max-reward'
  }
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

const toggleStart = () => {
  quizIntro.value = false;
  quizCompleted.value = false
}

let cachedPreviousScore: number | undefined
async function previousScore() {
  if (cachedPreviousScore !== undefined) return cachedPreviousScore
  const { pk: userId } = authStore.User.pk
  const moduleOrder    = learningStore.selectedModule?.module_order ?? 0

  try {
    const res = await QuizService.get_by_user_and_module(userId, moduleOrder)
    if(res){ 
      quizIntro.value = false;
    }
    cachedPreviousScore = res?.score ?? 0
  } catch {
    cachedPreviousScore = 0
  }
  return cachedPreviousScore
}

const saveQuizResult = async () => {
  try {
    await QuizService.create_quiz({
      score:            score.value,
      user:             authStore.User.pk,
      module:           learningStore.selectedModule?.module_order ?? 0,
      total_questions:  total_questions.value,
    });
  } catch (error) {
    console.error('Failed to create quiz:', error);
  }

  const reason = rewardStore.REASONS.quiz;
  const prevScore = max_score.value || 0;
  const {coin: prevCoin, exp: prevExp} = rewardStore.calculateScore(prevScore, total_questions.value);
  const {coin: newCoin, exp: newExp} = rewardStore.calculateScore(score.value, total_questions.value);

  totalCoin.value  = (newCoin - prevCoin)
  totalExp.value = (newExp - prevExp)
  if (newCoin > prevCoin) {
      rewardStore.increaseUserRewards(reason, totalCoin.value, totalExp.value);
  }
}

onMounted(async () => {

  // If this is a “final” module, skip intro immediately

  if (props.quizComponent.name === 'ScenarioTraining') {
    shuffleQuestions.value = props.questions; // Do not shuffle
  } else {
    shuffleQuestions.value = shuffle(props.questions); // Shuffle for other quiz types
  }

  if (learningStore.selectedModule?.final) {
    quizIntro.value = false;
  }

  try {
    score.value         = await previousScore()
    quizCompleted.value = cachedPreviousScore !== 0
    showReward.value    = true
  } catch (error) {
    console.error('Error during quiz initialization:', error);
  }

});


</script>

<style scoped>
.slide-next {
  animation: slideNext 0.5s ease-in-out;
}

@keyframes slideNext {
  0% {
    transform: translateX(20%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>