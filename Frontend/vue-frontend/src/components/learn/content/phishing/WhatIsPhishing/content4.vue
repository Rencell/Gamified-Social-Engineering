<template>
    <LearningContent>
        <LearningSection>


            <InteractiveMCQ :mcq="mcq" @showDown="emit('showDown', true);">
                <template #lesson>
                    <LearningSection>
                        <LearningHeader>
                            What Happens If You become a victim?
                        </LearningHeader>

                        <LearningBody>
                            If you fall victim of a phishing scam, at least one of your accounts may be compromised. Do
                            you have a common password for multiple accounts? Those are at risk as well. <LearningSpan>
                                (This is a
                                great time to remind you, not to repeat passwords or usernames).</LearningSpan> 
                        </LearningBody>

                        <LearningBody>
                            Scammers
                            could gain access
                            to your bank account, which could lead to unauthorized purchases. Your identity could be
                            stolen, and you may not realize it for years. The scammer could impersonate you and create
                            or change passwords for a multitude of accounts.
                        </LearningBody>

                        <LearningBody><LearningSpan>So what to do?</LearningSpan></LearningBody>

                        <LearningList>
                            <LearningListItemNumbered :number="1">
                                Change your passwords immediately. Make sure to use strong, unique passwords for each
                                account.

                            </LearningListItemNumbered>
                            <LearningListItemNumbered :number="2">
                                Contact your bank or financial institution if you believe your financial information has
                                been compromised.
                            </LearningListItemNumbered>
                            <LearningListItemNumbered :number="3">
                                Monitor your accounts for any suspicious activity and report it to the relevant authorities
                                if necessary.
                            </LearningListItemNumbered>
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
import content2_assets from '/Learning/Content/phishing/WhatIsPhishing/asset1.webp';
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue';
import InteractiveMCQ from '../../UI/Interactive/InteractiveMCQ.vue';
import type { MCQ } from '../../UI/Interactive/types';
import { onMounted } from 'vue';
import LearningList from '../../UI/Learning/Listing/LearningList.vue';
import LearningListItemNumbered from '../../UI/Learning/Listing/LearningListItemNumbered.vue';


const mcq: MCQ = {
    question: "If you use the same password for multiple accounts, falling victim to a phishing scam could put all of those accounts at risk",
    options: [
        { id: 'A', text: 'True' },
        { id: 'B', text: 'False' }
    ],
    correctAnswer: 'A'
};

const emit = defineEmits(['showDown']);

onMounted(() => {
    emit('showDown', false);
});
</script>