<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import LessonReveal from './UI/LessonReveal.vue';
import { useContentStore } from '@/stores/content';
import { useRoute } from 'vue-router';
import { useModuleStore } from '@/stores/module';
import { useLessonStore } from '@/stores/lesson';
import Quiz from './quiz.vue';
const route = useRoute();
const moduleStore = useModuleStore();
const lessonStore = useLessonStore();
const lessonId = route.params.lessonId as string;
const contentStore = useContentStore();


onMounted(async () => {
  if (lessonStore.lessons.length === 0) {
    await lessonStore.fetchLessons();
  }

  lessonStore.setCurrentLesson(lessonId);
  await moduleStore.fetchModules(lessonId);

  final.value.id = lessonStore.currentLesson?.id || 9;
  
  // Fetch contents for the initial module
  if (moduleStore.selectedModule?.id) {
    await contentStore.fetchContents(moduleStore.selectedModule.id);
  }
});

// Watch for changes to `moduleStore.selectedModule?.id`
watch(
  () => moduleStore.selectedModule?.id,
  async (newModuleId, oldModuleId) => {
    if (newModuleId && newModuleId !== oldModuleId) {
      console.log(`Module ID updated: ${newModuleId}`);
      await contentStore.fetchContents(newModuleId);
    }
  },
  { immediate: true }
);

const final = ref({
  id: 9,
  component: Quiz,
});

const finalpush = computed(() => [...contentStore.components, final.value]);
</script>

<template>
  <LessonReveal :components="finalpush" :with-quiz="true" :key="moduleStore.selectedModule?.id!" />
</template>