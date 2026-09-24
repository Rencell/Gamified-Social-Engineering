<script setup lang="ts">
import Header from '@/components/Assessment/playing/header.vue'
import Footer from '@/components/Assessment/playing/footer.vue'
import MultipleChoice from '@/components/Assessment/QuizType/MultipleChoice.vue'
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useAssessmentStore } from '@/stores/assessment'
import type { Option } from '@/services/assessmentService'
import ImageChoice from '@/components/Assessment/QuizType/ImageChoice.vue'
import { useRoute, useRouter } from 'vue-router'

// Ensure multi-word component name for linting
defineOptions({ name: 'AssessmentPlayingView' })

const assessmentStore = useAssessmentStore()
const router = useRouter()
const route = useRoute()
onMounted(async () => {
    const session_id = route.params.id as string
    await assessmentStore.existing_session(session_id)
    await assessmentStore.initialize_questions(assessmentStore.currentAssessment?.id as number)
})

const currentSession = computed(() => assessmentStore.currentSession);

const currentIndex = computed({
    get: () => (currentSession.value?.current_question_index  || 0),
    set: (value: number) => {
        if (assessmentStore.currentSession) {
            assessmentStore.currentSession.current_question_index = value;
        }
    }
});
const selectedOption = ref<Option | null>(null);
const handleAnswerSelect = (optionId: Option | null) => {
    selectedOption.value = optionId;
};

const selectedQuestion = computed(() => {
    return assessmentStore.currentQuestion[currentIndex.value + 0] || [];
});

const progressPercentage = computed(() => {
    const totalQuestions = assessmentStore.currentQuestion.length;
    const completedQuestions = currentIndex.value;
    return totalQuestions > 0 ? (completedQuestions / totalQuestions) * 100 : 0;
});

// New: finishing state and timeout cleanup
const isFinishing = ref(false)
let finishTimeout: number | undefined

const handleQuestionAnswered = async () => {
    

    // Move to next question or go to report if finished (after 3s pulse)
    const totalQuestions = assessmentStore.currentQuestion.length;
    const nextIndex = currentIndex.value + 1;
    if (nextIndex >= totalQuestions) {
        isFinishing.value = true;
        await assessmentStore.save_question_answer({
            session_id: currentSession.value?.session_id as string,
            question_id: selectedQuestion.value.id as number,
            option_id: selectedOption.value ? selectedOption.value.id : null,
        });
        finishTimeout = window.setTimeout(() => {
            router.push({ 
            name: 'AssessmentReport', 
            params: { 
                a_id: assessmentStore.currentAssessment?.slug, 
                s_id: currentSession.value?.session_id 
            } 
            });
        }, 3000);
        return;
    }

    await assessmentStore.save_question_answer({
        session_id: currentSession.value?.session_id as string,
        question_id: selectedQuestion.value.id as number,
        option_id: selectedOption.value ? selectedOption.value.id : null,
    });

    currentIndex.value = nextIndex;
}

onUnmounted(() => {
    if (finishTimeout) {
        clearTimeout(finishTimeout)
    }
})
</script>
<template>
    <div class="h-screen flex flex-col items-center px-3 pb-20 sm:px-50"> <!-- Add padding-bottom to prevent content overlap -->
        <Header :progress="progressPercentage" class="w-full" />
        <main class="flex-1">
            <div class="min-h-full flex items-center justify-center">
                <div class="text-center w-full">
                    <multiple-choice v-if="selectedQuestion.question_type == 'multiple_choice'" :questions="selectedQuestion" @answer-selected="handleAnswerSelect" />
                    <ImageChoice v-else :questions="selectedQuestion" @answer-selected="handleAnswerSelect" />
                </div>
            </div>
        </main>

        <!-- Fixed footer -->
        <div class="fixed bottom-0 left-0 right-0" v-if="!isFinishing">
            <Footer @handle="handleQuestionAnswered" />
        </div>

        <!-- Finishing overlay with pulse -->
        <div v-if="isFinishing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-8 py-6 shadow-xl animate-pulse">
                <p class="text-xl font-semibold">Preparing your report...</p>
                <p class="text-sm opacity-80 mt-2">Redirecting shortly</p>
            </div>
        </div>
    </div>

</template>