<script setup lang="ts">
import Content1 from './content1.vue'
import Content2 from './content2.vue'
import ScrollReveal from '../../UI/ScrollReveal.vue'

const components = [
  { id: '1', component: Content1 },
  { id: '2', component: Content2 }
];

</script>

<template>
  <ScrollReveal :components="components" />
</template>
