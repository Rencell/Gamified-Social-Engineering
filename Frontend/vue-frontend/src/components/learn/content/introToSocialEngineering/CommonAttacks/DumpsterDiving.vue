<template>
    <LearningContent>
        <!-- <LearningImage :image="phishingIcon" /> -->
        <LearningSection>
            <InteractiveMCQ :image="dumpsterdiving" :mcq="mcq" @showDown="emit('showDown', true);">
    
                <template #lesson>
                    <LearningSection>
                        <LearningHeader>
                            Dumpster Diving
                        </LearningHeader>
                        <LearningImage2 :image="dumpsterdiving" :alt-text="'Conversation Image'" />
                        <LearningBody>
                            <LearningSpan>Dumpster Diving</LearningSpan> from the word itself Dump diving which means
                            searching through trash or discarded items <LearningSpan>to find sensitive information
                            </LearningSpan> that can be used
                            for malicious purposes.
                        </LearningBody>
    
                        <LearningBody>
                            One of the most famous dumpster diving attacks was performed back in 1992 when <LearningSpan>
                                Kevin
                                Mitnick</LearningSpan>
                            gained access to
                            sensitive information from the trash of the Pacific Bell data center in Los Angeles. By
                            searching the trash of the
                            office, Kevin found documentation containing <LearningSpan2>users and passwords</LearningSpan2>,
                            user
                            manuals, and other
                            sensitive information that
                            gave him access to their systems.
                        </LearningBody>

                        <LearningBody>
                            <LearningSpan>
                                Protecting yourself against dumpster diving:
                            </LearningSpan>
                        </LearningBody>

                        <LearningList>
                            <LearningListItem>
                                <LearningSpan>Shred sensitive documents:</LearningSpan> Always shred sensitive documents
                                before disposing of them.
                            </LearningListItem>
                            <LearningListItem>
                                <LearningSpan>Secure your area: </LearningSpan> Limit the access of unauthorized people in sensitive areas.
                            </LearningListItem>
                            
                            <LearningListItem>
                                <LearningSpan>Don't throw storage devices:</LearningSpan> Never throw away storage devices like hard drives or USBs without properly wiping them.
                            </LearningListItem>

                        </LearningList>
    
    
                    </LearningSection>
                </template>
            </InteractiveMCQ>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import dumpsterdiving from '/Learning/Content/introToSocialEngineering/CommonAttacks/dumpdiving/dumpdiving.webp'

import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningSpan2 from '../../UI/Learning/Highlight/LearningSpan2.vue'

import LearningContent from '../../UI/Learning/Core/LearningContent.vue'
import LearningImage2 from '../../UI/Learning/Image/LearningImage2.vue'
import { onMounted } from 'vue'
import InteractiveMCQ from '../../UI/Interactive/InteractiveMCQ.vue'
import type { MCQ } from '../../UI/Interactive/types'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'

const emit = defineEmits(['showDown']);
onMounted(() => {
    emit('showDown', false)
});

const mcq: MCQ = {
    question: "Which do you think describes Dumpster Diving Attack?",
    options: [
        { id: 'A', text: 'Searching trash for sensitive information.' },
        { id: 'B', text: 'Following the victim to gain their personal information' },
        { id: 'C', text: 'An act to impersonate a famous person' }
    ],
    answer: 'A'
};

</script>