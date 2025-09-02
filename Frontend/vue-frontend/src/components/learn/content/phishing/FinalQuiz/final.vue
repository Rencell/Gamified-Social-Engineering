<script setup lang="ts">
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import FinalQuizFlowShell from '@/components/learn/FinalSummaryUI/FinalQuizFlowShell.vue'
import type { PhishingEmailQuestion } from '@/components/learn/QuizUI/Phishing/PhishingOrNot/type'
import PhishingOrNot from '@/components/learn/QuizUI/Phishing/PhishingOrNot/PhishingOrNot.vue'

const data: PhishingEmailQuestion[] = [
    {
        type: 'EMAIL',
        question: "Your bank sends you an email stating there has been suspicious activity on your account and asks you to click a link to verify your information.",
        options: [
            { id: 'A', text: 'This is a phishing attempt.' },
            { id: 'B', text: 'This is a legitimate email from your bank.' },
        ],
        answer: 'A',
        email: {
            from: "1",
            subject: "2",
            date: "3",
            link: {
                text: "Click here to verify your account",
                url: "https://suspicious-link.example.com"
            },
            body: [
                "Dear Customer,",
                "We have noticed suspicious activity on your account. Please verify your account information immediately to avoid service interruption.",
                "link",
                "Regards,",
                "Your Bank",
            ]
        },
    },
    {
        type: 'SMS',
        question: "Your bank sends you an SMS stating there has been suspicious activity on your account and asks you to click a link to verify your information.",
        options: [
            { id: 'A', text: 'This is a phishing attempt.' },
            { id: 'B', text: 'This is a legitimate message from your bank.' },
        ],
        answer: 'A',
        sms: {
            number: "+1 (555) 123-4567",
            date: "Today, 10:15 AM",
            message: "We have noticed suspicious activity on your account. Please verify your account information immediately to avoid service interruption. Click here: https://suspicious-link.example.com"
        },
    }
];
</script>

<template>
    <LearningContent>
        <FinalQuizFlowShell :quiz-component="PhishingOrNot" :questions="data" />
        <!-- <PhishingOrNot :data="data" /> -->
    </LearningContent>
</template>