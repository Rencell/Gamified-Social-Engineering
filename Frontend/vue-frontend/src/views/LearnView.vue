<script setup lang="ts">
import LessonCard from '@/components/learn/learnUI/LessonCard.vue';
import { RouterLink, useRoute } from 'vue-router';
import { useLearningStore } from '@/stores/learning';
import { onMounted } from 'vue';
import DayStreak from '@/components/learn/dayStreak/DayStreak.vue'
import Metrics from '@/components/learn/metrics/metrics.vue'
const learningStore = useLearningStore();
const route = useRoute();


import { useLessonStore } from '@/stores/lesson';
import CreateDialog from '@/components/learn/dialog/Lesson/createDialog.vue';
import { useAuthStore } from '@/stores/auth';

const lessonStore = useLessonStore();

onMounted(async () => {
    await learningStore.fetchLessons();
    await learningStore.fetchLatestLesson();

    await lessonStore.fetchLessons();
    await lessonStore.fetchLatestLesson();
});

</script>

<template>
    
    <div class="p-2 sm:p-5">
        <p class="font-bold text-3xl mb-4">Learning</p>

        <div class="flex flex-col sm:flex-row gap-10 ">
            <div class="flex-2 grid grid-cols-1 gap-4">
                <div>
                    <CreateDialog/>
                </div>
                
                <RouterLink v-for="(lesson, index) in lessonStore.lessons" :key="lesson.slug"
                    :to="`${route.path}/${lesson.slug}`">

                    <div>
                        <LessonCard :class="[useAuthStore().User.is_admin ? false : lesson?.locked
                            ? 'opacity-50 cursor-not-allowed border-1 border-ternary rounded-4xl' :
                            'cursor-pointer  rounded-4xl',
                        ]" :index="index + 1" 
                            :isLatest="lessonStore.latestLesson?.id === lesson.id" 
                            :progress="lesson.completed_modules || 0"
                            :title="lesson.title" 
                            :image="typeof lesson.image === 'string' ? lesson.image : undefined" 
                            :bg="lesson.bg" 
                            :module-count="lesson.total_modules"
                            :locked="useAuthStore().User.is_admin ? false : lesson?.locked">
                        </LessonCard>
                    </div>
                </RouterLink>
                <!-- Create -->

            </div>


            <div class="flex flex-col gap-4 flex-1 sticky top-0 self-start">
                <DayStreak  />
                <Metrics />
            </div>
        </div>


    </div>
    
</template>


<style scoped></style>