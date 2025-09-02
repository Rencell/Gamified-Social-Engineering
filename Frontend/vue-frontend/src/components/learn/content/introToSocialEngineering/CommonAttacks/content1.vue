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
import type { MultipleChoice as Question } from '@/components/learn/QuizUI/MultipleChoice/type'
import MultipleChoice from '@/components/learn/QuizUI/MultipleChoice/MultipleChoice.vue'
import Phishing from './Phishing.vue'
import Tailgating from './Tailgating.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningContent from '../../UI/Learning/Core/LearningContent.vue'
const isPretest = ref(false)
const finishTest = ref(false)




const pretest: Question[] = [
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
        moduleExplanation: Phishing
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
        moduleExplanation: Tailgating
    },
]
</script>

<template>
    <LearningContent>

        <LearningImage :image="hackMan" />

        <LearningSection>
            <LearningHeader>
                Different Types of Attacks
            </LearningHeader>
            <LearningBody>
                Understanding the different types of social engineering attacks is crucial for recognizing and defending
                against them. While also mentioning some unusual or unexpected types of scams such as <LearningSpan>
                    dumpster diving</LearningSpan>, which, while they
                sound a bit silly, in reality, are very effective.

            </LearningBody>

            <LearningBody>
                <LearningSpan>
                    We will cover the following main topics
                </LearningSpan>
            </LearningBody>

            <LearningBody>
                <LearningList>
                    <LearningListItem size="lg">
                        Phishing
                    </LearningListItem>
                    <LearningListItem size="lg">
                        Baiting
                    </LearningListItem>
                    <LearningListItem size="lg">
                        Dumpster diving
                    </LearningListItem>
                    <LearningListItem size="lg">
                        Tailgating
                    </LearningListItem>
                </LearningList>
            </LearningBody>
        </LearningSection>


    </LearningContent>
        

</template>
