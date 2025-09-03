  <script setup lang="ts">
  import Content1 from './content1.vue'
  import Phishing from './Phishing.vue'
  import Baiting from './Baiting.vue'
  import Impersonation from './Impersonation.vue'
  import SocialMedia from './SocialMedia.vue'
  import Tailgating from './Tailgating.vue'
  import DumpsterDiving from './DumpsterDiving.vue'
  import Others from './Others.vue'
  import LessonReveal from '../../UI/LessonReveal.vue'
  import Quiz from './quiz.vue'
  const components = [
    { id: '1', component: Content1 },
    { id: '2', component: Phishing },
    { id: '3', component: Baiting },
    { id: '4', component: DumpsterDiving },
    { id: '5', component: SocialMedia },
    { id: '6', component: Tailgating },
    { id: '7', component: Others },
    { id: '8', component: Quiz },
  ];

</script>

<template>
  <LessonReveal :components="components" :with-quiz="true" />
</template>
