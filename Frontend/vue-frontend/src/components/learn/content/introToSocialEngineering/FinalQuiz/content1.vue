<template>

    <FinalQuizFlowShell :quiz-component="FinalTest" :questions="Questions" />
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Test } from '@/components/learn/QuizUI/FInalTest/type';

import content1 from '/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/content1.webp'
import image from '/Human.webp'
import FinalQuizFlowShell from '@/components/learn/FinalSummaryUI/FinalQuizFlowShell.vue'
import FinalTest from '@/components/learn/QuizUI/FInalTest/FinalTest.vue'

const Questions: Test[] = [

    {
        image: image,
        question: "What is the capital of France?",
        type: 'true-false',
        answer: 'True',
        explanation: "Paris is the capital of France.",
    },
    {
        image: image,
        question: "What is the capital of France?",
        type: "multiple-choice",
        options: [
            { id: "a", text: "Berlin" },
            { id: "b", text: "Madrid" },
            { id: "c", text: "Paris" },
            { id: "d", text: "Rome" }
        ],
        correctAnswer: "c",
        explanation: "Paris is the capital of France.",
    },
    {
        Question: "Which image depicts a phishing attempt?",
        type: 'two-image',
        image1: content1,
        image2: content1,
        answer: 'image1',
        explanation: 'hey'
    }
];

const emit = defineEmits(['showDown']);
onMounted(() => {
    emit('showDown', false);
});

</script>