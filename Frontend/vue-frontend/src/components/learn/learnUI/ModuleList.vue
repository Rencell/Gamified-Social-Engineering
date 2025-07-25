<script setup lang="ts">
import ModuleCard from '@/components/learn/learnUI/ModuleCard.vue'

defineProps({
  modules: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <div class="flex flex-col mt-2">
    <ModuleCard v-for="(module, index) in modules" 
      :key="index" 
      :title="module.title" 
      :router-link="module.routerLink"
      :interactive="module.interactive" />
  </div>
</template>
