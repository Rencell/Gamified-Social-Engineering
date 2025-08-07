<script setup lang="ts">
import Content1 from './content1.vue'
import Content2 from './content2.vue'
import LessonReveal from '../../UI/LessonReveal.vue'
import moduleReward from '@/components/learn/rewardUI/moduleReward.vue';

const components = [
  { id: '1', component: Content1},
  { id: '2', component: Content2 },
  { id: '3', component: moduleReward, emits:true  },
];

</script>

<template>
  <LessonReveal :components="components" :with-quiz="true"/>
  

</template>
