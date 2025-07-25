<script setup lang="ts">
import { ref } from 'vue';
import DragPair from '../../../QuizUI/DragPair/DragPair.vue'
import type { Question } from '@/components/learn/QuizUI/DragPair/type'
import { useLearningStore } from '@/stores/learning';
const learningStore = useLearningStore();

const sampleQuestions: Question[] = [
    {
        id: 1,
        question: "What is phishing?",
        topAnswer: "A technique to steal sensitive information via email or fake websites.",
        bottomAnswer: "A method of physical intrusion into secure areas.",
        correctAnswer: "top",
        feedback: "Phishing involves tricking individuals into revealing sensitive information through deceptive emails or websites."
    },
    {
        id: 2,
        question: "What is vishing?",
        topAnswer: "A voice-based phishing attack to extract sensitive information.",
        bottomAnswer: "A method of stealing data through fake websites.",
        correctAnswer: "top",
        feedback: "Vishing uses phone calls or voice messages to deceive individuals into sharing confidential information."
    },
    {
        id: 3,
        question: "What is baiting?",
        topAnswer: "A psychological attack using fear.",
        bottomAnswer: "A technique involving luring victims with promises of rewards.",
        correctAnswer: "bottom",
        feedback: "Baiting involves enticing victims with something appealing, like free software, to compromise their security."
    },
    {
        id: 4,
        question: "What is impersonation in social engineering?",
        topAnswer: "Pretending to be someone trustworthy to gain access or information.",
        bottomAnswer: "Using fear to manipulate individuals.",
        correctAnswer: "top",
        feedback: "Impersonation involves pretending to be someone else, like an authority figure, to deceive the target."
    },
    {
        id: 5,
        question: "What is tailgating in social engineering?",
        topAnswer: "Following someone into a secure area without proper authorization.",
        bottomAnswer: "A phishing attack via email.",
        correctAnswer: "top",
        feedback: "Tailgating is a physical security breach where an attacker gains access by following an authorized person."
    },
    {
        id: 6,
        question: "What is social engineering?",
        topAnswer: "A method of manipulating people to divulge confidential information.",
        bottomAnswer: "A technique for encrypting sensitive data.",
        correctAnswer: "top",
        feedback: "Social engineering is the art of manipulating individuals to reveal confidential information or perform actions."
    },
    {
        id: 7,
        question: "In a scenario where urgency is used, what psychological attack is being employed?",
        topAnswer: "Trust",
        bottomAnswer: "Urgency",
        correctAnswer: "bottom",
        feedback: "Urgency is used to pressure individuals into making quick decisions without proper evaluation."
    },
    {
        id: 8,
        question: "In a scenario where fear is used, what psychological attack is being employed?",
        topAnswer: "Fear",
        bottomAnswer: "Trust",
        correctAnswer: "top",
        feedback: "Fear is used to intimidate or scare individuals into taking specific actions."
    },
    {
        id: 9,
        question: "In a scenario where trust is used, what psychological attack is being employed?",
        topAnswer: "Trust",
        bottomAnswer: "Urgency",
        correctAnswer: "top",
        feedback: "Trust is exploited to make individuals feel comfortable sharing sensitive information."
    },
]

const totalCorrect = ref(0);

const handleScoreUpdate = (score: number) => {
    if(score > 2) {
        learningStore.activateModuleInteraction();
    }
    totalCorrect.value = score;
}

</script>


<template>
    <DragPair :questions="sampleQuestions"  @update:score="handleScoreUpdate"></DragPair>
    
</template>