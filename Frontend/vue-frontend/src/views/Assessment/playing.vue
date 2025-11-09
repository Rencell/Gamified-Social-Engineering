<script setup lang="ts">
import Header from '@/components/Assessment/playing/header.vue'
import Footer from '@/components/Assessment/playing/footer.vue'
import MultipleChoice from '@/components/Assessment/QuizType/MultipleChoice.vue'
import MultipleChoiceImage from '@/components/Assessment/QuizType/MultipleChoiceImage.vue'
import { computed, onMounted, ref } from 'vue'
import { useAssessmentStore } from '@/stores/assessment'

const assessmentStore = useAssessmentStore()
onMounted(async () => {
    await assessmentStore.initialize_questions(assessmentStore.currentAssessment?.id as number)
})

const currentIndex = ref(assessmentStore.currentSession?.current_question_index || 0);

</script>
<template>

    <div class="h-screen flex flex-col items-center px-50 pb-20"> <!-- Add padding-bottom to prevent content overlap -->
        <Header />
        <!-- Scrollable main content -->
        <main class="flex-1">

            <div class="min-h-full flex items-center justify-center">
                <div class="text-center w-full">
                    <multiple-choice :questions="assessmentStore.currentQuestion[currentIndex]"  />

                </div>
            </div>
        </main>

        <!-- Fixed footer -->
        <div class="fixed bottom-0 left-0 right-0">
            <Footer />
        </div>
    </div>

</template>