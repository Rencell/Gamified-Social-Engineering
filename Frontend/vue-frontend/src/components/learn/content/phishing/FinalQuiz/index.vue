<script setup lang="ts">
import LessonReveal from '../../UI/LessonReveal.vue';
import Final from './final.vue'

const components = [
    { id: 1, component: Final }
];

</script>

<template>
    <LessonReveal :components="components" :with-quiz="true" />
</template>
