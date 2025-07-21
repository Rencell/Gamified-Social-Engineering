<script setup lang="ts">
import { ref } from 'vue';
import DragPair from '../../../QuizUI/DragPair/DragPair.vue'

interface Question {
    id: number
    question: string
    topAnswer: string
    bottomAnswer: string
    correctAnswer: "top" | "bottom"
}

const sampleQuestions: Question[] = [
    {
        id: 1,
        question: "What literary device does Sterne use to make comparisons between seemingly unrelated subjects?",
        topAnswer: "Metaphor",
        bottomAnswer: "Analogy",
        correctAnswer: "bottom",
    },
    {
        id: 2,
        question: "Which technique involves giving human characteristics to non-human things?",
        topAnswer: "Personification",
        bottomAnswer: "Alliteration",
        correctAnswer: "top",
    },
    {
        id: 3,
        question: "What is the repetition of consonant sounds at the beginning of words called?",
        topAnswer: "Assonance",
        bottomAnswer: "Alliteration",
        correctAnswer: "bottom",
    },
]

const totalCorrect = ref(0);

const handleScoreUpdate = (score: number) => {
    totalCorrect.value = score;
}

</script>


<template>
    <DragPair :questions="sampleQuestions" :feedback="'nigga'" @update:score="handleScoreUpdate"></DragPair>
    
</template>