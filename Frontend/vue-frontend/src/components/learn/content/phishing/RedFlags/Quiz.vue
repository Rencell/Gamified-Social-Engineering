<template>
    <QuizFlowShell :quiz-component="PhishingTactics" :questions="[]" />
</template>

<script setup lang="ts">
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue'
import PhishingTactics from '@/components/learn/QuizUI/Phishing/GuessTactics/PhishingTactics.vue'
import type { Tactic } from '@/components/learn/QuizUI/Phishing/GuessTactics/type.ts';





</script>