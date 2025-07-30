<template>
    <div class="snap-start min-h-fit flex flex-col items-center justify-center">
        <LearningImage :image="content1_assets" source="colcampus.com" />

        <LearningSection>
            <LearningHeader>Hackers don't always hack</LearningHeader>
            <LearningBody>
                Ever thought about how hackers break into systems? While many imagine complex code and green and black
                on
                screens,
                one of the most effective methods is surprisingly simple. It's called
                <LearningSpan>Social engineering</LearningSpan>, and it targets people, not computers.
                Social engineers exploit <LearningSpan>human psychology</LearningSpan> to gain access to
                <LearningSpan>sensitive information</LearningSpan>.
                Learning how to recognize and defend against these tactics is crucial for everyone, not just IT
                professionals.
            </LearningBody>

            <LearningBody>
                 The way it is effective is because they will attempt
                to
                <LearningSpan>convince you to perform certain actions</LearningSpan> by impersonation
                a reliable party like a <LearningSpan>bank</LearningSpan> or <LearningSpan>colleague from your work
                </LearningSpan>.
            </LearningBody>
            <LearningQuote variant="danger">
                Social engineering is the art of manipulating people so they give up confidential information.
            </LearningQuote>
        </LearningSection>
    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningQuote from '../../UI/Learning/Highlight/LearningQuote.vue'
import content1_assets from '/Learning/Content/introToSocialEngineering/WhatIsSocialEngineering/content1-asset.png?url';
import { Button } from '@/components/ui/button'
import { onMounted } from 'vue'

const emit = defineEmits(['toggleA']);

onMounted(() => {
    emit('toggleA', false);
});


</script>


