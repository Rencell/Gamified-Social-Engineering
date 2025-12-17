<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import LessonReveal from './UI/LessonReveal.vue';
import { useContentStore } from '@/stores/content';
import { useRoute } from 'vue-router';
import { useModuleStore } from '@/stores/module';
import { useLessonStore } from '@/stores/lesson';
import Quiz from './quiz.vue';
import Content1 from './phishing/ProtectFromPhishing/Content1.vue'
import Loading from '@/components/loading.vue';
import Citation from './UI/Learning/Highlight/Citation.vue';

const route = useRoute();
const moduleStore = useModuleStore();
const lessonStore = useLessonStore();
const lessonId = route.params.lessonId as string;
const contentStore = useContentStore();
const lesson = computed(() =>
  lessonStore.lessons.find((lesson) => lesson.id === Number(lessonId))
);
const isLoading = ref(false);
onMounted(async () => {

  isLoading.value = true;
  try {
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

  }finally {
    isLoading.value = false;
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

const test = ref({
  id: 10,
  component: Content1,
});

// import index from './phishing/WhatIsPhishing/index.vue';
const finalpush = computed(() => [...contentStore.components, final.value]);

</script>

<template>
  <Loading v-if="isLoading"></Loading>
  <LessonReveal v-else :components="finalpush" :with-quiz="true" :key="moduleStore.selectedModule?.id!" />
  <!-- <Citation
        title="Sources"
        :sources="[
          { label: '[1]', text: 'Understanding Vue reactivity and component patterns.', href: 'https://vuejs.org/guide/introduction.html', linkText: 'Vue Docs' },
          { label: '[2]', text: 'Smooth scrolling and DOM APIs overview.', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior', linkText: 'MDN scroll-behavior' },
          { label: '[3]', text: 'Component communication via emits and props.' }
        ]"
      /> -->
</template>