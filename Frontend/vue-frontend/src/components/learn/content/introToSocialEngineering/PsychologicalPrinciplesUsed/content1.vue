<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningContent>
            <LearningImage :image="Human" source="colcampus.com" />
            <LearningSection>
                <LearningHeader>
                    The Human Hack!
                </LearningHeader>
                <LearningBody>
                    Social engineering is tailored to exploit human psychology, by taking advantage of people's natural
                    behaviors, emotions, and motivations.
                </LearningBody>
                    
                <LearningBody>
                    <LearningSpan>Let’s look at how attackers use these in real-life situations:</LearningSpan>
                </LearningBody>
                <LearningList>
                    <LearningListItem :image="cryingemoji">
                        <LearningSpan>
                            Emotion:
                        </LearningSpan> Your best friend is currently stranded in a foreign country and needs your help to transfer
                        money.
                    </LearningListItem>
                    <LearningListItem :image="worryemoji">
                        <LearningSpan>
                            Triggering Panic:
                        </LearningSpan>
                        "Your bank account has been locked due to suspicious activity. Click here to verify your identity or your account will be permanently suspended.”
                    </LearningListItem>
                    <LearningListItem :image="curiousemoji">
                        <LearningSpan>
                            Curiosity:
                        </LearningSpan>
                        Your Co-worker sent you a message saying if this is you, followed with: click this link to see the video.
                    </LearningListItem>
                </LearningList>
            </LearningSection>

        </LearningContent>
    </div>
</template>

<script setup lang="ts">
import LearningContent from '../../UI/Learning/LearningContent.vue';
import LearningSection from '../../UI/Learning/LearningSection.vue';
import LearningHeader from '../../UI/Learning/LearningHeader.vue';
import LearningBody from '../../UI/Learning/LearningBody.vue';
import LearningSpan from '../../UI/Learning/LearningSpan.vue';
import LearningList from '../../UI/Learning/LearningList.vue'
import { ref } from 'vue';
import LearningImageBanner from '../../UI/Learning/LearningImageBanner.vue'
import LearningImage from '../../UI/Learning/LearningImage.vue';
import content1_assets from '/public/Learning/Content/introToSocialEngineering/WhatIsSocialEngineering/content1-asset.svg?url';
import Human from '/public/Human.webp?url';

import imageUrl from '/public/SecurityAwarenessEssentials@3x.svg?url'
import cryingemoji from '/public/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/crying-emoji.svg?url';
import worryemoji from '/public/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/worry-emoji.svg?url';
import curiousemoji from '/public/Learning/Content/introToSocialEngineering/PsychologySocialEngineering/curious-emoji.svg?url';

import LearningListItem from '../../UI/Learning/LearningListItem.vue'


</script>