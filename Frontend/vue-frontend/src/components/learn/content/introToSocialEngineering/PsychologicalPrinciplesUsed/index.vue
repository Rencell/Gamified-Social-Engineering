<script setup lang="ts">

import { ref } from 'vue';
import Content1 from './content1.vue'
import Content2 from './content2.vue'
import Content3 from './content3.vue'
import Quiz from './quiz.vue'
import LessonReveal from '../../UI/LessonReveal.vue';

const components = [
  { id: '1', component: Content1 },
  { id: '2', component: Content2 },
  { id: '3', component: Content3 },
  { id: '4', component: Quiz, emits:true }
];

</script>

<template>
  <LessonReveal :components="components" />
</template>
