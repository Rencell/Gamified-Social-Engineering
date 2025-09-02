<template>
    <QuizFlowShell :quiz-component="TwoImage" :questions="question" />
</template>

<script setup lang="ts">
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue'
import TwoImage from '@/components/learn/QuizUI/TwoImageTest/TwoImage.vue'
import type { TwoImage as TwoImageType } from '@/components/learn/QuizUI/TwoImageTest/type'
import asset1 from '/Learning/Content/phishing/RealWorldExample/Content2/asset1.webp'
const question: TwoImageType[] = [
    {
        Question: "Which image is a phishing email?",
        image1: asset1,
        image2: asset1,
        answer: "image1",
        explanation: ''
    },
]
</script>