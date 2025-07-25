<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningImage :image="desktopWarning" />

        <LearningSection>
            <LearningHeader>
                Other Social Engineering attacks
            </LearningHeader>


            <LearningList>
                <LearningListItemNumbered :number="1">
                    <LearningSpan>Quid pro quo</LearningSpan>
                    attack involves the attacker requesting sensitive information from the victim in exchange for a
                    desirable service.
                </LearningListItemNumbered>
                <LearningListItemNumbered :number="2">
                    <LearningSpan>Pretexting</LearningSpan>
                    is a form of social engineering that involves composing plausible scenarios, or pretext, that are
                    likely to convince victims to share valuable and sensitive data.
                </LearningListItemNumbered>
                <LearningListItemNumbered :number="3">
                    <LearningSpan>honeytrap</LearningSpan> attack is a social engineering technique that specifically targets individuals looking
                    for love on online dating websites or social media.
                </LearningListItemNumbered>

            </LearningList>

        </LearningSection>

    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import desktopWarning from '/Learning/Content/introToSocialEngineering/CommonAttacks/ExclusiveUsePolicy@3x.png'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningListItemNumbered from '../../UI/Learning/Listing/LearningListItemNumbered.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
</script>