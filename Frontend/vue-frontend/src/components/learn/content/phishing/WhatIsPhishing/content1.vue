<template>
    <LearningContent>
        <LearningSection>

            <LearningBody>
                You're viewing your email and see an email from your bank. Providing information about your account
                having suspicious activity.
            </LearningBody>
            <LearningImage2 :image="content2_assets" />
            <InteractiveMCQ :mcq="mcq" @showDown="emit('showDown', true);">
                <template #lesson>
                    <LearningSection>
                        <LearningHeader>
                            Phishing
                        </LearningHeader>

                        <LearningBody>
                            Phishing is most popular type of cyberattack and impact both individuals and
                            corporations alike.
                        </LearningBody>

                        <LearningBody>
                            It is true that legitimate banks will never ask customers to provide sensitive information
                            such as passwords, PINs, or account numbers via email.
                        </LearningBody>

                        <LearningBody>
                            <LearningSpan>How do you defend against this?</LearningSpan>
                        </LearningBody>

                        <LearningBody>
                            If you receive a suspicious email claiming to be from your bank, it's best to contact the
                            bank directly using a trusted phone number or website, rather than clicking on any links or
                            providing any information.
                        </LearningBody>

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
import content2_assets from '/Learning/Content/phishing/WhatIsPhishing/asset1.webp';
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';
import InteractiveMCQ from '../../UI/Interactive/InteractiveMCQ.vue';
import type { MCQ } from '../../UI/Interactive/types';
import { onMounted } from 'vue';

const mcq: MCQ = {
    question: "What would you do in this situation?",
    options: [
        { id: 'A', text: 'Click the provided link so that you can verify the account' },
        { id: 'B', text: 'legitimate banks will never ask customers to provide sensitive information' },
        { id: 'C', text: 'Contact the sender using the reply function in the same email to confirm their identity' }
    ],
    correctAnswer: 'B'
};

const emit = defineEmits(['showDown']);

onMounted(() => {
    emit('showDown', false);
});

</script>