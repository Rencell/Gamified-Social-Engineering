<template>
    <div class="snap-start min-h-fit flex flex-col items-center justify-center my-20">
        <LearningImage :image="phishingIcon" />
        <LearningSection>
            <LearningHeader>
                Phishing
            </LearningHeader>
            <LearningBody>
                Phishing is a type of social engineering attack where an attacker attempts to trick individuals into
                providing sensitive information, such as usernames, passwords, or credit card details, by masquerading
                as a trustworthy entity in electronic communications.
            </LearningBody>

            <LearningBody>
                <LearningSpan>
                    There are several common types of phishing attacks:
                </LearningSpan>
            </LearningBody>

            <LearningList>
                <LearningListImage :image-src="emailListIcon" :alt-text="'Email Phishing Icon'">
                    <LearningSpan2 >Email Phishing:</LearningSpan2> The most common form, where attackers send <LearningSpan>fraudulent emails</LearningSpan> that appear to be from legitimate sources.
                </LearningListImage>
                <LearningListImage :image-src="TelephoneListIcon" :alt-text="'Telephone Icon'">
                    <LearningSpan2 >Vishing:</LearningSpan2> Where attackers use <LearningSpan>phone calls</LearningSpan> to trick victims into revealing personal information.
                </LearningListImage>
                <LearningListImage :image-src="MobilePhoneListIcon" :alt-text="'Telephone Icon'">
                    <LearningSpan2 >Smishing:</LearningSpan2> Phishing attempts via <LearningSpan>SMS messages</LearningSpan>, often containing malicious links.
                </LearningListImage>
                <LearningListImage :image-src="whaleIcon" :alt-text="'Whale Icon'">
                    <LearningSpan2 >Whailing:</LearningSpan2> A more targeted form of phishing that focuses on <LearningSpan>high-profile individuals or organizations</LearningSpan>, often using personalized information to increase credibility.
                </LearningListImage>

            </LearningList>
            <div class="mb-20"></div>
        </LearningSection>

    </div>
</template>

<script setup lang="ts">
import LearningImage from '../../UI/Learning/Image/LearningImage.vue'
import phishingIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/phishing@2x.webp'
import LearningSection from '../../UI/Learning/Core/LearningSection.vue'
import LearningBody from '../../UI/Learning/Core/LearningBody.vue'
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue'
import LearningSpan from '../../UI/Learning/Highlight/LearningSpan.vue'
import LearningList from '../../UI/Learning/Listing/LearningList.vue'
import LearningListItem from '../../UI/Learning/Listing/LearningListItem.vue'
import LearningSpan2 from '../../UI/Learning/Highlight/LearningSpan2.vue'


import emailListIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/email-phishing-icon.svg'
import TelephoneListIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/telephone-icon.svg'
import MobilePhoneListIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/mobile-phone-icon.svg'
import whaleIcon from '/Learning/Content/introToSocialEngineering/CommonAttacks/listIcons/whale-icon.svg'
import LearningListImage from '../../UI/Learning/Listing/LearningListImage.vue'

</script>