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
    subject:
      "Congratulations! You have Been Selected for a $500 Amazon Gift Card",
    date: "Yesterday, 3:45 PM",
    content: `
      <div>
        <p class="mb-5">Congratulations!</p>
        <p class="my-4">You have been randomly selected to participate in our quick customer satisfaction survey.</p>
        <p class="my-4"><span class="font-bold text-green-600">Complete our 30-second survey and receive a $500 Amazon gift card absolutely FREE!</span> No purchase necessary.</p>
        <p class="my-4">We only have <span class="font-bold">10 gift cards remaining</span>, so act fast!</p>
        <p class="my-4"><a href="#" class="bg-yellow-400 text-black px-4 py-2 rounded">Take Survey Now</a></p>
        <p class="mt-4">Amazon Customer Rewards Team</p>
      </div>
    `,
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