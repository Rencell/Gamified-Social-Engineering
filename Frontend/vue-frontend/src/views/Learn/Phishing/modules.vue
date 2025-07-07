<script setup lang="ts">
import LessonCard from '@/components/learn/learnUI/LessonCard.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import ModuleCard from '@/components/learn/learnUI/ModuleCard.vue'
import { useLearningStore } from '@/stores/learning'

const learningStore = useLearningStore();
const route = useRoute();

// Load the lesson immediately based on the route parameter
const lessonId = route.params.lessonId as string;
learningStore.loadLesson(lessonId);
</script>

<template>
    <RouterLink :to="{ name: 'Learn' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>
    <LessonCard :progress="75" :title="learningStore.currentLesson?.title"></LessonCard>
    <div class="flex flex-col mt-2">
        <ModuleCard v-for="module in learningStore.currentModules" 
            :key="module.title" 
            :title="module.title"
            :router-link="`/learn/${lessonId}/session`" 
            :interactive="module.interactive" 
        />

    </div>



    <RouterView />
</template>