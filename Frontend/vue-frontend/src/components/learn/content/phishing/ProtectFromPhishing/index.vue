<script setup lang="ts">
import LessonReveal from '../../UI/LessonReveal.vue';
import Content1 from './Content1.vue'
import Content2 from './Content2.vue'
import Content3 from './Content3.vue'
import Content4 from './Content4.vue'
import Content5 from './Content5.vue'
import Quiz from './Quiz.vue'


const components = [
    { id: 1, component: Content1 },
    { id: 2, component: Content2 },
    { id: 3, component: Content3 },
    { id: 4, component: Content4 },
    { id: 5, component: Content5 },
    { id: 6, component: Quiz },
];

</script>

<template>
    <LessonReveal :components="components" />
</template>
