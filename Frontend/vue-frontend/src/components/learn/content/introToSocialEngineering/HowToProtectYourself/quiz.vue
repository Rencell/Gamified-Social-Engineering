<template>
    <DoDont :questions="questions" />
</template>

<script setup lang="ts">
import DoDont from '@/components/learn/QuizUI/DoDont/DoDont.vue'
import type { Question } from '@/components/learn/QuizUI/DoDont/type';

const questions: Question[] = [
    {
        text: 'use the same password for several accounts',
        answer: 0
    },
    {
        text: 'share your personal information on social media',
        answer: 0
    },
    {
        text: 'click on suspicious email links',
        answer: 0
    },
    {
        text: 'use public Wi-Fi for banking',
        answer: 0
    },
    {
        text: 'use two-factor authentication',
        answer: 1
    },
    {
        text: 'save passwords in your browser',
        answer: 0
    },
    {
        text: 'download software from unknown sources',
        answer: 0
    },
    {
        text: 'ignore software updates',
        answer: 0
    },
    {
        text: 'backup your important data regularly',
        answer: 1
    },
    {
        text: 'check privacy settings on apps',
        answer: 1
    },
];

</script>
