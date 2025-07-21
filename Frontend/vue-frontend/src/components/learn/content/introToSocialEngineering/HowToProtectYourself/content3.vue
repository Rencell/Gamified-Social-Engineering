<template>
    <div class="snap-center min-h-screen flex flex-col items-center justify-center">

        <LearningImage :image="content2_asset">

        </LearningImage>

        <LearningSection>
            <LearningHeader>
                Key Takeaways
            </LearningHeader>
            <LearningBody>
                Social engineering attacks exploit human psychology, not just technical vulnerabilities. This is very
                important to understand as it highlights the need for awareness and training in cybersecurity.
            </LearningBody>

            <LearningList>
                <LearningListImage :image-src="malwareIconVibrant" alt-text="null">
                    <LearningSpan>To avoid</LearningSpan> Always keep your mind on the three
                    psychological principle: Trust, Fear and Urgency, and Curiosity.
                </LearningListImage>
                <LearningListImage :image-src="magnifyingVibrant" alt-text="null">
                    <LearningSpan>The goal</LearningSpan> The aim of Social Engineering is to manipulate individuals
                    into giving confidential or personal information
                    that may be used for fraudulent purposes.
                </LearningListImage>
                <LearningListImage :image-src="questionVibrant" alt-text="null">
                    <LearningSpan>Why learn?</LearningSpan> Awareness is very vital in this day and age, as transactions
                    and
                    communications are done online.
                    Learning how these work helps you stay protected.
                </LearningListImage>
            </LearningList>
        </LearningSection>


    </div>
</template>

<script setup lang="ts">
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningImage from '../../UI/Learning/Image/LearningImage.vue';
import content2_asset from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/content2-asset.png'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue';
import LearningListImage from '../../UI/Learning/Listing/LearningListImage.vue';
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue';
import malwareIconVibrant from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon3/malwareicon-vibrant.svg'
import magnifyingVibrant from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon3/magnifying-glass-icon-vibrant.svg'
import questionVibrant from '/public/Learning/Content/introToSocialEngineering/HowToProtectYourself/list-icon3/question-icon-vibrant.svg'

</script>
