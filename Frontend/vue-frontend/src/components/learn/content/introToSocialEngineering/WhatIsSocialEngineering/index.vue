<script setup lang="ts">
import Content1 from './content1.vue'
import Content2 from './content2.vue'
import LessonReveal from '../../UI/LessonReveal.vue'
import Achieved from '@/components/learn/QuizUI/achieved.vue'

const components = [
  { id: '1', component: Content1 },
  { id: '2', component: Content2 }
];

</script>

<template>
  <LessonReveal :components="components" />
  <hr>

</template>
