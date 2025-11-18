<script setup lang="ts">
import Header from '@/components/Assessment/playing/header.vue'
import Footer from '@/components/Assessment/playing/footer.vue'
import MultipleChoice from '@/components/Assessment/QuizType/MultipleChoice.vue'
import { computed, onMounted, ref } from 'vue'
import { useAssessmentStore } from '@/stores/assessment'
import type { Option } from '@/services/assessmentService'
import ImageChoice from '@/components/Assessment/QuizType/ImageChoice.vue'
import Stepper from '@/components/Assessment/playing/stepper.vue'

const assessmentStore = useAssessmentStore()
onMounted(async () => {
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

const handleQuestionAnswered = async () => {
    await assessmentStore.save_question_answer({
        session_id: currentSession.value?.session_id as string,
        question_id: selectedQuestion.value.id as number,
        option_id: selectedOption.value ? selectedOption.value.id : null,
    });

    currentIndex.value += 1;
    
}
</script>
<template>
    <div class="h-screen flex flex-col items-center px-50 pb-20"> <!-- Add padding-bottom to prevent content overlap -->
        <Header :progress="progressPercentage" />
        <main class="flex-1">
            <div class="min-h-full flex items-center justify-center">
                <div class="text-center w-full">
                    <multiple-choice v-if="selectedQuestion.question_type == 'multiple_choice'" :questions="selectedQuestion" @answer-selected="handleAnswerSelect" />
                    <ImageChoice v-else :questions="selectedQuestion" @answer-selected="handleAnswerSelect" />
                </div>
            </div>
        </main>

        <!-- Fixed footer -->
        <div class="fixed bottom-0 left-0 right-0">
            <Footer @handle="handleQuestionAnswered" />
        </div>
    </div>

</template>