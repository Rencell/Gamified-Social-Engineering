<template>
  <Checkbox :quiz="quiz" />

</template>

<script setup lang="ts">
import Checkbox from '@/components/learn/QuizUI/CheckBox/checkbox.vue'
import coins from '/Home/coin.svg'
import { onMounted } from 'vue';

const emit= defineEmits(['showDown']);
const quiz = {
    question: 'Which psychological principle is being used when a social engineer creates a sense of urgency to manipulate a victim into acting quickly without thinking?',
    options: ['Trust', 'Curiosity', 'Urgency', 'Fear'],
    correctAnswer: ['Trust', 'Curiosity', 'Urgency']
  };

</script>
