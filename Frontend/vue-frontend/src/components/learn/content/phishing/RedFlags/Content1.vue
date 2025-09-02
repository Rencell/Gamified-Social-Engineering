<template>
    <LearningContent class="justify-start">
        <LearningSection>

            <LearningHeader>Phishing Attempts Can Be Tricky to Spot</LearningHeader>

            <LearningBody>
                Scammers may dig up personal information about you on social media, company websites, or other public
                profiles to make their communications more personalized — and more challenging to detect.
            </LearningBody>

            <LearningHeader class="mt-20">
                <LearningSpan>Look for These Red Flags</LearningSpan>

            </LearningHeader>

            <LearningBody>
                The labeled graphic (below) is perfect for showcasing a real phishing email and pointing out red flags
                that give the scam away.
            </LearningBody>

            <div class="relative">
                <img :src="image" class="w-full rounded-lg" alt="Phishing Email" />

                <!-- Render Tooltips -->
                <ToolTip :areas="areas" />
            </div>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';

import image from '/Learning/Content/phishing/RedFlags/PhishingEmail.png'
import { ref } from 'vue';
import { computed } from 'vue';
import { set } from '@vueuse/core';
import ToolTip from '../../UI/Interactive/phishing/ToolTip.vue'
import type { TooltipData } from '../../UI/Interactive/phishing/type'

const areas: TooltipData[] = [
    {
        id: "footer",
        title: "Urgent request",
        description: "Creates a sense of urgency to prompt immediate action",
        x: 420,
        y: 30,
        position: 'bottomleft'
    },
    {
        id: "header",
        title: "Always check the sender's email address",
        description: "The sender's name may look familiar, but the email address is often a dead giveaway. Look for slight misspellings or unusual domain names.",
        x: 10,
        y: 80,
    },
    {
        id: "sidebar",
        title: "Generic Information",
        description: "If an email was important enough to send to you, it should not include generic information. However still be cautious of emails that include your name but have other red flags (Spear Phishing).",
        x: 40,
        y: 150,
    },
    {
        id: "content",
        title: "Suspicious Links",
        description: "It seems that they are trying to make it easy for you by providing the link for quick access. But where does that hyperlink take you?",
        x: 220,
        y: 240,
    },
    {
        id: "search",
        title: "Search Function",
        description: "Search bar to find specific content on the site ",
        x: 150,
        y: 420,
        position: 'topright'
    },
]





</script>