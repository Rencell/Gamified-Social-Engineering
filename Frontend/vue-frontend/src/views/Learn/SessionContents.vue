<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ModuleStartScreen from '@/components/learn/learnUI/ModuleStartScreen.vue';
import ModuleLayout from '@/components/learn/learnUI/ModuleLayout.vue';
import ModuleSidebar from '@/components/learn/learnUI/ModuleSidebar.vue';
import ModuleContent from '@/components/learn/learnUI/ModuleContent.vue';
import ModuleSidebarItem from '@/components/learn/learnUI/ModuleSidebarItem.vue';
import { useLearningStore } from '@/stores/learning'; 
import { useRoute, useRouter } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
const learningStore = useLearningStore();

const route = useRoute();
const router = useRouter();


const toast_alert = () => {
  toast.warning('Unlock first the previous lessons to unlock this.', {
    action: {
      label: 'Close',
      onClick: () => console.log('Closed notification'),
    },
    position: 'top-center',
    duration: 5000,
    style: {
      color: '#ee5253',
    },
  })
}

onMounted(() => {

  const lessonId = route.params.lessonId as string;
  learningStore.loadLessons(lessonId);
  // if(learningStore.currentLesson()?.locked) {
  //   router.push({ name: 'Learn-Phishing', params: { lessonId: lessonId } });
  //   toast_alert();
  //   return;
  // }
  learningStore.fetchLessons();
  learningStore.loadModules();
  learningStore.fetchModules();
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
