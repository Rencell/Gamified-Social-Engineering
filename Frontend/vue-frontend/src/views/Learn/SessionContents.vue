<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ModuleStartScreen from '@/components/learn/learnUI/ModuleStartScreen.vue';
import ModuleLayout from '@/components/learn/learnUI/ModuleLayout.vue';
import ModuleSidebar from '@/components/learn/learnUI/ModuleSidebar.vue';
import ModuleContent from '@/components/learn/learnUI/ModuleContent.vue';
import ModuleSidebarItem from '@/components/learn/learnUI/ModuleSidebarItem.vue';
import { useLearningStore } from '@/stores/learning'; 
import { useRoute } from 'vue-router';

const learningStore = useLearningStore();

const route = useRoute();

onMounted(() => {
  const lessonId = route.params.lessonId as string;
  learningStore.loadLessons(lessonId);
});


const start = ref(false);
</script>

<template>
    <ModuleStartScreen v-if="!start" @start="start = true" />
    <ModuleLayout v-else>
        <ModuleSidebar>
            <ModuleSidebarItem 
                v-for="module in learningStore.currentModules()" 
                :key="module.title" 
                :active="module.title === learningStore.selectedModule?.title"
                @click="learningStore.setSelectedModule(module)"
                >
                {{ module.title }}
            </ModuleSidebarItem>
        </ModuleSidebar>
        
        <ModuleContent />
    </ModuleLayout>
</template>
