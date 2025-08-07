<script setup lang="ts">
import { ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import hackMan from '/Learning/Content/introToSocialEngineering/CommonAttacks/EnableFirewall@3x.png'
import desktopWarning from '/Learning/Content/introToSocialEngineering/CommonAttacks/ExclusiveUsePolicy@3x.png'
import hacks from '/Learning/Content/introToSocialEngineering/CommonAttacks/Hacker.png'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import type { Question } from '@/components/learn/QuizUI/MultipleChoice/type'
import MultipleChoice from '@/components/learn/QuizUI/MultipleChoice/MultipleChoice.vue'
const isPretest = ref(false)

const emit = defineEmits(['showDown'])

const toggleActive = () => {
  emit('showDown', false)
  isPretest.value = true
}

const pretest: Question[] =  [
    {
        image: hacks,
        question: 'What attack that involves tricking a user into revealing sensitive information over the phone?',
        options: [
            { id: 'A', text: 'Phishing' },
            { id: 'B', text: 'Vishing' },
            { id: 'C', text: 'Tailgating' },
            { id: 'D', text: 'Baiting' },
        ],
        correctAnswer: 'B',
        explanation: 'Vishing, or voice phishing, involves using phone calls to trick users into revealing sensitive information.',
    },
    {
        image: desktopWarning,
        question: 'What attack involves gaining physical access to a restricted area by following an authorized person?',
        options: [
            { id: 'A', text: 'Vishing' },
            { id: 'B', text: 'Impersonation' },
            { id: 'C', text: 'Tailgating' },
            { id: 'D', text: 'Baiting' },
        ],
        correctAnswer: 'C',
        explanation: 'Tailgating is a physical security breach where an unauthorized person follows an authorized individual into a restricted area.',
    },
]
</script>

<template>
    <div v-if="!isPretest" class="snap-start min-h-screen flex flex-col items-center justify-center">

        <LearningImage :image="hackMan" />

        <LearningSection>
            <LearningHeader>
                Different Types of Attacks
            </LearningHeader>
            <LearningBody>
                Understanding the different types of social engineering attacks is crucial for recognizing and defending
                against them.

            </LearningBody>
            <LearningBody>
                But before we dive into the types of attacks, let's take a Pre-test.
            </LearningBody>
            <Button variant="link" size="lg" @click="toggleActive">
                <ChevronRight></ChevronRight>Take Pre-test
            </Button>
        </LearningSection>


    </div>

    <div v-else class="snap-start min-h-screen flex flex-col items-center justify-center">
        <MultipleChoice :pretest="pretest" />
    </div>
</template>
