<script setup lang="ts">
import QuestionCard from '../../UI/Question/QuestionCard.vue'
import type { Question } from '@/components/learn/QuizUI/DragPair/type'
import DragPair from '../../../QuizUI/DragPair/DragPair.vue'
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue';
import { onMounted } from 'vue';

const sampleQuestions: Question[] = [
    {
        id: 1,
        question: "What is phishing?",
        topAnswer: "A technique to steal sensitive information via email or fake websites.",
        bottomAnswer: "A method of physical intrusion into secure areas.",
        correctAnswer: "top",
        feedback: "Phishing involves tricking individuals into revealing sensitive information through deceptive emails or websites."
    },
    {
        id: 2,
        question: "What is vishing?",
        topAnswer: "A voice-based phishing attack to extract sensitive information.",
        bottomAnswer: "A method of stealing data through fake websites.",
        correctAnswer: "top",
        feedback: "Vishing uses phone calls or voice messages to deceive individuals into sharing confidential information."
    },
]
const emit = defineEmits(['showDown'])
onMounted(() => {
    emit('showDown', false)
})
</script>

<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <QuizFlowShell :quiz-component="DragPair" :questions="sampleQuestions" />
    </div>
</template>