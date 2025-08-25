<template>
  <!-- <Checkbox :quiz="quiz" /> -->
  <QuizFlowShell :quiz-component="matchingType" :questions="wordPairs"/>
</template>

<script setup lang="ts">
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue'
import matchingType from '@/components/learn/QuizUI/MatchingType/matchingType.vue';
import type { WordPair } from '@/components/learn/QuizUI/MatchingType/type';
import { onMounted } from 'vue';
const emit = defineEmits(['showDown']);


const wordPairs: WordPair[] = [
  { match_A: "excitement", match_B: "emoción" },
  { match_A: "mushroom", match_B: "hongo" },
  { match_A: "cookbook", match_B: "recetario" },
  { match_A: "octopus", match_B: "pulpo" },
  { match_A: "make someone mad", match_B: "hacer enojar" },
];
  
onMounted(() => {
  emit('showDown', false);
});
</script>
