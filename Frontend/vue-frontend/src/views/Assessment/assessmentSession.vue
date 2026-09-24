<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Intro from './intro.vue'


import { useRoute, useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessment';
import Playing from './playing.vue'
import { Button } from '@/components/ui/button';
import Timeout from './timeout.vue'

const route = useRoute();
const assessmentStore = useAssessmentStore();
onMounted(async() => {
    await assessmentStore.existing_session(route.params.id as string);
});
const shibal = ref(true);

const status = computed(() => {
    return assessmentStore.currentSession?.status;
});
</script>

<template>

    <Timeout v-if="status === 'timeout'" />
    <Playing  v-else/>
    <!-- <Intro v-else /> -->
</template>