<script setup lang="ts">
import { ref } from 'vue';
import DragPair from '../../../QuizUI/DragPair/DragPair.vue'
import type { Question } from '@/components/learn/QuizUI/DragPair/type'


const sampleQuestions: Question[] = [
    {
        id: 1,
        question: "What literary device does Sterne use to make comparisons between seemingly unrelated subjects?",
        topAnswer: "Metaphor",
        bottomAnswer: "Analogy",
        correctAnswer: "bottom",
        feedback: "Analogy is used to compare seemingly unrelated subjects, while metaphor is a direct comparison."
    },
    {
        id: 2,
        question: "Which technique involves giving human characteristics to non-human things?",
        topAnswer: "Personification",
        bottomAnswer: "Alliteration",
        correctAnswer: "top",
        feedback: "Personification gives human traits to non-human things; alliteration is about repeating consonant sounds."
    },
    {
        id: 3,
        question: "What is the repetition of consonant sounds at the beginning of words called?",
        topAnswer: "Assonance",
        bottomAnswer: "Alliteration",
        correctAnswer: "bottom",
        feedback: "Alliteration is the repetition of consonant sounds at the start of words; assonance is about vowel sounds."
    },
]

const totalCorrect = ref(0);

const handleScoreUpdate = (score: number) => {
    totalCorrect.value = score;
}

</script>


<template>
    <DragPair :questions="sampleQuestions"  @update:score="handleScoreUpdate"></DragPair>
    
</template>