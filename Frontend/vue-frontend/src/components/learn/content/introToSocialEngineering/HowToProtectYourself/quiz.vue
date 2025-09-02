<template>
    <!-- <DoDont :questions="questions" /> -->

    <QuizFlowShell 
        :questions="questions" 
        :quiz-component="DoDont" 
    />
</template>

<script setup lang="ts">
import DoDont from '@/components/learn/QuizUI/DoDont/DoDont.vue'
import type { Question } from '@/components/learn/QuizUI/DoDont/type';
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue'
import { onMounted } from 'vue';

const emit = defineEmits(['showDown']);

const questions: Question[] = [
    {
        text: 'Trust no one: Always verify before you trust, even your family or colleagues can be a weakest spot of security.',
        answer: 0
    },
    {
        text: 'Beware of free: Offers that seem too good to be true, such as free gifts or prizes, are often used to trick you into giving away personal information.',
        answer: 0
    },
    {
        text: "Don't overshare on Facebook: Or in any other social media because attackers can use your information for security questions that will trouble your accounts.",
        answer: 0
    },
    {
        text: "Involves Money: Don't be easily fooled with quick-rich promises, this is just a classic psychological tactics that test your greed and urgency.",
        answer: 0
    },
    {
        text: 'Understand Social Engineering Tactics: By learning how social engineers operate, you can better recognize and avoid their schemes. Stay informed through reputable online resources or attend security awareness seminars.',
        answer: 0
    },
    {
        text: 'Change your passwords: At least change your passwords every 3 months, and use a password manager to generate and store complex passwords.',
        answer: 0
    },
    {
        text: 'Use temporary email addresses: When signing up for services, use temporary email addresses to avoid spam and protect your primary email from phishing attacks.',
        answer: 0
    },
];

onMounted(() => {
    emit('showDown', false);
});

</script>
