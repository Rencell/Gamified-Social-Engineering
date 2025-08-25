<template>
    <LearningContent>
        <LearningSection>
            <LearningHeader>
                Other Manipulation Techniques
            </LearningHeader>

            <LearningBody>
                there are other key tactics and techniques used in social engineering attacks that are not included in
                that list such as:
            </LearningBody>
            <LearningBody>
                <FlippingCard :data="data" />
            </LearningBody>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import FlippingCard from '../../UI/Interactive/FlippingCard.vue'
import type { FlippingCardData } from '../../UI/Interactive/types';

const data: FlippingCardData[] = [
    {
        front: 'Using appropriate body language',
        back: 'it is key that the victim doesn’t perceive you as a potential threat; Attackers may be calm in approaching their victims, using appropriate body language to appear non-threatening. Example: "I’m just here to help you with your issue."'
    },
    {
        front: 'Using your knowledge to help',
        back: 'To build a connection with the victim, attackers may use their knowledge to help the victim. Example: "I understand your problem, let me assist you."'
    },
    {
        front: 'Complimenting',
        back: 'Attackers may use compliments to build connection with the victim. Example: "You look so great today, Would you open me the door in IT deptartment"'
    },
    {
        front: 'Leveraging empathy',
        back: 'An attacker will put themself in a difficult situation in the hope that the victim will feel empathy and then be more vulnerable to fall into a trap to give information'
    }
];

</script>