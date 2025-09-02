<script setup lang="ts">
import LessonReveal from '../../UI/LessonReveal.vue';
import Content1 from './Content1.vue'
import Content2 from './Content2.vue'
import Content3 from './Content3.vue'
import quiz from './quiz.vue'


const components = [
    {id: 1, component: Content1},
    {id: 2, component: Content2},
    {id: 3, component: Content3},
    {id: 4, component: quiz},
];

</script>

<template>
<LessonReveal :components="components" :with-quiz="true"/>
</template>
