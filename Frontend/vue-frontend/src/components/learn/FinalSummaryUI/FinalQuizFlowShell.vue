<template>
    <Intro v-if="quizIntro" @start-quiz="toggleStart" />
    
    <template v-else>
        
        <component v-if="!quizCompleted" 
            :is="quizComponent" 
            :questions="shuffleQuestions" 
            @finish="onFinish"
            class="slide-next" />
        <template v-else>
            <FinalAchivements v-if="!quizSummary" @toggle-summary="quizSummary = true" />
            <FinalSummary v-else :score="score" :length="total_questions" @retryQuiz="resetQuiz"
                @nextLesson="nextLesson" />
        </template>
    </template>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import FinalSummary from './FinalSummary.vue'
import FinalAchivements from './FinalAchivements.vue'
import { Progress } from '@/components/ui/progress';
import { useLearningStore } from '@/stores/learning';
import { useAuthStore } from '@/stores/auth';
import { useRewardStore } from '@/stores/reward';
import { QuizService } from '@/services';

const rewardStore = useRewardStore();
const learningStore = useLearningStore();
const authStore = useAuthStore();


const props = defineProps<{
    quizComponent: any;
    questions: any[];
}>();

const quizIntro = ref(true);
const quizCompleted = ref(false)
const quizSummary = ref(false)
const score = ref(0)

const total_questions = ref(props.questions.length)
const shuffleQuestions = ref([...props.questions])
const max_score = ref(0)

const toggleStart = () => {
    quizIntro.value = false;
}

import { useRouter } from 'vue-router';
import Intro from './Intro.vue';
import { shuffle } from '@/composables/shuffleData';
const router = useRouter();

const nextLesson = () => {
    learningStore.activateModuleInteraction();
    router.push('/learn');
}

const resetQuiz = () => {
    quizCompleted.value = false
    max_score.value = score.value
    shuffleQuestions.value = [...props.questions];
    score.value = 0
}

const onFinish = async(finalScore: number) => {
    score.value = finalScore
    quizCompleted.value = true

    if (finalScore > (await previousScore())) {
        await saveQuizResult()
    }
}

const saveQuizResult = async () => {
    try {
        await QuizService.create_quiz({
            score: score.value,
            user: authStore.User.pk,
            module: learningStore.selectedModule?.module_order ?? 0,
            total_questions: total_questions.value,
        });
    } catch (error) {
        console.error('Failed to create quiz:', error);
    }

    const reason = rewardStore.REASONS.quiz;
    const prevScore = max_score.value || 0;
    const {coin: prevCoin, exp: prevExp} = rewardStore.calculateScore(prevScore, total_questions.value);
    const {coin: newCoin, exp: newExp} = rewardStore.calculateScore(score.value, total_questions.value);

    if (newCoin > prevCoin) {
        rewardStore.increaseUserRewards(reason, (newCoin - prevCoin), (newExp - prevExp));
    }
}


let cachedPreviousScore: number | undefined
const previousScore = async () => {
    if (cachedPreviousScore !== undefined) return cachedPreviousScore
    const { pk: userId } = authStore.User.pk
    const moduleOrder = learningStore.selectedModule?.module_order ?? 0

    try {
        const res = await QuizService.get_by_user_and_module(userId, moduleOrder)
        if (res) {
            quizIntro.value = false;
        }
        cachedPreviousScore = res?.score ?? 0
    } catch {
        cachedPreviousScore = 0
    }
    return cachedPreviousScore
}

onMounted(async () => {
    try {
        shuffleQuestions.value = shuffle(props.questions)

        score.value = await previousScore()
        quizCompleted.value = cachedPreviousScore !== 0
        quizSummary.value = cachedPreviousScore !== 0
        
    } catch (error) {
        console.error('Error during quiz initialization:', error);
    }

});

</script>