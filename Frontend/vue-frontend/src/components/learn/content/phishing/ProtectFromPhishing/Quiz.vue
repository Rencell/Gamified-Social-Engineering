<template>
<QuizFlowShell :quiz-component="DoDont" :questions="questions" />
</template>

<script setup lang="ts">
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue'
import DoDont from '@/components/learn/QuizUI/DoDont/DoDont.vue'
import type { Question } from '@/components/learn/QuizUI/DoDont/type'

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
]

</script>