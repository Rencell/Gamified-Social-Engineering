<script setup lang="ts">
import LessonCard from '@/components/learn/learnUI/LessonCard.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink, RouterView } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import ModuleCard from '@/components/learn/learnUI/ModuleCard.vue'
import { useLearningStore } from '@/stores/learning'

const learningStore = useLearningStore()
</script>

<template>
    <RouterLink :to="{ name: 'Learn' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>
    <LessonCard :progress="75" title="Phishing"></LessonCard>
    <div class="flex flex-col mt-2">
        <ModuleCard 
            v-for="module in learningStore.phishingModules" 
            :key="module.title" :title="module.title"
            :router-link="module.routerLink" :interactive="module.interactive" />

    </div>



    <RouterView />
</template>