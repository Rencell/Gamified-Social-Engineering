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
  { match_A: "Complimenting", match_B: "Building connection through praise" },
  { match_A: "Trust", match_B: "Exploiting confidence with fake identity" },
  { match_A: "Fear and Urgency", match_B: "Forcing quick decisions with threats" },
  { match_A: "Curiosity", match_B: "Triggering interest to uncover hidden info" },
  { match_A: "Impersonation", match_B: "Pretending to be someone you know" },
];
  
onMounted(() => {
  emit('showDown', false);
});
</script>
