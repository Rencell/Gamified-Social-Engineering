<template>
    <QuizFlowShell :quiz-component="PhishingTactics" :questions="questions" />
</template>

<script setup lang="ts">
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue'
import PhishingTactics from '@/components/learn/QuizUI/Phishing/GuessTactics/PhishingTactics.vue'
import type { Tactic } from '@/components/learn/QuizUI/Phishing/GuessTactics/type.ts';


const questions: Tactic[] = [
{
    type: "email",
    sender: "rewards@amazn-survey.com",
    subject: "Congratulations! You have Been Selected for a $500 Amazon Gift Card",
    date: "Yesterday, 3:45 PM",
    content: [
      "Congratulations!",
      "You have been randomly selected to participate in our quick customer satisfaction survey.",
      "Complete our 30-second survey and receive a $500 Amazon gift card absolutely FREE! No purchase necessary.",
      "We only have 10 gift cards remaining, so act fast!",
      "#Take Survey Now",
      "Amazon Customer Rewards Team"
    ],
    options: [
    { id: 'A', text: 'Sense of urgency' },
    { id: 'B', text: 'Authority Impersonation' },
    { id: 'C', text: 'Too Good To Be True Rewards' },
    { id: 'D', text: 'Not Phishing' },
    ],
    correctAnswer: "A",
  },
]



</script>