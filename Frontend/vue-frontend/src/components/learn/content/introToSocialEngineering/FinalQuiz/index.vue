<template>
  <LessonReveal :components="components" />
</template>

<script setup lang="ts">
import LessonReveal from '../../UI/LessonReveal.vue';
import Content1 from './content1.vue'
import FinalQuizSummary from '@/components/learn/FinalSummaryUI/FinalAchivements.vue'
import FinalSummary from '@/components/learn/FinalSummaryUI/FinalSummary.vue'

const components = [
  { id: '1', component: Content1 },
  ];
</script>
