<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import LessonCard from '@/components/learn/learnUI/LessonCard.vue';
import { RouterLink, useRoute } from 'vue-router';
import { useLearningStore } from '@/stores/learning';
import { ChevronDown } from 'lucide-vue-next';
import vector from '/Home/vector path.svg'
import vector2 from '/Home/vector path2.svg'
import { onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import asset from '/Human.webp'
import Card from '@/components/ui/card/Card.vue';
import { CardContent } from '@/components/ui/card';
import fire from '/Learning/fire.svg'
import fire_greyed from '/Learning/fire-greyed.svg'
import DayStreak from '@/components/learn/dayStreak/DayStreak.vue'
const learningStore = useLearningStore();
const route = useRoute();

onMounted(async () => {
    await learningStore.fetchLessons();
    await learningStore.fetchLatestLesson();
    


});
</script>

<template>

    <div class="p-2 sm:p-5">
        <p class="font-bold text-3xl mb-4">Learning</p>
        
        <div class="flex flex-col sm:flex-row gap-10 ">
            <div class="flex-2 grid grid-cols-1 gap-4">
                <RouterLink v-for="(lesson, index) in learningStore.lessons" :key="lesson.id"
                    :to="`${route.path}/${lesson.id}`">
    
                    <div>
                        <LessonCard
                            :class="[lesson.locked 
                                ? 'opacity-50 cursor-not-allowed border-1 border-ternary rounded-4xl' : 
                                'cursor-pointer  rounded-4xl',
                                ]"
                            :index="index + 1"
                            :isLatest="!!(learningStore.latestLesson && learningStore.latestLesson[0]?.id === lesson.id)"
                            :progress="learningStore.completionPercentage" 
                            :title="lesson.title" 
                            :image="lesson.image"
                            :bg="lesson.bg"
                            :module-count="lesson.modules.length"
                            :locked="lesson.locked" />

                    </div>
                </RouterLink>
            </div>
    
            <DayStreak />
        </div>

       
    </div>
</template>