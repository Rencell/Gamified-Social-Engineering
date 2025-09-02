<template>
    <LearningContent class="justify-start">
        <LearningSection>



            <LearningHeader class="mt-20">
                <LearningSpan>Look for These Red Flags</LearningSpan>

            </LearningHeader>

            <LearningBody>
                The labeled graphic (below) is perfect for showcasing a real Smishing and pointing out red flags
                that give the scam away.
            </LearningBody>

            <div class="relative">
                <img :src="image" class="w-full rounded-lg" alt="Phishing Email" />

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

import image from '/Learning/Content/phishing/RedFlags/TextScam.webp'
import ToolTip from '../../UI/Interactive/phishing/ToolTip.vue'
import type { TooltipData } from '../../UI/Interactive/phishing/type'

const areas: TooltipData[] = [
    {
        id: "header",
        title: "Sent by a number",
        description: "Legitimate organizations will not send messages from a random number. Be cautious of messages from unknown numbers.",
        x: 380,
        y: 120,
        position: 'bottomleft'
    },
    {
        id: "sidebar",
        title: "Urgent Request",
        description: "A usual tactic to fear their victim into acting quickly without thinking.",
        x: 180,
        y: 200,
    },
    {
        id: "footer",
        title: "Check Grammar & Spelling",
        description: "Many smishing messages contain spelling and grammatical errors. Legitimate companies usually proofread their messages before sending them out.",
        x: 410,
        y: 225,
        position: 'topleft'
    },
    {
        id: "content",
        title: "Suspicious Links",
        description: "Even if the link is similar to legitimate site, that doesn't mean it's safe. Always cross check from their other platform.",
        x: 420,
        y: 310,
        position: 'topleft'
    },
]
</script>