<template>

    <LearningContent>
        <LearningSection>
            <LearningHeader>
                The Art of Manipulation
            </LearningHeader>
            <LearningImage2 :image="content4_assets" />

            <LearningHeader>
                Fear and Urgency
            </LearningHeader>

            <LearningBody>
                While scrolling online you often see such messages lik “Hurry, only 2 left” or “expires in 30 minutes.”
                These messages create a sense of urgency, making you feel like you need to act quickly to avoid missing
                out on a great deal or opportunity.
            </LearningBody>

            <LearningBody>
                This tactic is designed to bypass your critical thinking, pushing you to buy, click, or share
                information without
                stopping to verify if the offer is real.
            </LearningBody>

            <LearningBody>
                <LearningSpan>How do you defend against this?</LearningSpan>
            </LearningBody>

            <InteractiveMCQ :mcq="mcq" @showDown="emit('showDown', true)">
                <template #lesson>
                    <LearningSection>
                        <LearningList>
                            <LearningListItem>
                                <LearningSpan>Good-To-Be-True offers:</LearningSpan> Always be wary of products like
                                software or games that are offered at unbelievably low prices or for free. Because
                                they often come with hidden risks.
                            </LearningListItem>
                            <LearningListItem>
                                <LearningSpan>Be careful for immediate action:</LearningSpan> If there is 'Hurry',
                                'Expires in 30 minutes' messages, it’s likely a tactic to rush you into
                                making a decision without thinking.
                            </LearningListItem>
                            <LearningListItem>
                                <LearningSpan>Check the source:</LearningSpan> Always verify the source of the
                                offer. If it’s from an unknown or suspicious website, it’s best to avoid it.
                            </LearningListItem>
                        </LearningList>
                    </LearningSection>

                </template>
            </InteractiveMCQ>

        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import InteractiveMCQ from '../../UI/Interactive/InteractiveMCQ.vue';
import type { MCQ } from '../../UI/Interactive/types';
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';
import content4_assets from '/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/content4.webp';
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue';
import LearningList from '../../UI/Learning/Listing/LearningList.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';


const emit = defineEmits(['showDown']);

const mcq: MCQ = {
    question: "",
    options: [
        { id: 'A', text: 'Think of it as Good-To-Be-True' },
        { id: 'B', text: 'Immediately click or buy before the offer expires, to avoid missing out.' },
        { id: 'C', text: 'There are only 2 left, why not buy them all' }
    ],
    correctAnswer: 'A'
};

onMounted(() => {
    emit('showDown', false);
});

</script>