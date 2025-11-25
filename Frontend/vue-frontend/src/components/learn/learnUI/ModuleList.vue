<script setup lang="ts">
import ModuleCard from '@/components/learn/learnUI/ModuleCard.vue'

interface Module {
  title: string;
  routerLink: string;
  interactive: boolean;
  // Add other properties as needed
}

const props = defineProps<{
  modules: Module[]
}>();
</script>

<template>
  <div class="flex flex-col mt-2">
    <!-- <ModuleCard v-for="(module, index) in modules" 
      
      :key="index" 
      :title="module.title" 
      :router-link="module.routerLink"
      :interactive="module.interactive"
      :lessonkey="1" /> -->
  </div>
</template>
