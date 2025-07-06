<script setup lang="ts">
import ProgressCircle from '@/components/learn/learnUI/ProgressCircle.vue';
import LessonCard from '@/components/learn/learnUI/LessonCard.vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();

</script>


<template>

    <div>
        <p class="font-bold text-3xl mb-4">Learning</p>

        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <RouterLink :to="`${route.path}/Phishing`"><LessonCard :progress="75" title="Phishing"></LessonCard></RouterLink>
        </div>
    </div>
</template>