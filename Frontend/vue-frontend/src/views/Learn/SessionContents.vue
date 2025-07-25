<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
});


const start = ref(false);
</script>

<template>
    <div class="mt-4"></div>
    <!-- <ModuleStartScreen v-if="!start" @start="start = true" /> -->
    
    <div class="flex justify-center items-center flex-col">
        <div class="flex w-7xl mb-4 text-sm">
          <div>Learn</div> 
          <ChevronRight></ChevronRight>
          <div>{{ route.params.lessonId }}</div>
          <ChevronRight></ChevronRight>
          <div>{{ learningStore.selectedModule?.title }}</div>
        </div>
        <ModuleLayout >
            <ModuleSidebar>
                <ModuleSidebarItem 
                    v-for="module in learningStore.currentModules()" 
                    :key="module.title" 
                    :active="module.title === learningStore.selectedModule?.title"
                    :completed="module.interactive"
                    @click="learningStore.setSelectedModule(module)"
                    >
                    {{ module.title }}
                </ModuleSidebarItem>
            </ModuleSidebar>
            
            <ModuleContent />
        </ModuleLayout>
    </div>
</template>
