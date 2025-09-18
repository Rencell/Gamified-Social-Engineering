<template>
    <Intro v-if="quizIntro" @start-quiz="toggleStart" />
    <template v-else>

        <component v-if="!quizCompleted" :is="quizComponent" :questions="shuffleQuestions" @finish="onFinish"
            class="slide-next" />
        <template v-else>
            <FinalAchivements v-if="!quizSummary" @toggle-summary="quizSummary = true" />
            <FinalSummary v-else :score="score" :length="total_questions" @retryQuiz="resetQuiz"
                @nextLesson="nextLesson" :timeSpent="timeSpent" :attempts="attempts + 1" />
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
const timeSpent = ref(0)
const attempts = ref(0)
const currentQuizId = ref<number | null>(null)

const total_questions = ref(props.questions.length)
const shuffleQuestions = ref([...props.questions])
const max_score = ref(0)

const toggleStart = () => {
    quizIntro.value = false;
}

import { useRouter } from 'vue-router';
import Intro from './Intro.vue';
import { shuffle } from '@/composables/shuffleData';
import { useModuleStore } from '@/stores/module';
import { useContentStore } from '@/stores/content';
const router = useRouter();
const moduleStore = useModuleStore();
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

const onFinish = async (finalScore: number, timer: number) => {
    score.value = finalScore
    quizCompleted.value = true
    timeSpent.value = (60 * 15) - timer

    console.log('Quiz finished with score:', currentQuizId.value);
    if (useContentStore().contentItems.pass_rate! > (score.value / props.questions.length * 100)) {
        await updateAttempts();
        quizSummary.value = true
        return;
    }
    if (moduleStore.selectedModule?.locked) {
        
        await moduleStore.completeModule();
    }
    
    if (finalScore > (await previousScore())) {
        console.log('Final score:', finalScore);
        const prevScore = await previousScore();
        console.log('Previous score:', prevScore);
        await updateAttempts();

        if (finalScore > prevScore) {
            console.log('Final score is greater than previous score. Saving quiz result...');
            await saveQuizResult();
            console.log('Quiz result saved successfully.');

            console.log('Completing module...');
            console.log('Module completed successfully.');
        } else {
            console.log('Final score is not greater than previous score. Skipping save and module completion.');
        }

    }
}


const updateAttempts = async () => {
    try {
        await QuizService.patch(currentQuizId.value!, {
            attempt_number: attempts.value + 1
        });
        attempts.value += 1
    } catch (error) {
        console.error('Failed to update attempts:', error);
    }
}

const saveQuizResult = async () => {
    try {
        await QuizService.create_quiz({
            score: score.value,
            user: authStore.User.pk,
            module: moduleStore.selectedModule?.id ?? 0,
            total_questions: total_questions.value,
            time_spent: timeSpent.value,
            accuracy: (score.value / total_questions.value) * 100,
            attempt_number: attempts.value + 1,
            id: 0
        });
    } catch (error) {
        console.error('Failed to create quiz:', error);
    }

    const reason = rewardStore.REASONS.quiz;
    const prevScore = max_score.value || 0;
    const { coin: prevCoin, exp: prevExp } = rewardStore.calculateScore(prevScore, total_questions.value);
    const { coin: newCoin, exp: newExp } = rewardStore.calculateScore(score.value, total_questions.value);

    if (newCoin > prevCoin) {
        rewardStore.increaseUserRewards(reason, (newCoin - prevCoin), (newExp - prevExp));
    }
}


let cachedPreviousScore: number | undefined
const previousScore = async () => {
    if (cachedPreviousScore !== undefined) return cachedPreviousScore
    const { pk: userId } = authStore.User.pk
    const moduleOrder = moduleStore.selectedModule?.id ?? 0

    try {
        const res = await QuizService.get_by_user_and_module(userId, moduleOrder)
        if (res) {
            quizIntro.value     = false;
            attempts.value      = res.attempt_number
            timeSpent.value     = res.time_spent
            currentQuizId.value = res?.id ?? null
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