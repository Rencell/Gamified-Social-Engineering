<template>
    <div class="flex flex-col gap-3 ">
        <p class="text-xl font-semibold">My Learning</p>
        <p class="text-ternary text-sm font-semibold"> Pick up where you left</p>

        <Card class="border-1 border-b-5 border-ternary bg-transparent hover:scale-102 transition-all duration-300">
            <CardContent class="flex items-center gap-3 ">
                <img :src="latestLessonData?.image" class="w-25" alt="">
                <div class="flex flex-col gap-2 w-50">
                    <p class="font-bold">{{ latestLessonData?.title }}</p>
                    <p class="text-xs font-semibold opacity-40">{{learningStore.latestPercentageLesson}}% Completed</p>
                    <Progress :model-value=learningStore.latestPercentageLesson bg="bg-violet-500" class="h-5" />
                </div>

                <div class="ml-auto">
                    <RouterLink :to="latestLessonData ? { name: 'Learn-Phishing', params: { lessonId: latestLessonData.id } } : ''"
                    class="cursor-pointer">
                        
                        <Button variant="secondary">Continue</Button>
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
import { useLearningStore } from '@/stores/learning';
import type { Lesson } from '@/stores/types/learning';
const learningStore = useLearningStore();
const latestLessonData = ref<Lesson| null>(null)

onMounted(async () => {
    await learningStore.fetchLatestLesson();
    latestLessonData.value = learningStore.latestLesson?.[0] ?? null; 
});

</script>