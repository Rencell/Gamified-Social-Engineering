  <script setup lang="ts">
  import Content1 from './content1.vue'
  import Phishing from './Phishing.vue'
  import Baiting from './Baiting.vue'
  import Impersonation from './Impersonation.vue'
  import SocialMedia from './SocialMedia.vue'
  import Tailgating from './Tailgating.vue'
  import Others from './Others.vue'
  import LessonReveal from '../../UI/LessonReveal.vue'
  import Question from './question.vue'
  const components = [
    { id: '1', component: Content1, next:false },
    { id: '2', component: Phishing },
    { id: '3', component: Baiting },
    { id: '4', component: Impersonation },
    { id: '5', component: SocialMedia },
    { id: '6', component: Tailgating },
    { id: '7', component: Others },
    { id: '8', component: Question }
  ];

</script>

<template>
  <LessonReveal :components="components" />
</template>
