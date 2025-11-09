<template>
    <div class="flex flex-col gap-3 mb-20">
        <p class="text-lg sm:text-xl font-semibold">My Learning</p>
        <p class="text-ternary text-xs md:text-sm font-semibold"> Pick up where you left</p>
        
        <Card class="border-1 border-b-5 border-ternary bg-transparent hover:scale-102 transition-all duration-300">
            <CardContent class="flex flex-col sm:flex-row items-center gap-3">
            <img :src="useImageUrl(latestLessonData?.image?.toString()!)" class="w-25" alt="">
            <div class="flex flex-col gap-2 w-full sm:w-50">
                <p class="font-bold text-center sm:text-left">{{ latestLessonData?.title }}</p>
                <p class="text-xs font-semibold opacity-40">{{lessonStore.latestPercentageLesson}}% Completed</p>
                <Progress :model-value="lessonStore.latestPercentageLesson" bg="bg-violet-500" class="h-5" />
            </div>

            <div class="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto">
                <RouterLink :to="latestLessonData ? { name: 'Learn-Phishing', params: { lessonId: latestLessonData.slug } } : ''"
                class="cursor-pointer">
                <Button variant="secondary" class="w-full sm:w-auto">Continue</Button>
                </RouterLink>
            </div>
            </CardContent>

            
        </Card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import Progress from '../ui/progress/Progress.vue';
import { useLessonStore } from '@/stores/lesson';
import type { Lesson_test } from '@/services/lessonService';
import { useImageUrl } from '@/composables/useImageUrl';

const lessonStore = useLessonStore();
const latestLessonData = ref<Lesson_test| null>(null)

onMounted(async () => {
    await lessonStore.fetchLessons();
    await lessonStore.fetchLatestLesson();
    latestLessonData.value = lessonStore.latestLesson   
    
});

</script>
