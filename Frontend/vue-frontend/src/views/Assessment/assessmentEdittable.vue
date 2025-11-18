<script setup lang="ts">
import Sidebar from '@/components/Assessment/Edittable/sidebar.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessment';
import MultipleChoice from '@/components/Assessment/Edittable/multiple-choice.vue'
import ImageChoice from '@/components/Assessment/Edittable/image-choice.vue'
import { ArrowLeft } from 'lucide-vue-next';
const route = useRoute();
const assessmentStore = useAssessmentStore();

onMounted(async() => {
    // await assessmentStore.existing_session(route.params.id as string);
    await assessmentStore.initialize_questions(route.params.id as string);
});

const currentIndex = ref(0);

const currentQuestion = computed(() => assessmentStore.currentQuestion[currentIndex.value] || []);



const addQuestion =  async(type: string) => {
    const newQuestion = {
        id: Date.now(),
        question_type: type === 'mc' ? 'multiple_choice' : 'image_choice',
        text: 'New Question',
        options: [],
        order: assessmentStore.currentQuestion.length + 1,
        assessment: assessmentStore.currentAssessment?.id as number,
        image: null,
    };
    await assessmentStore.addQuestion(newQuestion);
    currentIndex.value = assessmentStore.currentQuestion.length - 1; 
};

</script>


<template>

    <div class="p-10">
        <RouterLink :to="{ name: 'AssessmentDetail', params: { id: assessmentStore.currentAssessment?.id } }">
            <div class="flex gap-2 mb-5 text-sm items-center text-accent font-bold">
                <ArrowLeft :size="15"></ArrowLeft> Back
            </div>
        </RouterLink>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
            <!-- Main Content Area -->
            <div class="lg:col-span-2 space-y-6" :key="currentIndex">
               <MultipleChoice v-if="currentQuestion.question_type === 'multiple_choice'" :question="currentQuestion"  />
                <ImageChoice v-else :question="currentQuestion" />
            </div>
            
            <!-- Sidebar -->
            <Sidebar 
                :questions="assessmentStore.currentQuestion" 
                :currentIndex="currentIndex" 
                @update:addQuestion="addQuestion($event)"
                @update:currentIndex="currentIndex = $event" />
        </div>
    </div>
</template>