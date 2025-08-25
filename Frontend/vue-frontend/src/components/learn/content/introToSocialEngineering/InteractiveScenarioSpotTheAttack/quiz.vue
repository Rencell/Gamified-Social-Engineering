<script setup lang="ts">
import ScenarioMCQ from '@/components/learn/QuizUI/ScenarioTraining/scenarioMCQ.vue'
import type { Story, ScenarioStep } from '@/components/learn/QuizUI/ScenarioTraining/type';
import ScenarioPlayer from '@/components/learn/QuizUI/ScenarioTraining/scenarioPlayer.vue'
import QuizFlowShell from '@/components/learn/QuizUI/quizFlowShell.vue'

import asset1 from '/Learning/Content/introToSocialEngineering/InteractiveScenario/asset_1.png'
import asset2 from '/Learning/Content/introToSocialEngineering/InteractiveScenario/asset_2.png'
import asset3 from '/Learning/Content/introToSocialEngineering/InteractiveScenario/asset_3.png'
import asset4 from '/Learning/Content/introToSocialEngineering/InteractiveScenario/asset_4.png'
import asset5 from '/Learning/Content/introToSocialEngineering/InteractiveScenario/asset_5.webp'
const scenario: ScenarioStep[] = [
    {
        type: 'story',
        title: 'First Day at Work',
        image: asset1,
        description: [
            "It was Daniel’s first day to work after graduating college. Excited but nervous, his position was in backoffice.",
            "Your task is to help Daniel avoid social engineering attacks thoughout his day.",
        ]
    },
    {
        type: 'mcq',
        question: 'While Daniel is waiting in the lobby, he saw a USB device on the floor. What should he do?',
        position: 'left',
        image: asset2,
        answer: 'B',
        explanation: 'The only move is to report it to IT immediately. Plugging it into his computer could introduce malware or compromise sensitive information.',
        options: [
            { id: 'A', text: 'Pick it up and check it later into his computer.' },
            { id: 'B', text: 'Report it to IT immediately.' },
            { id: 'C', text: 'Ignore it and leave it there.' },
            { id: 'D', text: 'Take it home to check later.' }
        ]
    },
    {
        type: 'story',
        title: 'Colleague Assistance',
        image: asset3,
        description: [
            "While working on his tasks, Daniel was approached by a colleague who mentioned receiving an email that looked urgent. And requires to verify his login credentials.",
            "Would you recognize the social engineering attack here?"
        ]
    },
    {
        type: 'mcq',
        question: 'So Email and taking you urgent? That sounds like a classic...',
        position: 'left',
        image: asset4,
        explanation: 'Phishing is a common social engineering attack where it involes such Email, messages, or websites that appear to be from a trustworthy source.',
        answer: 'C',
        options: [
            { id: 'A', text: 'Tailgating' },
            { id: 'B', text: 'Dumpster Diving' },
            { id: 'C', text: 'Phishing' },
            { id: 'D', text: 'Baiting' }
        ]
    },
    {
        type: 'mcq',
        question: 'Finally shift is done, maybe a little picture of my work post-shift would help me relax?',
        position: 'right',
        image: asset5,
        explanation: 'Sharing work-related content on social media can inadvertently reveal sensitive information about your organization. Always be cautious about what you post online.',
        answer: 'C',
        options: [
            { id: 'A', text: 'Be proud of yourself, and post this on Social media' },
            { id: 'B', text: 'It’s harmless, everyone does it' },
            { id: 'C', text: 'Maybe not, it might reveal more about work than I realize' },
        ]
    },
]

</script>


<template>
    <QuizFlowShell :quiz-component="ScenarioPlayer" :questions="scenario" />
</template>
