<script setup lang="ts">
import QuestionCard from '../../UI/Question/QuestionCard.vue'
import type { Question } from '@/components/learn/QuizUI/FillBlank/type';
import FillBlank from '@/components/learn/QuizUI/FillBlank/FillBlank.vue'

const questions: Question[] = [
    {
        text: "What is the capital of France?",
        answer: "hey"
    },
    {
        text: "What is the largest planet in our solar system?",
        answer: "hey"
    },
    {
        text: "What is the chemical symbol for water?",
        answer: "hey"
    }
];

</script>

<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <FillBlank :questions="questions" />
    </div>
</template>