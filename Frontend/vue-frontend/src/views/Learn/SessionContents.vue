<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ModuleStartScreen from '@/components/learn/learnUI/ModuleStartScreen.vue';
import ModuleLayout from '@/components/learn/learnUI/ModuleLayout.vue';
import ModuleSidebar from '@/components/learn/learnUI/ModuleSidebar.vue';
import ModuleContent from '@/components/learn/learnUI/ModuleContent.vue';
import ModuleSidebarItem from '@/components/learn/learnUI/ModuleSidebarItem.vue';
import { useLearningStore } from '@/stores/learning'; 
import { useRoute } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';
const learningStore = useLearningStore();

const route = useRoute();

onMounted(() => {
  const lessonId = route.params.lessonId as string;
  learningStore.loadLessons(lessonId);
  learningStore.loadModules();
  learningStore.fetchModules();
  learningStore.fetchLessons();
  learningStore.fetchLatestLesson();
});

const isFinalQuizUnlocked = computed(() => {
    return learningStore.isFinalQuizUnlocked
})

const start = ref(false);
</script>

<template>
    <div class="mt-4"></div>
    <!-- <ModuleStartScreen v-if="!start" @start="start = true" /> -->
    
    <div class="flex justify-center items-center flex-col p-2">
        <div class="flex w-full sm:w-7xl mb-4 text-sm flex-wrap">
          <div>Learn</div> 
          <ChevronRight></ChevronRight>
          <RouterLink :to="{ name: 'Learn-Phishing', params: { lessonId: route.params.lessonId }}">
            {{ route.params.lessonId }}
            </RouterLink>
          <ChevronRight></ChevronRight>
          <div> {{ learningStore.selectedModule ? learningStore.selectedModule.title : '' }}</div>
        </div>
        <ModuleLayout >
            <ModuleSidebar class="hidden md:block">
                <ModuleSidebarItem 
                    v-for="module in learningStore.modules" 
                    :key="module.title" 
                    :active="module.title === learningStore.selectedModule?.title"
                    :completed="module.interactive"
                    :locked-index="module.final ? !isFinalQuizUnlocked : false"
                    @click="learningStore.setSelectedModule(module)"
                    >
                    {{ module.title }}
                </ModuleSidebarItem>
            </ModuleSidebar>
            
            <ModuleContent />
        </ModuleLayout>
    </div>
</template>
