<script setup lang="ts">
import LessonCard from '@/components/learn/learnUI/LessonCard.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import ModuleCard from '@/components/learn/learnUI/ModuleCard.vue'
import { useLearningStore } from '@/stores/learning'
import { computed, onMounted, ref } from 'vue';

const learningStore = useLearningStore()
const route = useRoute()
const lessonId = route.params.lessonId as string;
learningStore.loadLessons(lessonId)

learningStore.loadModules()
learningStore.fetchModules()


const isFinalQuizUnlocked = computed(() => {
    return learningStore.isFinalQuizUnlocked
})

const isModuleLocked = computed(() => {
  return (module: any) => {
    if (learningStore.currentLesson()?.locked) return true
    return module.final ? !isFinalQuizUnlocked.value : false
  }
})


</script>

<template>
    <RouterLink :to="{ name: 'Learn' }">
        <div class="flex gap-2 mb-5 text-sm items-center text-accent font-bold">
            <ArrowLeft :size="15"></ArrowLeft> Back
        </div>
    </RouterLink>


    <LessonCard :progress="learningStore.completionPercentage" :description="learningStore.currentLesson()?.description"
        :title="learningStore.currentLesson()?.title" :image="learningStore.currentLesson()?.image"
        :bg="learningStore.currentLesson()?.bg" :locked="learningStore.currentLesson()?.locked">
    </LessonCard>

    <div class="flex flex-col mt-2">
        <ModuleCard v-for="(module, key) in learningStore.modules" :lessonkey="key + 1" :key="module.title"
            :title="module.title" :router-link="`/learn/${lessonId}/session`" :interactive="module.interactive"
            @click="learningStore.setSelectedModule(module)" :locked-index="isModuleLocked(module)" />

    </div>


    <RouterView />
</template>