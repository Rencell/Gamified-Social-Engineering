<template>
    <LearningContent>
        <LearningSection>
            <LearningHeader>
                The Art of Manipulation
            </LearningHeader>
            <LearningImage2 :image="content2_assets" />

            <InteractiveMCQ :mcq="mcq" @showDown="emit('showDown', true);">
                <template #lesson>
                    <LearningSection>
                        <LearningHeader>
                            Trust
                        </LearningHeader>
                        <LearningBody>
                            It is more likely that people will follow an order when it is given by a person with
                            authority
                            <LearningSpan>(or at least pretending to have it)</LearningSpan>.
                            Impersonating a cybersecurity expert, influencer, or any other credible or known person
                            is a typical
                            case of using authority to influence the
                            victim into executing a questionable action.
                        </LearningBody>

                        <LearningBody>
                            From the image, the attacker calls the victim, impersonating someone from the IT or
                            security
                            department. However, what the victim does not
                            know is that the code they are giving to the attacker is actually a password reset code
                            that will give full access to the attacker
                        </LearningBody>

                        <LearningBody>
                            <LearningSpan>How do you defend against this?</LearningSpan>
                        </LearningBody>

                        <LearningList>
                            <LearningListItem>
                                <LearningSpan>Verify the identity of the person:</LearningSpan> Always verify the
                                identity of the person before sharing any sensitive information or executing any
                                actions.
                            </LearningListItem>
                            <LearningListItem>
                                <LearningSpan>Be cautious with requests:</LearningSpan> Always remember that
                                legitimate requests will not pressure you into making quick decisions. Take your time to
                                verify the request.
                            </LearningListItem>
                            <LearningListItem>
                                <LearningSpan>Don't trust anyone</LearningSpan> Even if a message or request seems to
                                come from someone you know,
                                always double-check through another channel (e.g., call, in-person, or official email)
                                before taking action.
                            </LearningListItem>
                        </LearningList>
                    </LearningSection>
                </template>
            </InteractiveMCQ>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import content2_assets from '/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/content2.webp';
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';
import InteractiveMCQ from '../../UI/Interactive/InteractiveMCQ.vue';
import type { MCQ } from '../../UI/Interactive/types';
import LearningList from '../../UI/Learning/Listing/LearningList.vue';
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue';
import { onMounted } from 'vue';

const mcq: MCQ = {
    question: "Based on the image, which psychological trigger is the attacker primarily using to manipulate the victim?",
    options: [
        { id: 'A', text: 'Trust' },
        { id: 'B', text: 'Fear and Urgency' },
        { id: 'C', text: 'Curiosity' }
    ],
    answer: 'A'
};

const emit = defineEmits(['showDown']);

onMounted(() => {
    emit('showDown', false);
});
</script>