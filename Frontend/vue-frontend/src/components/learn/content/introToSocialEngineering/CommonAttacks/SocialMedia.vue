<template>
    <div class="snap-start min-h-screen flex flex-col items-center justify-center">
        <LearningImage :image="Social_Media" />

        <LearningSection>
            <LearningHeader>
                Social Media Fraud
            </LearningHeader>
            <LearningBody>
                Many of us have come to depend on platforms like Facebook, Instagram, and Twitter to stay connected,
                follow the news, and even make purchases. However, as their popularity has grown, so has the risk of
                fraud.
            </LearningBody>

            <LearningList>
                <LearningListItem>
                    <LearningSpan>Infected friends</LearningSpan>: Be cautious when a friend asks for help or shares
                    links, as their account may have been compromised by attackers.
                </LearningListItem>
                <LearningListItem>
                    <LearningSpan>Bot accounts</LearningSpan>: You may come across a post that has a lot of positive
                    feedback; bots may manipulate the post to make it appear more convincing.
                </LearningListItem>
                <LearningListItem>
                    <LearningSpan>OSINT</LearningSpan>: OSINT stands for Open Source Intelligence. It just means people
                    can find and use info that’s already out there online. Example your social media posts or public
                    profiles which scammers might use to trick you.
                </LearningListItem>
            </LearningList>
        </LearningSection>

    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import Social_Media from '/public/Learning/Content/introToSocialEngineering/CommonAttacks/Social_Media.webp'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
</script>