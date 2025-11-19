<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ModuleStartScreen from '@/components/learn/learnUI/ModuleStartScreen.vue';
import ModuleLayout from '@/components/learn/learnUI/ModuleLayout.vue';
import ModuleSidebar from '@/components/learn/learnUI/ModuleSidebar.vue';
import ModuleContent from '@/components/learn/learnUI/ModuleContent.vue';
import ModuleSidebarItem from '@/components/learn/learnUI/ModuleSidebarItem.vue';
import { useLearningStore } from '@/stores/learning';
import { useRoute, useRouter } from 'vue-router';
import { ChevronRight, Section } from 'lucide-vue-next';
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

import { useModuleStore } from '@/stores/module';
import { useLessonStore } from '@/stores/lesson';
import { useSectionStore } from '@/stores/sections';
import type { ModuleTest } from '@/services/moduleService';
import { useAuthStore } from '@/stores/auth';
const moduleStore = useModuleStore();
const lessonStore = useLessonStore();
const sectionStore = useSectionStore();
const sectionId = route.params.sectionId as string;

onMounted(async () => {


  const lessonId = route.params.lessonId as string;

  if (lessonStore.lessons.length === 0) {
    await lessonStore.fetchLessons();
  }

  lessonStore.setCurrentLesson(lessonId);
  await moduleStore.fetchModules(lessonId);
  await sectionStore.fetchSection(lessonStore.currentLesson?.id || 0);
  sectionStore.setSelectedSection(parseInt(sectionId));
  if(sectionStore.selectedSection?.modules.length === 0) {
    moduleStore.setSelectedModule(sectionStore.selectedSection?.modules[0] as ModuleTest);
    return;
  }

  if (route.query.openQuiz) {
    // 👉 open your quiz
    console.log("Open quiz modal")

    // Check if this page load was a refresh/reload
    const navEntries = performance.getEntriesByType("navigation")
    const isReload = navEntries.length && navEntries[0].type === "reload"

    if (isReload) {
      // 👉 remove only when it's a refresh
      router.replace({
        path: route.path,
        query: {} // clears all query params
      })
    }
  }
});


const isFinalQuizUnlocked = computed(() => {

  return (module: ModuleTest[]) => {
    const nonFinal = module.filter(m => !m.final)
    const anyUnlocked = nonFinal.every(m => m.locked === false)
    return anyUnlocked;
  }
})

const sectionModules = computed(() => {
    return sectionStore.sections
        .filter(section => section.id === parseInt(sectionId))
        .flatMap(section => section.modules);
});

</script>

<template>
  <div class="mt-4"></div>
  <div class="flex justify-center items-center flex-col p-2">
    <div class="flex w-full sm:w-7xl mb-4 text-sm flex-wrap">
      <div>Learn</div>
      <ChevronRight></ChevronRight>
      <RouterLink :to="{ name: 'Learn-Phishing', params: { lessonId: route.params.lessonId } }">
        {{ route.params.lessonId }}
      </RouterLink>
      <ChevronRight></ChevronRight>
      <div>{{sectionStore.selectedSection?.name}}</div>
      <ChevronRight></ChevronRight>
      <div> {{ moduleStore.selectedModule?.title }}</div>
    </div>

    <ModuleLayout>
      <ModuleSidebar class="hidden md:block">
        
        <ModuleSidebarItem v-for="module in sectionModules" :key="module.title"
          :active="module.title === moduleStore.selectedModule?.title" :completed="!module.locked"
          :locked-index="useAuthStore().User.is_admin ? false : (module.final ? !isFinalQuizUnlocked(sectionModules) : false)" @click="moduleStore.setSelectedModule(module)">
          {{ module.title }}
        </ModuleSidebarItem>
      </ModuleSidebar>

      <ModuleContent />
    </ModuleLayout>

  </div>
</template>
