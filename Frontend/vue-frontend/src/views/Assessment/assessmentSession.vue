<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Intro from './intro.vue'


import { useRoute, useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessment';
import Playing from './playing.vue'

const route = useRoute();
const assessmentStore = useAssessmentStore();
onMounted(async() => {
    await assessmentStore.existing_session(route.params.id as string);
});
const shibal = ref(true);
</script>

<template>
    <Playing v-if="shibal" />
    <Intro v-else />
</template>